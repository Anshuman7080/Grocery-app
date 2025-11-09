'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import moment from 'moment';
import MyOrderItem from './_components/MyOrderItem';


const page = () => {
      const { data: session, status } = useSession();
      const router = useRouter();
const [orderDetails,setOrderDetails]=useState([]);
      useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
          router.push('/login');
        } 
      }, [session, status]);

  useEffect(() => {
    const fetOrderDetails = async () => {
      try {
        const res = await fetch('/api/getOrderDetails');
        const data = await res.json();
        
        setOrderDetails(data.orders)
      
      } catch (err) {
        console.error('Error fetching order Details:', err);
      }
    };

    if (session?.user?.email) {
      fetOrderDetails();
    }
  }, [session,status]);


        if (status === 'loading') {
    return <div className="text-center py-10 text-lg font-medium">Loading...</div>;
  }

console.log("order details",orderDetails);


  return (
    <div className="min-h-screen w-full">
      <h2 className='p-3 sm:p-4 md:p-5 bg-green-700 text-lg sm:text-xl md:text-2xl font-bold text-center text-white'>
        My Order
      </h2>
      
      <div className="py-4 sm:py-6 md:py-8 px-3 sm:px-5 md:px-10 lg:px-20 max-w-7xl mx-auto w-full">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4 sm:mb-6">
          Order History
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {orderDetails?.map((item,index)=>(
            <Collapsible key={index} className="w-full">
              <CollapsibleTrigger className="w-full">
                <div className="border rounded-lg p-3 sm:p-4 bg-slate-100 
                  hover:bg-slate-200 transition-colors duration-200
                  flex flex-col sm:flex-row sm:justify-between sm:items-center 
                  gap-2 sm:gap-4 w-full text-left">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-wrap">
                    <h2 className="text-xs sm:text-sm md:text-base">
                      <span className="font-bold mr-2">Order Date:</span>
                      <span className="text-gray-700">{moment(item?.createdAt).format('DD/MMM/YYYY')}</span>
                    </h2>
                    
                    <h2 className="text-xs sm:text-sm md:text-base">
                      <span className="font-bold mr-2">Amount:</span>
                      <span className="text-green-600 font-semibold">${item?.total}</span>
                    </h2>
                    
                    <h2 className="text-xs sm:text-sm md:text-base">
                      <span className="font-bold mr-2">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs sm:text-sm font-medium
                        ${item?.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          item?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {item?.status}
                      </span>
                    </h2>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2">
                <div className="border rounded-lg overflow-hidden bg-white">
                  {item?.items?.map((subItem,subIndex)=>(
                    <MyOrderItem orderItem={subItem} key={subIndex}/>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {orderDetails?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base sm:text-lg">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page