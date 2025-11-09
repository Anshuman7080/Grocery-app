import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { UpdateCartContext } from '../_context/UpdateCartContext'
import toast from 'react-hot-toast'

const CartItemList = ({ cartItemList }) => {
    console.log("cart item list",cartItemList);
 
    const {updateCart,setUpdateCart}=useContext(UpdateCartContext)  
 const [subTotal, setSubTotal] = useState(0)
  useEffect(() => {
    let total = 0
    cartItemList.forEach((element) => {
      total += element.price
    })
    setSubTotal(total.toFixed(2))
  }, [cartItemList])

  const onDeleteItem = async (itemId) => {
    try {
      const response = await fetch('/api/deleteCartItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })

      const data = await response.json()
      if (data.success) {
        setUpdateCart(!updateCart);
        toast.success("Item Removed from cart")
     
      } else {
        console.error('Delete failed:', data.message)
        toast.error('Delete failed:', data.message)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error deleting item:', error)
    }
  }

  return (
    <div>
      <div className="h-[450px] overflow-auto">
        {cartItemList.map((cart, index) => (
          <div key={index} className="flex justify-between items-center p-2">
            <div className="flex gap-6 items-center">
              <Image
                src={cart?.item?.image}
                width={90}
                height={90}
                alt={cart?.item?.name}
                className="border p-2"
              />

              <div>
                <h2 className="font-bold">{cart?.item?.name}</h2>
                <h2>Quantity {cart?.quantity}</h2>
                <h2 className="text-lg font-bold">${cart?.price}</h2>
              </div>
            </div>

            <button onClick={() => onDeleteItem(cart.itemId)}>
              <TrashIcon className="text-red-500 hover:scale-110 transition cursor-pointer" />
            </button>
          </div>
        ))}
      </div>

   
    </div>
  )
}

export default CartItemList
