import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("🔐 Incoming payment verification data:", data);

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: 'User is not signed in' },
        { status: 403 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    const userId = session.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment details' },
        { status: 400 }
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');


if (expectedSignature === razorpay_signature) {
 
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { item: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
  }

  
  const total = cartItems.reduce((sum, cartItem) => {
    return sum + cartItem.price * cartItem.quantity;
  }, 0);


  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: 'PLACED',
      paymentId: razorpay_payment_id,
      items: {
        create: cartItems.map(cartItem => ({
          itemId: cartItem.itemId,
          quantity: cartItem.quantity,
        })),
      },
    },
  });

  // Delete cart items
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return NextResponse.json({
    success: true,
    message: 'Payment Verified and Order Created',
    orderId: order.id,
  });
    }
    else {
      return NextResponse.json({ success: false, message: 'Invalid signature. Payment verification failed.' });
    }
  } catch (error) {
    console.error(" Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
