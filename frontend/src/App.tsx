import axios from "axios";
import './App.css'
import {useCallback, useEffect, useState} from "react";
import type { Product} from "./types/types.ts";
import AddProductPage from "./pages/AddProductPage.tsx";

function App() {
    const [products, setProducts] = useState<Product[]>([])
    const [isFormActive, setIsFormActive] = useState<boolean>(false);


    const getAllProducts = useCallback(async () => {
        {
            console.log("getAllProducts");
            await axios.get("api/products").then(
                (response) => {
                    console.log(response.data);
                    setProducts(response.data)
                }
            )
        }
    }, [setProducts])

    useEffect(() => {
        getAllProducts()
            .then()
    }, [getAllProducts])

    const handleDoubleClick = () => {
        setIsFormActive(true);
    }

    const handleProductAdd = (newProduct: Product) => {
        if (newProduct) {

            setProducts([newProduct, ...products])
        }

        setIsFormActive(false)
        getAllProducts().then()
    }


    return (
        <>
            <h1>Warehouse</h1>
            <div onDoubleClick={handleDoubleClick}>
                <AddProductPage
                    onProductAdd={handleProductAdd}
                    isFormActive={isFormActive}
                />
            </div>
            {
                products.map((p) => {
                    return (
                        <div key={p.id}>
                            <p>{p.id}</p>
                            <p>{p.name}</p>
                        </div>
                    )
                })
            }
        </>
    )
}

export default App
