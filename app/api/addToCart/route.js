import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req) {
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

    const formData = await req.formData()
    const itemId = formData.get('itemId')
    const quantity = parseInt(formData.get('quantity'))
    const price = parseFloat(formData.get('price'))
    const userId = session.user.id

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        itemId,
        userId,
      },
    })

    let response
    if (existingItem) {
      // Update quantity and price
      response = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
          price: existingItem.price + price,
        },
      })
    } else {
      // Create new cart item
      response = await prisma.cartItem.create({
        data: {
          itemId,
          quantity,
          price,
          userId,
        },
      })
    }

    console.log('response of adding to cart', response)

    return new Response(
      JSON.stringify({
        success: true,
        message: existingItem
          ? 'Item quantity updated in cart successfully'
          : 'Item added to cart successfully',
      }),
      { status: 200 }
    )
  } catch (error) {
    console.log('error in adding to cart', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal Server Error',
      }),
      { status: 500 }
    )
  }
}
