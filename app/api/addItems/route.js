import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { cloudinaryConnect } from '@/lib/cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(req){
    try{
    
        const session=await getServerSession(authOptions);
        
              if (!session || session.user?.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Only admin can add Items',
        }),
        { status: 403 }
      )
      }

      

     const formData = await req.formData()
     const name = formData.get('name')
     const image = formData.get('image')
       const price = formData.get('price')
     const stock = formData.get('stock')
     const categoryId = formData.get('categoryId')

            if (!name || !image || !price || !stock || !categoryId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All fields are required',
        }),
        { status: 400 }
      )
        }

        cloudinaryConnect()
        
            const arrayBuffer = await image.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
        
        
            const imageResponse = await uploadImageToCloudinary(buffer, process.env.FOLDER_NAME)
            
        
            const secureUrl = imageResponse?.secure_url
        console.log("coming here1")
            if (!secureUrl) {
              return new Response(
                JSON.stringify({
                  success: false,
                  message: 'Image upload failed',
                }),
                { status: 500 }
              )
            }

             
        console.log("coming here 2")
        
            const response = await prisma.item.create({
              data: {
               name:name,
                image: secureUrl,
               price: parseFloat(price),
                stock:parseInt(stock),
                categoryId
              },
            })
            console.log("coming here 3")

            
        
            return new Response(
              JSON.stringify({
                success: true,
                message: 'Item Added successfully',
                data: response,
              }),
              { status: 200 }
            )



    }catch(error){
        console.log("error is",error);
        return new Response (
            JSON.stringify({
                success: false,
                  error: error.message || 'Something went wrong',
            }),
            {status:500}
        )
    }
}
