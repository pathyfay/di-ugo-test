import {OrderInterface} from "./Interface/OrderInterface.tsx";

export const formatCamelToSpace = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').toUpperCase();
};

export const getFormattedHeadersByLabel = (data: object[]  | undefined, label: string): string[] => {
    const headers = data !== undefined && data.length > 0 && data[0] ? Object.keys(data[0]).filter(key => key !== label) : [];

    return headers.map(formatCamelToSpace);
};

export const getCalculTotalOrders = (orders: OrderInterface[]) => {
    return orders.reduce((tableSousTotal, order) => {
        const {currency, price, quantity} = order;
        const total = price * quantity;
        if (tableSousTotal[currency]) {
            tableSousTotal[currency] += total;
        } else {
            tableSousTotal[currency] = total;
        }
        return tableSousTotal;
    }, {} as Record<string, number>);
};

export const  toCamelCase = (str : string) => {
    return str.split(' ')
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

export const isOrderTypeArray = (datas: any): datas is OrderInterface[] => {
    return Array.isArray(datas) && datas.every(item =>
        typeof item.purchaseIdentifier === 'string' &&
        typeof item.productId === 'number' &&
        typeof item.quantity === 'number' &&
        typeof item.price === 'number' &&
        typeof item.currency === 'string' &&
        typeof item.date === 'string'
    );
};