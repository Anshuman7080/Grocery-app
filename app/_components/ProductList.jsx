import React from 'react'
import ProductItem from './ProductItem'

const ProductList = ({productList}) => {
  
  return (
    <div className="mt-8 sm:mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-green-600 font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-5">Our Popular Products</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {productList?.map((product,index)=>index<8 && (
          <ProductItem product={product} key={index}/>
        ))}
      </div>     
    </div>
  )
}

export default ProductList