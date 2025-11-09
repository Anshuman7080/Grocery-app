


import { PrismaClient } from '@prisma/client'
import TopCategoryList from '../_components/TopCategoryList';
import ProductList from '@/app/_components/ProductList';
const prisma = new PrismaClient()


const ProductCategoryPage = async({ params }) => {
  const resolvedParams = await params; 
   const categoryData = await prisma.category.findFirst({
    where: {
      name: resolvedParams.category, 
    },
    include: {
      items: true,
    },
  });

  console.log("categoryData",categoryData?.items);

 
  const categoryList = await prisma.category.findMany();

  return (
    <div>
        <h2 className="p-4 bg-green-800 text-white font-bold text-3xl
        text-center">{resolvedParams.category}</h2>
        <TopCategoryList categoryList={categoryList}
            selectedCategory={categoryData?.name}
        />

         <div className="p-5 md:p-10 ">
            <ProductList productList={categoryData?.items}/>
         </div>


    </div>
  );
};

export default ProductCategoryPage;
