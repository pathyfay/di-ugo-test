import {OrderType} from "./model/OrderType.tsx";

export const formatCamelToSpace = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').toUpperCase();
};

export const getFormattedHeadersByLabel = (data: object[] | null | undefined, label: string): string[] => {
    const headers = data.length > 0 && data[0] ? Object.keys(data[0]).filter(key => key !== label) : [];

    return headers.map(formatCamelToSpace);
};

export const getCalculTotalOrders = (orders: OrderType[]) => {
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