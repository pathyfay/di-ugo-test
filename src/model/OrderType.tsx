export interface OrderType {
    id: number;
    purchaseIdentifier: string,
    productId: number,
    quantity: number,
    price: number,
    currency: string,
    date: string
}