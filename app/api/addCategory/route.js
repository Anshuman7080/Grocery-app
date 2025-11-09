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
          message: 'Only admin can add category',
        }),
        { status: 403 }
      )
      }

      

     const formData = await req.formData()
     const name = formData.get('name')
     const image = formData.get('image')
   

            if (!name || !image) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Name and image are required',
        }),
        { status: 400 }
      )
        }

        cloudinaryConnect()
        
            const arrayBuffer = await image.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
        
        
            const imageResponse = await uploadImageToCloudinary(buffer, process.env.FOLDER_NAME)
            
        
            const secureUrl = imageResponse?.secure_url
        
            if (!secureUrl) {
              return new Response(
                JSON.stringify({
                  success: false,
                  message: 'Image upload failed',
                }),
                { status: 500 }
              )
            }

             
        
        
            const response = await prisma.category.create({
              data: {
                name,
                image: secureUrl,
              },
            })

            
        
            return new Response(
              JSON.stringify({
                success: true,
                message: 'Category Created successfully',
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
