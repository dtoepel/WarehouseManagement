import axios from "axios";
import './App.css'
import {useCallback, useEffect, useState} from "react";
import type {Product} from "./types/types.ts";
import Modal from "./components/Modal.tsx";
import ProductDetailsCard from "./components/ProductDetailsCard.tsx";
import AddProduct from "./components/AddProduct.tsx";
import Home from "./components/Home.tsx";
import HeaderControl from "./components/HeaderControl.tsx";

function App() {
    const [products, setProducts] = useState<Product[]>([])

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openDetails = (p: Product) => {
        setSelectedProduct(p);
        setDetailsOpen(true);
    };
    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedProduct(null)
    };

    const [addOpen, setAddOpen] = useState(false);

    const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product|null>(null);

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

    return (
        <>
            <div className='app-container'>
                <HeaderControl onAddProductClick={() => setAddOpen(true)} />
                <Home products={products}
                      onProductEditButtonClicked={(product: Product) => console.log("Edit Button Clicked: " + product.name)}
                      onProductDetailsButtonClicked={openDetails}
                      onProductDeleteButtonClicked={(product: Product) =>
                          setConfirmDeleteProduct(product)}
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
        
            {confirmDeleteProduct != null && (
                <Modal open={true} title={"Confirm Delete "+confirmDeleteProduct.name} onClose={() => setConfirmDeleteProduct(null)}>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <p>
                            The product {confirmDeleteProduct.name} ({confirmDeleteProduct.stockKeepingUnit}) will be deleted permanently.
                        </p>
                        {confirmDeleteProduct.quantity != null && confirmDeleteProduct.quantity > 0?
                            (<p style={{color:"#c00"}}>WARNING: This product has still {confirmDeleteProduct.quantity}" units in stock!</p>):""
                        }
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
                        <button style={{margin:"10px"}} className={"btn btn-secondary"}
                                onClick={() => {
                            deleteProduct(confirmDeleteProduct);
                            setConfirmDeleteProduct(null)}}>
                            Yes
                        </button>
                        <button style={{margin:"10px"}}  className={"btn btn-primary"}
                                onClick={() => {
                            setConfirmDeleteProduct(null)}}>
                            No
                        </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default App
