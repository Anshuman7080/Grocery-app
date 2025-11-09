import { Button } from "@/components/ui/button";
import Image from "next/image";
import Slider from "./_components/Slider";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function Home() {


    const sliderList = await prisma.slider.findMany();
  const categoryList = await prisma.category.findMany();
   const productList = await prisma.item.findMany({
  include: {
    category: true,
  },
     });

   
   

  return (
    <div className="p-5 md:p-10 px-16 ">
   
   {/* slider */}
   <Slider sliderList={sliderList}/>

   <CategoryList categoryList={categoryList}/>

     
     <ProductList productList={productList}/> 

          {/* banner */}
     <Image  src='/FooterImage.png' width={1000} height={300}
      alt="banner"
      className="w-full h-[400px] object-contain"
     />

     {/* Footer */}

     <Footer/>

    </div>
  );
}
