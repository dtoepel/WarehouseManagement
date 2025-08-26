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
            console.log("Error caught while editing product" , error);
        }
    }

    return (
  <div>
      <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
              <div className="field">
                  <label className="label" htmlFor="name">Name *</label>
                  <input id="name" className="input" type="text"
                         value={productValue.name}
                         onChange={e => handleChange("name", e.target.value)}
                         required />
                  <div className="help">Item Title</div>
              </div>

              <div className="field">
                  <label className="label" htmlFor="sku">SKU *</label>
                  <input id="sku" className="input" type="text"
                         value={productValue.stockKeepingUnit}
                         onChange={e => handleChange("stockKeepingUnit", e.target.value)}
                         required />
                  <div className="help">SKU (ex. STN-A4-80)</div>
              </div>

              <div className="field">
                  <label className="label" htmlFor="qty">Quantity *</label>
                  <input id="qty" className="input" type="number" min={0} step={1}
                         value={productValue.quantity ?? ""}
                         onChange={e => handleChange("quantity", e.target.value)} required />
              </div>

              <div className="field">
                  <label className="label" htmlFor="price">Price (EUR) *</label>
                  <input id="price" className="input" type="number" min={0} step={0.01}
                         value={productValue.price ?? ""}
                         onChange={e => handleChange("price", e.target.value)} required />
              </div>

              <div className="field">
                  <label className="label" htmlFor="location">Location *</label>
                  <input id="location" className="input" type="text"
                         value={productValue.location}
                         onChange={e => handleChange("location", e.target.value)} required />
                  <div className="help">Ex. A1-R01-B03</div>
              </div>

              <div className="field form-span-2">
                  <label className="label" htmlFor="desc">Description</label>
                  <textarea id="desc" className="textarea" rows={3}
                            value={productValue.description}
                            onChange={e => handleChange("description", e.target.value)} />
              </div>
          </div>

          <div className="actions">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              <input type="submit" className="btn btn-primary" value="Save" />
          </div>
      </form>
  </div>
 );
};
