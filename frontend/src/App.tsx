
import axios from "axios";
import './App.css'
import type {Product} from "./Product.ts";
import ProductTable from "./ProductTable.tsx";
import {useEffect, useState} from "react";

function App() {

    const[products,setProducts] = useState<Product[]>([])

    function getAllProducts() {
        axios.get("/api/products").then(
            (response) => {
                setProducts(response.data)
            }
        )
    }

    function deleteProduct(product:Product) {
        axios.delete("/api/products/"+product.id).then(getAllProducts)
    }

    useEffect(() => {
        getAllProducts()
    },[])

  return (
    <>
      <h1>Warehouse</h1>
        <ProductTable products={products}
                      onProductEditButtonClicked={(product:Product) => console.log("Edit Button Clicked: " + product.name)}
                      onProductDetailsButtonClicked={(product:Product) => console.log("Details Button Clicked: " + product.name)}
                      onProductDeleteButtonClicked={(product:Product) =>
                          deleteProduct(product)}
        />
    </>
  )
}

export default App
