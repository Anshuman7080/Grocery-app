

import { v2 as cloudinary } from 'cloudinary'


export function cloudinaryConnect() {
  console.log('Cloudinary ENV:', {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,

})

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  })
}



export async function uploadImageToCloudinary(fileBuffer, folder, height, quality) {
  const options = { folder, resource_type: 'auto' }
  if (height) options.height = height
  if (quality) options.quality = quality

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
    uploadStream.end(fileBuffer)
  })
}
