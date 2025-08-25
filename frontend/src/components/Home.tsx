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
                            const isEven = index % 2 ? "even" : "odd";
                            return (
                                <tr key={product.id} className={`table-row ${isEven} card`}>
                                    <td className="table-data">
                                        {index + 1}
                                    </td>
                                    <td data-label="Name: "
                                        className="table-data">
                                        {product.name}
                                    </td>
                                    <td data-label="SKU: "
                                        className="table-data">
                                        {product.stockKeepingUnit}
                                    </td>
                                    <td data-label="Location: "
                                        className="table-data">
                                        {product.location}
                                    </td>
                                    <td data-label="Price: "
                                        className="table-data">
                                        {product.price}
                                    </td>
                                    <td data-label="Quantity: "
                                        className="table-data">
                                        {product.quantity}
                                    </td>
                                    <td className='btn-actions'>
                                        <button className={"action-button"}
                                                onClick={() => props.onProductDetailsButtonClicked(product)}>
                                            <span>Details</span>
                                        </button>
                                        <button className={"action-button"}
                                                onClick={() => props.onProductEditButtonClicked(product)}>
                                            <span>Edit</span>
                                        </button>
                                        <button className={"action-button"}
                                                style={{backgroundColor: "#b00", color: "white", fontWeight: "600"}}
                                                onClick={() => {
                                                    props.onProductDeleteButtonClicked(product)
                                                }}>X
                                        </button>
                                    </td>
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
