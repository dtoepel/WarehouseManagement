import React from "react";
import type { Product } from "../types/types.ts";

type ProductDetailsProp = { product: Product };

export default function ProductDetailsCard({ product }: Readonly<ProductDetailsProp>) {
    const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" });

    const rows: Array<[string, React.ReactNode, boolean?]> = [
        ["Name", product.name || "—"],
        ["SKU", product.stockKeepingUnit || "—"],
        ["Quantity", product.quantity ?? "—", true],
        ["Price", product.price != null ? fmt.format(product.price) : "—", true],
        ["Location", product.location || "—"],
        ["Created", product.createdAt || "—", true],
        ["Updated", product.updatedAt || "—", true],
        ["Description", product.description || "—"],
    ];

    return (
        <dl className="details">
            {rows.map(([label, value, isNumeric]) => (
                <div className="details-row" key={label}>
                    <dt>{label}</dt>
                    <dd className={isNumeric ? "tabular" : undefined}>{value}</dd>
                </div>
            ))}
        </dl>
    );
}