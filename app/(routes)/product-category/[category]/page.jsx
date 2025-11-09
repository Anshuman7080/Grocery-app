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
    <div className="min-h-screen w-full">
        <h2 className="p-3 sm:p-4 md:p-5 bg-green-800 text-white font-bold 
        text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center break-words">
          {resolvedParams.category}
        </h2>
        
        <div className="w-full overflow-x-auto">
          <TopCategoryList 
            categoryList={categoryList}
            selectedCategory={categoryData?.name}
          />
        </div>

        <div className="p-3 sm:p-5 md:p-7 lg:p-10 w-full max-w-[1920px] mx-auto">
          <ProductList productList={categoryData?.items}/>
        </div>
    </div>
  );
};

export default ProductCategoryPage;