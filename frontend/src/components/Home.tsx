import type {Product} from "../types/types.ts";

export type ProductTableProps = {
    products: Product[]
    onProductEditButtonClicked: (product: Product) => void
    onProductDetailsButtonClicked: (product: Product) => void
    onProductDeleteButtonClicked: (product: Product) => void
}

export default function Home(props: Readonly<ProductTableProps>) {

    return (
        <div className="home-container">

            {/*    Table area*/}
            <div className="table-container">
                <table>
                    <thead className='table-head'>
                    <tr>
                        <th>No</th>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody className='table-body'>
                        {
                            props.products &&
                            props.products.map((product, index) => {
                                return (
                                    <tr key={product.id}>
                                        <td className="table-data">
                                            {index+1}
                                        </td>
                                        <td className="table-data">
                                            {product.name}
                                        </td>
                                        <td className="table-data">
                                            {product.stockKeepingUnit}
                                        </td>
                                        <td className="table-data">
                                            {product.location}
                                        </td>
                                        <td className="table-data">
                                            {product.price}
                                        </td>
                                        <td className="table-data">
                                            {product.quantity}
                                        </td>
                                        <td className=''>
                                            <button className={"productButton"}
                                                    onClick={() => props.onProductDetailsButtonClicked(product)}>Details</button>
                                            <button className={"productButton"}
                                                    onClick={() => props.onProductEditButtonClicked(product)}>Edit</button>
                                            <button className={"miniButton"}
                                                    style={{backgroundColor:"#b00",color:"white",fontWeight:"bold"}}
                                                    onClick={() => {
                                                        props.onProductDeleteButtonClicked(product)
                                                    }}>X</button></td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>

        </div>
    );
};
