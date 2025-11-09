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
    <div className="w-full min-h-screen">
      {/* Main Container */}
      <div className="px-3 sm:px-5 md:px-10 lg:px-16 xl:px-20 py-4 sm:py-6 md:py-8 lg:py-10 
        max-w-[1920px] mx-auto">
        
        {/* Slider */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Slider sliderList={sliderList}/>
        </div>

        {/* Category List */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <CategoryList categoryList={categoryList}/>
        </div>

        {/* Product List */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <ProductList productList={productList}/> 
        </div>

        {/* Banner */}
        <div className="mb-6 sm:mb-8 md:mb-10 w-full">
          <Image  
            src='/FooterImage.png' 
            width={1000} 
            height={300}
            alt="banner"
            className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px] 
              object-contain rounded-lg"
          />
        </div>

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  );
}