import {type FormEvent, useState} from "react";
import type {NewProduct, Product,} from "../types/types.ts";
import {addProduct} from "../service/api.ts";

type AddProductProps = {
    onProductAdd: (product: Product) => void,
    onCancel: () => void,
}

export default function AddProduct({onProductAdd, onCancel}: AddProductProps) {

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
            <form onSubmit={handleSubmit} className="form">
                <div className="form-grid">
                    <div className="field">
                        <label className="label" htmlFor="name">Name *</label>
                        <input id="name" className="input" type="text"
                               value={productValues.name}
                               onChange={e => handleChange("name", e.target.value)}
                               required />
                        <div className="help">Item Title</div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="sku">SKU *</label>
                        <input id="sku" className="input" type="text"
                               value={productValues.stockKeepingUnit}
                               onChange={e => handleChange("stockKeepingUnit", e.target.value)}
                               required />
                        <div className="help">SKU (ex. STN-A4-80)</div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="qty">Quantity *</label>
                        <input id="qty" className="input" type="number" min={0} step={1}
                               value={productValues.quantity ?? ""}
                               onChange={e => handleChange("quantity", e.target.value)} required />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="price">Price (EUR) *</label>
                        <input id="price" className="input" type="number" min={0} step={0.01}
                               value={productValues.price ?? ""}
                               onChange={e => handleChange("price", e.target.value)} required />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="location">Location *</label>
                        <input id="location" className="input" type="text"
                               value={productValues.location}
                               onChange={e => handleChange("location", e.target.value)} required />
                        <div className="help">Ex. A1-R01-B03</div>
                    </div>

                    <div className="field form-span-2">
                        <label className="label" htmlFor="desc">Description</label>
                        <textarea id="desc" className="textarea" rows={3}
                                  value={productValues.description}
                                  onChange={e => handleChange("description", e.target.value)} />
                    </div>
                </div>

                <div className="actions">
                    <input type="submit" className="btn btn-primary" value="Add" />
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};
