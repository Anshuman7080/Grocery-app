// lib/razorpay.js
'use client'

import { useContext } from "react";
import toast from "react-hot-toast";



function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function buyCartItem({router,session,setUpdateCart,updateCart}) {
  


  try {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      error("Razorpay SDK failed to load");
      return;
    }

    const orderRes = await fetch("/api/capturePayment", {
      method: "POST",
    }).then(res => res.json());

    
    if (!orderRes.success) throw new Error(orderRes.message);
  

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      currency: orderRes.currency,
      amount: `${orderRes.amount}`,
      order_id: orderRes.id,
      name: "Grocery-app",
      description: "Thank You for Purchasing the Items",
      image: "/rzp_logo.png",
      prefill: {
        name: session?.user?.name,
        email: session?.user?.email,
      },
      handler: async (response) => {
      
        await verifyPayment({ ...response }, session, router,setUpdateCart,updateCart);
      },
    };
    
    
    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on("payment.failed", (res) => {
      toast.error("Oops, payment failed");
      console.error("error in buy cart item in rzp.on",res.error);
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
   toast.error("Could not make payment");
  }

  
}



async function verifyPayment(bodyData, session, router,setUpdateCart,updateCart) {
  
 
  try {
    const res = await fetch("/api/verifyPayment", {
      method: "POST",
      body: JSON.stringify(bodyData),
    }).then(res => res.json());

    if (!res.success) throw new Error(res.message);

    toast.success("Payment successful!");
    router.replace("/order-confirmation");
  setUpdateCart(!updateCart)
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    alert("Could not verify payment");
  }

 

}
