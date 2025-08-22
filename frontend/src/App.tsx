
import axios from "axios";
import './App.css'
import {useCallback, useEffect, useState} from "react";
import type { Product} from "./types/types.ts";
import ProductTable from "./ProductTable.tsx";
import Modal from "./components/Modal.tsx";
import ProductDetailsCard from "./components/ProductDetailsCard.tsx";
import AddProduct from "./components/AddProduct.tsx";

function App() {
    const [products, setProducts] = useState<Product[]>([])

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openDetails = (p: Product) => {setSelectedProduct(p); setDetailsOpen(true);};
    const closeDetails = () => {setDetailsOpen(false); setSelectedProduct(null)};

    const [addOpen, setAddOpen] = useState(false);

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

    const loadUser = () => {
        axios.get('/api/auth/me')
            .then(response => {
                console.log(response.data)
            })
    }

    function login() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
    }

    function deleteProduct(product:Product) {
        axios.delete("/api/products/"+product.id).then(getAllProducts)
    }

    useEffect(() => {
        getAllProducts()
            .then()
    }, [getAllProducts])

    useEffect(() => {
        loadUser();
    }, []);

    const handleProductAdd = (newProduct: Product) => {
        if (newProduct) {

            setProducts([newProduct, ...products])
        }
        setAddOpen(false); //close modal
        getAllProducts().then()
    }


    return (
        <>
            <h1>Warehouse</h1>
            <button onClick={login}>Login</button>
            <div className="table-toolbar">
                <button className="productButton" onClick={() => setAddOpen(true)}>
                    Add Product
                </button>
            </div>

            <ProductTable products={products}
                          onProductEditButtonClicked={(product:Product) => console.log("Edit Button Clicked: " + product.name)}
                          onProductDetailsButtonClicked={openDetails}
                          onProductDeleteButtonClicked={(product:Product) =>
                              deleteProduct(product)}
            />


            {/* ✅ AddProduct modal */}
            {addOpen && (
                <Modal open={addOpen} title="Add new product" onClose={() => setAddOpen(false)}>
                    <AddProduct
                        onProductAdd={handleProductAdd}
                        onCancel={() => setAddOpen(false)}
                    />
                </Modal>
            )}


            {detailsOpen && selectedProduct && (
                <Modal open={detailsOpen} title="Product details" onClose={closeDetails}>
                    <ProductDetailsCard product={selectedProduct}/>
                </Modal>
            )}
        </>
    )
}

export default App
