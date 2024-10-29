import  {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {OrderType} from "../model/OrderType.tsx";
import {getCalculTotalOrders, getFormattedHeadersByLabel} from "../Utils.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward} from "@fortawesome/free-solid-svg-icons/faBackward";

let customer = {};
let headers: any[] = [];

const CustomerOrdersComponent = () => {
    const {customerId} = useParams();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currencyTotals, setCurrencyTotals] = useState<Record<string, number>>({});

    const navigate = useNavigate();

    const cacheKey = "apiCustomer_id_" + `${customerId}`;
    const cacheTimeKey = "apiCustomer_timestamp_id_" + `${customerId}`;
    const cacheExpiry = 20 * 60 * 1000;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/${customerId}/orders`);
                if (response.data["hydra:member"][0]) {
                    customer = {
                        title: response.data["hydra:member"][0].title,
                        customerId: response.data["hydra:member"][0].customer_id,
                        lastname: response.data["hydra:member"][0].lastname,
                        firstname: response.data["hydra:member"].firstname,
                        postalCode: response.data["hydra:member"][0].postal_code,
                        city: response.data["hydra:member"][0].city,
                        email: response.data["hydra:member"][0].email
                    }
                    const customerOrders = response.data["hydra:member"][0].orders.map(
                        ({orderId, productId, quantity, price, currency, city}) => ({
                            purchaseIdentifier: orderId ?? '',
                            productId: productId ?? '',
                            quantity: quantity ?? '',
                            price: price ?? '',
                            currency: currency ?? '',
                            city: city ?? ''
                        })
                    );
                    headers = getFormattedHeadersByLabel(customerOrders,"id");
                    setOrders(customerOrders);
                    setCurrencyTotals(getCalculTotalOrders(customerOrders));

                    localStorage.setItem(cacheKey, JSON.stringify({
                        customerOrders: customerOrders,
                        customer: customer
                    }));
                    localStorage.setItem(cacheTimeKey, Date.now().toString());
                } else {
                    console.warn("La propriété hydra:member est manquante dans response.data");
                }
            } catch (e) {
                setError(e?.message || 'Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        const checkCacheAndFetch = () => {
            const cachedData = localStorage.getItem(cacheKey);
            const cachedTimestamp = localStorage.getItem(cacheTimeKey);
            if (cachedData && cachedTimestamp) {
                const now = Date.now();
                const cacheTime = parseInt(cachedTimestamp, 10);

                if (now - cacheTime < cacheExpiry) {
                    const parsedData = JSON.parse(cachedData);
                    setOrders(parsedData.customerOrders);
                    setCurrencyTotals(getCalculTotalOrders(parsedData.customerOrders));
                    customer = parsedData.customer;
                    headers = getFormattedHeadersByLabel(parsedData.customerOrders,"id");
                    setLoading(false);
                    return;
                }
            }

            fetchData().catch(err => console.error('Error in fetchData:', err));
        };
        checkCacheAndFetch();
        const intervalId = setInterval(checkCacheAndFetch, cacheExpiry);

        return () => clearInterval(intervalId);
    }, [customerId]);

    if (loading) return <div className="justify-center loading loading-spinner text-primary px-20 bg-primary"></div>;
    if (error) return <span className="badge badge-error w-full py-8">{error}</span>;

    return (
        <div className="card bg-gray-600 text-blue-100">
            <div className="overflow-x-auto">
                <div className="card bg-gray-700 text-amber-50 w-2/3 m-2">
                    <div className="card-body justify-center">
                        <h2 className="font-bold underline card-title">
                            Commandes du Client numèro : {customerId}
                        </h2>
                    </div>
                    <ul className="justify-start list-disc">
                        <li>Nom: {customer.title}{" "}{customer.firstname}{" "}{customer.lastname}</li>
                        <li>Email : {customer.email}</li>
                        <li>Adresse : {customer.postalCode}{" "}{customer.city}</li>
                    </ul>
                </div>
                <div className="justify-end py-5 pb-5">
                    <button
                        className="btn btn-secondary mb-5 space-x-5 py-4 float-end"
                        onClick={() => navigate(`/customers`)}
                    >
                        <FontAwesomeIcon icon={faBackward} className="w-5 h-5 mr-1"/>
                        Back
                    </button>
                </div>

                <table className="table table-xs bordered rounded-md border-collapse border border-slate-400">
                    <thead>
                    <tr>
                        <th className="border border-slate-300 text-blue-100">#</th>
                        {headers.map((header, index) => (
                            <th className="border border-slate-300 text-blue-100"
                                key={index}>{header.replace('_', ' ').toUpperCase()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.id || index}>
                            <th className="border border-slate-300">{index + 1}</th>
                            <td className="border border-slate-300">{order.purchaseIdentifier} </td>
                            <td className="border border-slate-300">{order.productId} </td>
                            <td className="border border-slate-300">{order.quantity} </td>
                            <td className="border border-slate-300">{order.price} </td>
                            <td className="border border-slate-300">{order.currency} </td>
                            <td className="border border-slate-300">{order.date} </td>
                        </tr>
                    ))}

                    <tr>
                        <td className="border border-slate-300"> Total :</td>
                        <td colSpan={6} className="border border-slate-300 justify-center">
                            {Object.entries(currencyTotals).map(([currency, total]) => (
                                <span className="text-amber-50" key={currency.toUpperCase()}>
                                    {currency}: {total.toFixed(2)}<br/>
                                </span>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default CustomerOrdersComponent;
