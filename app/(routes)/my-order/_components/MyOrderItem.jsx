import Image from 'next/image'
import React from 'react'

const MyOrderItem = ({orderItem}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 
        gap-3 sm:gap-4 p-3 sm:p-4 items-center">
        
        {/* Image */}
        <div className="flex justify-center sm:justify-start">
          <Image 
            src={orderItem?.item?.image}
            width={80} 
            height={80} 
            alt={orderItem?.item?.name || 'product image'}
            className="bg-gray-100 p-3 sm:p-5 rounded-md border w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>

        {/* Item Details */}
        <div className="col-span-1 sm:col-span-1 md:col-span-2 text-center sm:text-left">
          <h2 className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 line-clamp-2">
            {orderItem?.item?.name}
          </h2>
          <h2 className="text-xs sm:text-sm text-gray-600 mt-1">
            <span className="font-medium">Item Price: </span>
            <span className="text-green-600 font-semibold">${orderItem?.item?.price}</span>
          </h2>
        </div>

        {/* Quantity */}
        <div className="text-center sm:text-left">
          <h2 className="text-xs sm:text-sm md:text-base text-gray-700">
            <span className="font-medium">Quantity: </span>
            <span className="font-semibold">{orderItem?.quantity}</span>
          </h2>
        </div>

        {/* Total Price */}
        <div className="text-center sm:text-left">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-700">
            <span className="font-medium text-gray-700 text-xs sm:text-sm md:text-base">Total: </span>
            ${(orderItem?.quantity * orderItem?.item?.price).toFixed(2)}
          </h2>
        </div>
      </div>
      
      <hr className="border-gray-200"/>
    </div>
  )
}

export default MyOrderItem