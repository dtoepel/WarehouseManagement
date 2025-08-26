
import axios from "axios";
import './App.css'
import {useCallback, useEffect, useState} from "react";
import type {Product} from "./types/types.ts";
import Modal from "./components/Modal.tsx";
import ProductDetailsCard from "./components/ProductDetailsCard.tsx";
import AddProduct from "./components/AddProduct.tsx";
import {Link, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Home from "./components/Home.tsx";
import HeaderControl from "./components/HeaderControl.tsx";

function App() {
    const [user, setUser] = useState<string | undefined | null>(undefined);

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

    const loadUser = () => {
        axios.get('/api/auth/me')
            .then(response => {
                console.log(response); setUser(response.data)
            })
            .catch(() => setUser(null));
    }

    function login() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin
        window.open(host + '/oauth2/authorization/github', '_self')
    }

    function logout() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin
        window.open(host + '/logout', '_self')
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
            <h3>User: {user === undefined ? "undefined" : user === null ? "null" : user}</h3>
            <Routes>
                <Route path={"/"} element={
                    <>
                        main page
                    </>
                }/>
                <Route element={<ProtectedRoute user={user}/>}>
                    <Route path={"/dashboard"} element={<>
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

                </> }></Route>
        </Route>
</Routes>
    <br/>
    <button onClick={login}>Login</button>
    <button onClick={logout}>Logout</button>
    <Link to={"/dashboard"}>Dashboard</Link>

</>

)
}

export default App
