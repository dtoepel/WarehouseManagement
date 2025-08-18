
import axios from "axios";
import './App.css'
import {useEffect, useState} from "react";
import type {Product} from "./Product.ts";
import ProductTableRow from "./ProductTableRow.tsx";

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
        <table border={1}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
                return (<ProductTableRow
                    value={product}
                    onDetailsButtonClicked={() => { }}
                    onDeleteButtonClicked={() => { }}
                    onEditButtonClicked={() => { }}
                />)
            })}
            </tbody>
        </table>
    </>
  )
}

export default App
