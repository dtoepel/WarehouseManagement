import axios from "axios";
import './App.css'
import {useCallback, useEffect, useMemo, useState} from "react";
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
    const [selectEditProduct, setSelectEditProduct] = useState<Product>();
    const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product|null>(null);

    const openDetails = (p: Product) => {
        setSelectedProduct(p);
        setDetailsOpen(true);
    };
    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedProduct(null)
    };

    const openEdit = (product: Product) => {
        setSelectEditProduct(product);
        setEditOpen(true);
    };
    const closeEdit = () => {
        setEditOpen(false);
        // setSelectEditProduct(null)
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
        if (product) {
            setProducts(prevProducts =>
            prevProducts.map(p =>
            p.id === product.id ? product : p))
        }

        setEditOpen(false);
    }

    //Search Bar Implementation
    const [query, setQuery] = useState("");

    const filteredProducts = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return products;
        return products.filter(p => {
            const name = (p.name ?? "").toLowerCase();
            const sku  = (p.stockKeepingUnit ?? "").toLowerCase();
            return name.includes(q) || sku.includes(q);
        });
    }, [products, query]);

    return (
        <>
            <div className='app-container'>
                <HeaderControl
                    onAddProductClick={() => setAddOpen(true)}
                    query={query}
                    onQueryChange={setQuery}
                    filteredCount={filteredProducts.length}
                    totalCount={products.length}
                />
                <Home products={filteredProducts}
                      onProductEditButtonClicked={openEdit}
                      onProductDetailsButtonClicked={openDetails}
                      onProductDeleteButtonClicked={(product: Product) =>
                          setConfirmDeleteProduct(product)}
                />

                <div className='app-modal'>
                    {/* AddProduct modal */}
                    {addOpen && (
                        <Modal open={addOpen} title="Add New Product" onClose={() => setAddOpen(false)}>
                            <AddProduct
                                onProductAdd={handleProductAdd}
                                onCancel={() => setAddOpen(false)}
                            />
                        </Modal>
                    )}

                    {editOpen && selectEditProduct && (
                        <Modal open={editOpen} title="Edit Product"
                               onClose={closeEdit}>
                            <EditProduct
                                onProductEdit={handleProductEdit}
                                onCancel={() => setEditOpen(false)}
                                product={selectEditProduct}/>
                        </Modal>)
                    }

                    {detailsOpen && selectedProduct && (
                        <Modal open={detailsOpen} title="Product Details" onClose={closeDetails}>
                            <ProductDetailsCard product={selectedProduct}/>
                        </Modal>
                    )}
                </div>
            </div>

            {confirmDeleteProduct != null && (
                <Modal open={true} title={"Confirm Delete "+confirmDeleteProduct.name} onClose={() => setConfirmDeleteProduct(null)}>
                    <div>
                        <button onClick={() => {
                            deleteProduct(confirmDeleteProduct);
                            setConfirmDeleteProduct(null)}}>
                            Yes
                        </button>
                        <button onClick={() => {setConfirmDeleteProduct(null)}}>
                            No
                        </button>
                        <button>
                            Maybe
                        </button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default App
