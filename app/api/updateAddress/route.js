import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User is not Signed In',
        }),
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, zip, addressBlock } = body;

    const response = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        address: {
          set: {
            name,
            email,
            phone,
            zip,
            addressBlock,
          },
        },
      },
    });

    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Address updated successfully',
        response,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating address:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to update address',
      }),
      { status: 500 }
    );
  }
}
