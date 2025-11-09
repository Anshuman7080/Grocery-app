import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function DELETE(req) {
    console.log("coming here");
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User is not Signed In',
        }),
        { status: 403 }
      )
    }

    const { itemId } = await req.json()
    const userId = session.user.id
    console.log("item id is",itemId);

    // Check if the item exists for the user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        itemId,
        userId,
      },
    })

    if (!existingItem) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Item not found in cart',
        }),
        { status: 404 }
      )
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: {
        id: existingItem.id,
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Item removed from cart successfully',
      }),
      { status: 200 }
    )
  } catch (error) {
    console.log('error in deleting cart item', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal Server Error',
      }),
      { status: 500 }
    )
  }
}
