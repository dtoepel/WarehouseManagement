
import axios from "axios";
import './App.css'
import {useEffect, useState} from "react";
import type {Product} from "./Product.ts";
import ProductTable from "./ProductTable.tsx";

function App() {

    const[products,setProducts] = useState<Product[]>([])

    function getAllProducts() {
        console.log("getAllProducts");
        axios.get("api/products").then(
            (response) => {
                console.log(response.data);
                setProducts(response.data)
            }
        )
    }

    useEffect(() => {
        getAllProducts()
    },[])

  return (
    <>
      <h1>Warehouse</h1>
        <ProductTable products={products}
                      onProductEditButtonClicked={(product) => console.log("Edit Button Clicked: " + product.name)}
                      onProductDeleteButtonClicked={(product) => console.log("Delete Button Clicked: " + product.name)}
                      onProductDetailsButtonClicked={(product) => console.log("Details Button Clicked: " + product.name)}
        />
    </>
  )
}

export default App
