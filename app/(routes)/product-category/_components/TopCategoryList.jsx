
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const TopCategoryList = ({categoryList,selectedCategory}) => {
    
  return (
       <div className="flex gap-5 mt-2 overflow-auto mx-7 md:mx-20 justify-center">
            {
                categoryList.map((category,index)=>(
                    <Link href={`/product-category/${category?.name}`} key={index}
                    className={`flex flex-col items-center bg-green-50 gap-2 p-3 rounded-lg group cursor-pointer
                    hover:bg-green-600 hover:text-white
                    w-[150px] min-w-[100px] 
                      ${selectedCategory == category?.name && 'bg-green-600 text-white'  }   `}>
                        <Image src={category?.image}
                            width={50} 
                            height={50}
                            alt='icon'
                            className="group-hover:scale-125 transition-all ease-in-out"
                        />
                        <h2 className={`text-green-800 group-hover:text-white transition-all ease-in-out 
                      ${selectedCategory == category?.name && ' text-white'  }   `}>{category?.name}</h2>
                    </Link>
                ))
            }
           </div>
  )
}

export default TopCategoryList
