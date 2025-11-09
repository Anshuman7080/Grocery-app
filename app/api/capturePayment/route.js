// app/api/payment/initiate/route
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { instance } from '@/lib/razorpay';

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'User is not signed in' },
      { status: 403 }
    );
  }


  const userId = session.user.id;
  console.log('User ID in capturePayment:', userId);

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { item: true },
    });

    let totalAmount = 0;
    for (const cartItem of cartItems) {
      totalAmount += cartItem.item.price;
    }

    console.log('Total amount in capturePayment:', totalAmount);

    const currency = 'USD';
    const options = {
      amount: totalAmount * 100, 
      currency,
      receipt: `receipt_${Date.now()}`,
    };


    const paymentResponse = await instance.orders.create(options);
  

    return NextResponse.json({
      success: true,
      ...paymentResponse,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, message: 'Could not initiate order' },
      { status: 500 }
    );
  }
}
