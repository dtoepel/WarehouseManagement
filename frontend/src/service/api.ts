import axios from "axios";
import type {NewProduct, Product} from "../types/types.ts";


const addProduct = async (data: NewProduct) => {
    return await axios.post<Product>("/api/products/add", data)
        .then(res => res.data);
};

const editProduct = async (data: Product) => {
    return await axios.put<Product>("/api/products/:id", data)
        .then(res => res.data)
}

export {
    addProduct,
    editProduct
}