
import axios from "axios";
import './App.css'
import {useCallback, useEffect, useState} from "react";
import type { Product} from "./types/types.ts";
import ProductTable from "./ProductTable.tsx";
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

    function deleteProduct(product:Product) {
        axios.delete("/api/products/"+product.id).then(getAllProducts)
    }

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
            <ProductTable products={products}
                          onProductEditButtonClicked={(product:Product) => console.log("Edit Button Clicked: " + product.name)}
                          onProductDetailsButtonClicked={(product:Product) => console.log("Details Button Clicked: " + product.name)}
                          onProductDeleteButtonClicked={(product:Product) =>
                              deleteProduct(product)}
            />
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
