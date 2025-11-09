import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const TopCategoryList = ({categoryList,selectedCategory}) => {
    
  return (
    <div className="w-full py-3 sm:py-4 md:py-5 bg-white">
      <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 
        overflow-x-auto overflow-y-visible
        px-3 sm:px-5 md:px-10 lg:px-20 
        justify-start md:justify-center
        pb-3
        [-webkit-overflow-scrolling:touch]">
        {
          categoryList.map((category,index)=>(
            <Link 
              href={`/product-category/${category?.name}`} 
              key={index}
              className={`flex flex-col items-center bg-green-50 
                gap-2 p-2 sm:p-3 md:p-4 rounded-lg group cursor-pointer
                hover:bg-green-600 hover:text-white
                transition-all duration-300 ease-in-out
                flex-shrink-0
                w-[100px] sm:w-[110px] md:w-[130px] lg:w-[150px]
                min-h-[100px] sm:min-h-[110px] md:min-h-[120px]
                ${selectedCategory == category?.name && 'bg-green-600 text-white shadow-lg scale-105'}`}>
              <div className="w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 relative flex-shrink-0">
                <Image 
                  src={category?.image}
                  fill
                  alt={category?.name || 'category icon'}
                  className="object-contain group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </div>
              <h2 className={`text-green-800 group-hover:text-white 
                transition-all duration-300 ease-in-out 
                text-[11px] sm:text-sm md:text-base font-medium
                text-center line-clamp-2 w-full
                leading-tight
                ${selectedCategory == category?.name && 'text-white'}`}>
                {category?.name}
              </h2>
            </Link>
          ))
        }
        {/* Spacer for last item visibility */}
        <div className="w-3 flex-shrink-0 md:hidden" aria-hidden="true"></div>
      </div>
    </div>
  )
}

export default TopCategoryList