

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export async function GET(){
  try{
     const session = await getServerSession(authOptions)
       if (!session ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User is not Signed In',
        }),
        { status: 403 }
      )
    } 

      const response = await prisma.cartItem.findMany({
        where: {
    userId: session.user.id,
      },
       include: {
               item: true, 
      },
       });

       
 


       return new Response(JSON.stringify({
        success:true,
        response:response
       }),{
        status:200
       })


  }
  catch(error){
    console.log("error in getting cart item");
    return new Response(JSON.stringify({
        success:false,
        message:"error in getting cart items"
    }),{
        status:500
    })
  }
}