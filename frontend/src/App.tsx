import axios from "axios";
import './App.css'
import {useCallback, useEffect, useState} from "react";
import type {Product} from "./types/types.ts";
import Modal from "./components/Modal.tsx";
import ProductDetailsCard from "./components/ProductDetailsCard.tsx";
import AddProduct from "./components/AddProduct.tsx";
import Home from "./components/Home.tsx";
import HeaderControl from "./components/HeaderControl.tsx";
import EditProduct from "./components/EditProduct.tsx";

function App() {
    const [products, setProducts] = useState<Product[]>([])
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false)
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openDetails = (p: Product) => {
        setSelectedProduct(p);
        setDetailsOpen(true);
    };
    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedProduct(null)
    };

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

    function deleteProduct(product: Product) {
        axios.delete("/api/products/" + product.id).then(getAllProducts)
    }

    useEffect(() => {
        getAllProducts()
            .then()
    }, [getAllProducts])

    const handleProductAdd = (newProduct: Product) => {
        if (newProduct) {

            setProducts([newProduct, ...products])
        }
        setAddOpen(false); //close modal
        getAllProducts().then()
    }

    const handleProductEdit = (product: Product) => {

    }

    return (
        <>
            <div className='app-container'>
                <HeaderControl onAddProductClick={() => setAddOpen(true)}/>
                <Home products={products}
                      onProductEditButtonClicked={(product: Product) => console.log("Edit Button Clicked: " + product.name)}
                      onProductDetailsButtonClicked={openDetails}
                      onProductDeleteButtonClicked={(product: Product) =>
                          deleteProduct(product)}
                />
                <div className='app-modal'>
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
                </div>
            </div>
        </>
    )
}

export default App
