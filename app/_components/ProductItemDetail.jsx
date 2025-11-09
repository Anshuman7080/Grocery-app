'use client'
import { Button } from '@/components/ui/button'
import { ShoppingBasket } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UpdateCartContext } from '../_context/UpdateCartContext'
import toast from 'react-hot-toast'

const ProductItemDetail = ({ product }) => {
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext)

  const [productTotalPrice, setProductTotalPrice] = useState(product?.price)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false) 
  const router = useRouter()
  const { data: session } = useSession()

  const addToCart = async () => {
    if (!session) {
      router.push("/login")
      return
    }

    setIsAdding(true) // 👈 Disable button immediately

    const formData = new FormData()
    formData.append('itemId', product.id)
    formData.append('quantity', quantity)
    formData.append("price", productTotalPrice * quantity)

    try {
      const res = await fetch('/api/addToCart', {
        method: 'POST',
        body: formData,
      })
      const response = await res.json()
      console.log("response of adding to cart", response)

      if (res.ok) {
        setUpdateCart(!updateCart)
       toast.success('Item added to cart successfully!')
       
      } else {
        toast.error(response.error || 'Error in adding to cart')
        
      }
    } catch (error) {
      console.error("Add to cart failed", error)
      toast.error("Something went wrong")
    } finally {
      setIsAdding(false) // 👈 Re-enable button after request
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black">
      <Image
        src={product?.image}
        alt='image'
        width={300}
        height={300}
        className="bg-slate-200 h-[321px] w-[300px] object-contain rounded-lg -ml-4"
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{product?.name}</h2>
        <h2 className="text-sm text-gray-500">"One of the best product of our Shop"</h2>

        <h2 className="font-medium text-lg">Quantity ({product?.stock})</h2>
        <div className="flex flex-col items-baseline gap-3">
          <div className="flex gap-3 items-center">
            <div className="p-2 border flex gap-10 items-center pr-5">
              <button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}>-</button>
              <h2>{quantity}</h2>
              <button disabled={quantity === product?.stock} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <h2 className="text-2xl font-bold">=${(quantity * productTotalPrice).toFixed(2)}</h2>
          </div>

          <Button
            className="flex gap-3"
            onClick={addToCart}
            disabled={isAdding} 
          >
            <ShoppingBasket />
            {isAdding ? "Adding..." : "Add To Cart"}
          </Button>
        </div>

        <h2><span className="font-bold">Category:</span> {product?.category?.name}</h2>
      </div>
    </div>
  )
}

export default ProductItemDetail
