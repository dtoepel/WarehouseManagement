import {type FormEvent, useState} from "react";
import type {NewProduct, Product,} from "../types/types.ts";
import {addProduct} from "../service/api.ts";

type AddProductProps = {
    onProductAdd: (product: Product) => void,

}

export default function AddProduct({onProductAdd}: AddProductProps) {

    const initialProductValue: Product = {
        id: "",
        name: "",
        description: "",
        stockKeepingUnit: "",
        quantity: null,
        price: null,
        location: "",
        createdAt: "",
        updatedAt: ""
    }

    const [productValues, setProductValues] =
        useState<Product>(initialProductValue)

    const handleChange = (field: keyof NewProduct, value: string) => {
        setProductValues((prevState) => {
            return {
                ...prevState,
                [field]: value,
            }
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
        await addProduct(productValues)
            .then(onProductAdd)
            .catch(e => console.log("Error while adding product: ", e));
        } catch (error) {
            console.log("Error while adding product: ", error);
        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text"
                       value={productValues.name}
                       onChange={(e) =>
                           handleChange("name", e.target.value)}
                       placeholder="Enter value here..."
                       required
                       autoFocus/>
                <input type="text"
                       value={productValues.description}
                       onChange={(e) =>
                           handleChange("description", e.target.value)}
                       placeholder="Enter value here..."
                       required/>
                <input type="text"
                       value={productValues.stockKeepingUnit}
                       onChange={(e) =>
                           handleChange("stockKeepingUnit", e.target.value)}
                       placeholder="Enter value here..."
                       required/>
                <input type="text"
                       value={productValues.quantity ?? ''}
                       onChange={(e) =>
                           handleChange("quantity", e.target.value)}
                       placeholder="Enter value here..."
                       required/>
                <input type="text"
                       value={productValues.price ?? ''}
                       onChange={(e) =>
                           handleChange("price", e.target.value)}
                       placeholder="Enter value here..."
                       required/>
                <input type="text"
                       value={productValues.location}
                       onChange={(e) =>
                           handleChange("location", e.target.value)}
                       placeholder="Enter value here..."
                       required/>
                <input type="submit" value="Add Product"/>
                <button type="button" value="Cancel"
                        onClick={() => onProductAdd(productValues)}>
                    Cancel
                </button>
            </form>
        </div>
    );
};
