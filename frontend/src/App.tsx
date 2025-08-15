
import axios from "axios";
import './App.css'
import {useEffect, useState} from "react";
import type {Product} from "./Product.ts";

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
        {
            products.map((p) => {
                return(<p>{p.name}</p>)
            })
        }
    </>
  )
}

export default App
