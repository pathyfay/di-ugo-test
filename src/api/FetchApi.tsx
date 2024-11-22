import axios from 'axios';

const url = 'http://localhost:8080/api';
export const FetchApi = async () => {
    const response = await axios.get(`${url}/customers`);
    const datas = response.data;
    const customerList = datas.map((customer: any) => ({
        title: customer?.title ?? '',
        id: customer?.id ?? 0,
        lastname: customer?.lastname ?? '',
        firstname: customer?.firstname ?? '',
        postalCode: customer?.postal_code ?? customer?.postalCode ?? '',
        city: customer?.city ?? '',
        email: customer?.email ?? '',
        mobile: customer?.mobile ?? '',
        birthday: customer?.birthday ?? '',
        photo: customer?.photo ?? '',
        orders: customer?.orders ?? [],
    }));

    const orderList = datas
        .flatMap((customer: any) => customer.orders)
        .sort((a: any, b: any) => a.id - b.id)
        .map((order: any) => ({
            id: order.id,
            orderDate: order.order_date,
            customerId: order.customer_id ?? 0,
            productId: order.product_id ?? 0,
            quantity: order.quantity ?? 0,
            price: order.price ?? 0,
            currency: order.currency ?? '',
            date: order.date ?? '',
        }));

    return {customerList, orderList};
};

export const FetchCustomerById = async (id: string | undefined) => {
    const response = await axios.get(`${url}/customers/${id}`);
    return response.data;
};

export const FetchOrders = async () => {
    const response = await axios.get(`${url}/orders`);
    return response.data;
}

export const FetchOrderById = async (id: number) => {
    const response = await axios.get(`${url}/orders/${id}`);
    return response.data;
}

export const FetchProducts = async () => {
    const response = await axios.get(`${url}/products`);
    return response.data;
};

export const FetchProductById = async (id: string | undefined) => {
    const response = await axios.get(`${url}/products/${id}`);
    return response.data;
};
