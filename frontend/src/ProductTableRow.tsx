import type {Product} from "./Product.ts";

export type ProductTableRowProps= {
    value: Product
    onEditButtonClicked: (product:Product)=>void
    onDetailsButtonClicked: (product:Product)=>void
    onDeleteButtonClicked: (product:Product)=>void
}

export default function ProductTableRow(props:Readonly<ProductTableRowProps>) {

    function editButtonClicked():void {
        props.onEditButtonClicked(props.value);
    }

    function deleteButtonClicked():void {
        props.onDeleteButtonClicked(props.value);
    }

    function detailsButtonClicked():void {
        props.onDetailsButtonClicked(props.value);
    }

    return(
        <tr className={"shortProductBox"}>
            <td>{props.value.name}</td>
            <td>{props.value.quantity}</td>
            <td>{props.value.price}</td>
            <td>{props.value.location}</td>
            <td><button onClick={() => detailsButtonClicked()}><s>Details</s></button>
                <button onClick={() => editButtonClicked()}><s>Edit</s></button>
                <button onClick={() => deleteButtonClicked()}><s>Delete</s></button></td>
        </tr>
    )
}