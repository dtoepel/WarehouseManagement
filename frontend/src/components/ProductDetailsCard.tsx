import React from "react";
import type { Product } from "../types/types.ts";

type ProductDetailsProp = { product: Product };

export default function ProductDetailsCard({ product }: Readonly<ProductDetailsProp>) {
    const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" });

    const fmtDateTime = new Intl.DateTimeFormat(undefined, {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false
    });

    function formatInstantLocal(iso?: string) {
        if (!iso) return "—";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return fmtDateTime.format(d);
    }

    function DateCell({ iso }: { iso?: string }) {
        if (!iso) return <>—</>;
        const local = formatInstantLocal(iso);
        return <span title={iso}>{local}</span>;
    }

    const rows: Array<[string, React.ReactNode, boolean?]> = [
        ["Name", product.name || "—"],
        ["SKU", product.stockKeepingUnit || "—"],
        ["Quantity", product.quantity ?? "—", true],
        ["Price", product.price != null ? fmt.format(product.price) : "—", true],
        ["Location", product.location || "—"],
        ["Created",<DateCell iso={product.createdAt} />, true],
        ["Updated", <DateCell iso={product.updatedAt} />, true],
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