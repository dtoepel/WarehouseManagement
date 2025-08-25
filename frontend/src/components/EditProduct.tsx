import type {Product} from "../types/types.ts";
import {type FormEvent, useState} from "react";
import {editProduct} from "../service/api.ts";

type EditProductProps = {
    onProductEdit: (product: Product) => void;
    onCancel: () => void;
    product: Product;
}

export default function EditProduct({ onProductEdit, product, onCancel }: EditProductProps) {
    const [productValue, setProductValue] = useState<Product>(product)

    const handleChange = (field: keyof Product, value:string) => {
        setProductValue((prevState) => {
            return {
                ...prevState,
                [field]: value
            }
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await editProduct(productValue)
                .then(onProductEdit)
                .catch(e => console.log("Error while editing product ", e))
        } catch (error) {
            console.log("Error while editing product" , error);
        }
    }

    return (
  <div>

  </div>
 );
};
