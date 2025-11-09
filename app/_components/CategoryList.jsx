import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CategoryList = ({categoryList}) => {
 
  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      <h2 className="text-green-600 font-bold text-xl sm:text-2xl md:text-3xl">Shop by Category</h2>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4">
        {
          categoryList.map((category,index)=>(
            <Link href={`/product-category/${category?.name}`} key={index}
            className="flex flex-col items-center bg-green-50 gap-2 p-2 sm:p-3 md:p-4 rounded-lg group cursor-pointer hover:bg-green-600 hover:text-white transition-all duration-300 ease-in-out">
              <Image src={category?.image}
                width={50} 
                height={50}
                alt='icon'
                className="group-hover:scale-125 transition-all ease-in-out w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
              />
              <h2 className="text-green-800 group-hover:text-white transition-all ease-in-out text-xs sm:text-sm md:text-base text-center line-clamp-2">{category?.name}</h2>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default CategoryList