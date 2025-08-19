import type {Product} from "./Product.ts";

export type ProductTableProps= {
    products: Product[]
    onProductEditButtonClicked: (product:Product)=>void
    onProductDetailsButtonClicked: (product:Product)=>void
    onProductDeleteButtonClicked: (product:Product)=>void
}

export default function ProductTable(props:Readonly<ProductTableProps>) {

    return(
        <table border={1}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {props.products.map((product,index) => {
                const oddEven = index%2==0?"even":"odd"
                return(
                <tr className={"shortProductBox"}>
                    <td className={oddEven}><span>{product.name}</span></td>
                    <td className={oddEven}><span>{product.quantity}</span>
                        <button className={"miniButton"}>+</button>
                        <button className={"miniButton"}>-</button>
                    </td>
                    <td className={oddEven}><span>{product.price}</span></td>
                    <td className={oddEven}><span>{product.location}</span></td>
                    <td className={oddEven}>
                        <button className={"productButton"}
                                onClick={() => props.onProductDetailsButtonClicked(product)}>Details</button>
                        <button className={"productButton"}
                                onClick={() => props.onProductEditButtonClicked(product)}>Edit</button>
                        <button className={"miniButton"}
                                style={{backgroundColor:"#b00",color:"white",fontWeight:"bold"}}
                                onClick={() => props.onProductDeleteButtonClicked(product)}>X</button></td>
                </tr>
            )})}
            </tbody>
        </table>


)
}