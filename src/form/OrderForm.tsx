import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {OrderInterface} from "../Interface/OrderInterface.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {FetchOrderById, FetchProducts} from "../api/FetchApi.tsx";
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";
import {ProductInterface} from "../Interface/ProductInterface.tsx";

const OrderForm: React.FC = () => {
    const url = "http://localhost:8080/api/orders";
    const {id} = useParams<{ id: string }>();
    const [customerList, setCustomerlist] = useState<CustomerInterface[]>([]);
    const [orderlist, setOrderlist] = useState<OrderInterface[]>([]);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [order, setOrder] = useState<OrderInterface>({
        id: 0,
        orderDate: "",
        customerId: 0,
        productId: 0,
        quantity: 0,
        price: 0,
        currency: "",
        date: "",
    });

    const queryClient = useQueryClient();
    const orderCache = queryClient.getQueryData(['customers']).orderList ?? [];
    const customerCache = queryClient.getQueryData(['customers']).customerList ?? [];

    useEffect(() => {
        setOrderlist(orderCache);
        setCustomerlist(customerCache);
        let orderById = orderCache.reduce((acc: any, order: OrderInterface) => {
            return order.id === Number(id) ? order : acc;
        }, null);
        let arrProducts = [];
        FetchProducts().then((data) => {
            arrProducts.push(data);
            setProducts(data);
            return data;
        });

        if (orderById !== null) {
            setOrder(orderById)
        } else {
            FetchOrderById(Number(id)).then((data) => {
                setOrder({
                    id: 0,
                    orderDate: data.orderDate || "",
                    customerId: data.customerId || 0,
                    productId: data.productId || 0,
                    quantity: data.quantity || 0,
                    price: data.price || 0,
                    currency: data.currency || "",
                    date: data.date || "",
                });
            });
        }
    }, [id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setOrder({...order, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("orderDate", order.orderDate);
        formData.append("customerId", String(order.customerId));
        formData.append("productId", String(order.productId));
        formData.append("quantity", String(order.quantity));
        formData.append("price", String(order.price));
        formData.append("currency", order.currency);
        formData.append("mobile", order.date);

        console.log("Customer data submitted formData:", formData)
        try {
            const response = id ? await axios.put(url + `/${id}/edit`, formData)
                : await axios.post(url + '/new', formData);

            if (response.data?.status === 200 || response.status === 201) {
                localStorage.removeItem('apiCustomers');
                localStorage.removeItem('apiCustomersTimestamp');
                window.location.href = window.location.protocol + '//' + window.location.host + '/orders';
            } else {
                console.log('Error Order Updated :', response.data);
            }
            return response.data;
        } catch (error) {
            console.log(`Erreur lors de l'update du Order.`);
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Order Date:
                    <input
                        type="date"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="orderDate"
                        value={order.orderDate || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Quantity:
                    <input
                        type="number"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="quantity"
                        value={order.quantity || 0}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Price:
                    <input
                        type="number"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="price"
                        value={order.price || 0}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Currency:
                    <select className="select select-bordered" name="currency" value={order.currency}
                            onChange={handleChange}>
                        <option value="euros">Euros</option>
                        <option value="dollars">Dollars</option>
                    </select>
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Customer Id:
                    <select className="select select-bordered" name="customerId" value={order.customerId}
                            onChange={handleChange}>
                        {customerList.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.title} {customer.firstname} {customer.lastname}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Product Id:
                    <select className="select select-bordered" name="productId" value={order.productId}
                            onChange={handleChange}>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.nom}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Date :
                    <input
                        type="date"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="date"
                        value={order.date || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <button className="btn btn-success w-full max-w-lg m-4" type="submit">Submit</button>
        </form>
    );
};

export default OrderForm;