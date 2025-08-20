import AddProduct from "../components/AddProduct.tsx";
import type {Product} from "../types/types.ts";

type OnProductAddProps = {
    onProductAdd: (product: Product) => void
    isFormActive: boolean
}

export default function AddProductPage( {onProductAdd, isFormActive}: OnProductAddProps ) {

 return (
  <>
      { !isFormActive ?
          <div className='new-product-button'
                >
              New Product
          </div> :
          <AddProduct onProductAdd={onProductAdd} />
      }
  </>
 );
};
