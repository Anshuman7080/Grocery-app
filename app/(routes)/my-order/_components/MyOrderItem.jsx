import Image from 'next/image'
import React from 'react'

const MyOrderItem = ({orderItem}) => {
  return (
    <div className="w-[60%]">
        <div className=" grid grid-cols-5  mt-3 items-center">
      <Image src={orderItem?.item?.image}
        width={80} height={80} alt='image'
        className="bg-gray-100 p-5 rounded-md border"
      />
      <div className="col-span-2">
        <h2>{orderItem?.item?.name}</h2>
        <h2>Item Price:{orderItem?.item?.price}</h2>
      </div>

      <h2>Quantity:{orderItem?.quantity}</h2>
      <h2>Price:{orderItem?.quantity * orderItem?.item?.price}</h2>
    
    </div>
    <hr className="mt-3"></hr>
    </div>
  )
}

export default MyOrderItem
