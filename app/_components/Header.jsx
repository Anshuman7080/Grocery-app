'use client'
import { Button } from '@/components/ui/button'
import { CircleUserRound, LayoutGrid, Search, ShoppingBag, ShoppingBasket } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Menu } from 'lucide-react';
import SliderFormModal from '@/lib/SliderFormModal'
import CategoryFormModal from '@/lib/CategoryFormModal'
import ItemFormModal from '@/lib/ItemFormModal'
import Link from 'next/link'
import { UpdateCartContext } from '../_context/UpdateCartContext'
import CartItemList from './CartItemList'
import { useRouter } from 'next/navigation'
 

const Header = ({categoryList}) => {

           const {updateCart,setUpdateCart}=useContext(UpdateCartContext)  
        const { data: session, status } = useSession();
        const [activeForm, setActiveForm] = useState(null)
        const [totalCartItem,setTotalCartItem]=useState(0);
        const [cartItemList,setCartItemList]=useState([]);

        useEffect(()=>{
              const getCartItem=async()=>{
                try{
            const res=await fetch("/api/getCartItem");
            if(!res.ok){
               throw new Error('Failed to fetch categories');
             }

             const data=await res.json();
       
              setCartItemList(data?.response);
              setTotalCartItem(data?.response?.length);
             
                }catch(error){
                  console.log("error in fetching cart item",error);
                  // alert("error in getting cart item");
                }
              }
              getCartItem()
        },[updateCart])

     
         const [subTotal, setSubTotal] = useState(0)
          useEffect(() => {
            let total = 0
            cartItemList.forEach((element) => {
              total += element.price
            })
            setSubTotal(total.toFixed(2))
          }, [cartItemList])
 
         const router=useRouter();

  return (
    <div className="-mt-3 shadow-sm flex justify-between">

    <div className="flex items-center gap-8 mt-2">
    <Link href="/">
     <Image src='/logo.png' alt='logo' 
    width={80}
    height={10}
    priority={true}
   />
 </Link>
     
     
         <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <h2 className="md:flex gap-2 items-center border rounded-full p-2 px-10  bg-slate-200 hidden cursor-pointer">
        <LayoutGrid className="h-5 w-5"/>Category
               </h2>
         </DropdownMenuTrigger>
           <DropdownMenuContent>
             <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
           <DropdownMenuSeparator />

         {categoryList.map((category,index)=>(
          <Link href={`/product-category/${category?.name}`} key={index}>
          <DropdownMenuItem className="flex gap-4 items-center cursor-pointer" >
          <Image src={category.image}
            alt='icon'
            width={30}
            height={30}
            unoptimized={true}
          />
            <h2 className="text-lg">{category.name}</h2>
          </DropdownMenuItem>
          </Link>
         ))}

           </DropdownMenuContent>
           </DropdownMenu>

     <div className="md:flex gap-3 items-center border rounded-full p-2 px-5 hidden">
        <Search/>
        <input type='text' 
        placeholder='Search'
         className="outline-none"   
        />
     </div>

  </div>

  <div className="flex gap-5 items-center mr-4">

     
     <Sheet>
  <SheetTrigger>
     <h2 className="flex gap-2 items-center text-lg"><ShoppingBasket className="h-7 w-7"/>
  <span className="bg-green-700 text-white  px-2 rounded-full">{totalCartItem}</span></h2>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle className="bg-green-700 
      text-white font-bold text-lg p-2">My Cart </SheetTitle>
      <SheetDescription>
        <CartItemList cartItemList={cartItemList} />
      </SheetDescription>
    </SheetHeader>
    <SheetClose asChild>
         <div className="absolute w-[90%] bottom-6 flex flex-col pl-5 ml-2">
              <h2 className="text-lg font-bold flex justify-between">
                Subtotal <span>${subTotal}</span>
              </h2>
              <Button className="bg-green-700" onClick={()=>router.push(session ? "/checkout":"/login")}>Check Out</Button>
            </div>
    </SheetClose>
  </SheetContent>
</Sheet>

 {!session? ( 
  <Link href="/login">
  <Button className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
        Login
   </Button>
   </Link>
): (
  
    
     
         <DropdownMenu>
         <DropdownMenuTrigger asChild>
             <CircleUserRound className="h-12 w-12 cursor-pointer bg-green-100 text-green-700 p-2 rounded-full"/>

         </DropdownMenuTrigger>
           <DropdownMenuContent>
             <DropdownMenuLabel>My Account</DropdownMenuLabel>
           <DropdownMenuSeparator />

                    {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                  <Link href="/my-order">
                    <DropdownMenuItem>My Order</DropdownMenuItem>
                  </Link>

                    {session?.user?.role == 'ADMIN' ? (
                      <div>
                          <DropdownMenuItem onClick={() => setActiveForm("Slider")} className="cursor-pointer">
                                  Add Slider
                           </DropdownMenuItem>
                           
                         <DropdownMenuItem onClick={() => setActiveForm("Category")} className="cursor-pointer">
                                 Add Category
                          </DropdownMenuItem>
                       
                         <DropdownMenuItem onClick={() => setActiveForm("Item")} className="cursor-pointer">
                                   Add Item
                                 </DropdownMenuItem>

                      </div>
                    ) : (<div></div>)} 

                    <DropdownMenuItem  onClick={() => signOut({ callbackUrl: '/login' })}>Logout</DropdownMenuItem>
           </DropdownMenuContent>
           </DropdownMenu>
)}
     
  </div>


    {activeForm === 'Slider' && (
         <SliderFormModal activeForm="Slider" onClose={() => setActiveForm(null)} />
     )}

      {activeForm === 'Category' && <CategoryFormModal activeForm='Category' onClose={()=>setActiveForm(null)}/>}
      {activeForm === 'Item' && <ItemFormModal activeForm='Item' onClose={()=>setActiveForm(null)} categoryList={categoryList}/>}
  
    </div>
  )
}

export default Header
