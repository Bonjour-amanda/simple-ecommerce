export type TProduct = {
    title: string;
    sku: string;
    image: string;
    price: number;
    description?: string;
}

export type TAdjustment = {
    sku: string;
    qty: number;
}
