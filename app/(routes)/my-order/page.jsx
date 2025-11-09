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
    <div>
    <h2 className='p-3 bg-green-700 text-xl font-bold text-center text-white'>My Order</h2>
    <div className="py-8 mx-7 md:mx-20">
        <h2 className="text-3xl font-bold text-green-700">Order History</h2>

             <div className="">

             {orderDetails?.map((item,index)=>(
                   <Collapsible key={index} className="mt-3">
                          <CollapsibleTrigger>
                            <div className="border p-2 bg-slate-100 flex justify-evenly gap-24">
                           <h2><span className="font-bold mr-2">Order Date:</span>{moment(item?.createdAt).format('DD/MMM/yyy')}</h2>
                           <h2><span className="font-bold mr-2">Order Amount:</span>${item?.total} </h2>
                           <h2><span className="font-bold mr-2">Order Status:</span>{item?.status} </h2>
                             </div>
                       </CollapsibleTrigger>
                              <CollapsibleContent>
                            {item?.items?.map((subItem,subIndex)=>(
                             <MyOrderItem orderItem={subItem} key={subIndex}/>
                            ))}
                              </CollapsibleContent>
                             </Collapsible>
             ))}
                        
             </div>
    </div>
      
    </div>
  )
}

export default page
