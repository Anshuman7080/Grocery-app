"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import React from "react"

const Page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-white border border-green-100 shadow-2xl rounded-2xl flex flex-col items-center text-center p-12 sm:p-20 gap-4 transition-all duration-300 hover:shadow-green-200 hover:-translate-y-1">
        
        <div className="relative">
          <div className="absolute inset-0 bg-green-200 blur-2xl opacity-50 rounded-full"></div>
          <CheckCircle2 className="relative h-24 w-24 text-green-600 drop-shadow-lg" />
        </div>

        <h2 className="font-bold text-4xl text-green-700 mt-4 tracking-tight">
          Order Successful!
        </h2>

        <p className="text-gray-600 text-lg mt-2 max-w-md">
          Thank you for your purchase! We’re processing your order and will notify you once it’s ready.
        </p>

        <Link href="/my-order" className="mt-8">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            Track Your Order
          </Button>
        </Link>

        <p className="mt-8 text-sm text-gray-400 italic">
          You can check your order anytime from your account dashboard.
        </p>
      </div>
    </div>
  )
}

export default Page
