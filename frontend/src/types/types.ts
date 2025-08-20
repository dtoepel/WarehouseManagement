export type Product = {
    id:string;
    name:string;
    description: string;
    stockKeepingUnit: string;
    quantity: number | null;
    price: number | null;
    location: string;
    createdAt: string;
    updatedAt: string;
}

export type NewProduct = {
    name:string;
    description: string;
    stockKeepingUnit: string;
    quantity: number | null;
    price: number | null;
    location: string;
}