import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProductItemDetail from './ProductItemDetail'

const ProductItem = ({product}) => {

  return (
    <div className=" p-2 md:p-6 
    flex flex-col items-center justify-center gap-3 
    border rounded-lg
    hover:scale-105 hover:shadow-lg
    transition-all ease-in-out cursor-pointer">
       <Image
        src={product?.image}
        width={500}
        height={200}
        alt={product?.name}
        className="h-[200px] w-[200px] object-contain"
       />
       <h2 className="font-bold text-lg">{product.name}</h2>
       <h2 className="font-bold">${product.price}</h2>
     

       <Dialog>
  <DialogTrigger asChild>
      <Button variant="outline"
       className="text-green-600 hover:text-white hover:bg-green-600">Add to Cart
     </Button>
       
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      
      <DialogDescription>
      <ProductItemDetail product={product}/>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default ProductItem
