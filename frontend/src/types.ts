export type TProduct = {
    title: string;
    sku: string;
    images: string[];
    price: number;
    description?: string;
}

export type TAdjustment = {
    id: number;
    sku: string;
    qty: number;
    amount?: string;
}
