import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward} from "@fortawesome/free-solid-svg-icons/faBackward";
import TableComponent from "./TableComponent.tsx";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";

const CustomerOrdersComponent = () => {
    const {customerId} = useParams();
    let [customerOrders, setCustomerOrders] = useState<CustomerInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const cacheKey = "Customer_id_" + `${customerId}`;
    const cacheTimeKey = "Customer_timestamp_id_" + `${customerId}`;
    const cacheExpiry = 20 * 60 * 1000;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/${customerId}/orders`);
                if (response.data) {
                    let newCustomerOrders: CustomerInterface = {
                        title: response.data.title ?? '',
                        customerId: response.data.customer_id ?? '',
                        lastname: response.data.lastname ?? '',
                        firstname: response.data.firstname ?? '',
                        postalCode: response.data.postal_code ?? '',
                        city: response.data.city ?? '',
                        email: response.data.email ?? '',
                        mobile: response.data.mobile ?? '',
                        birthday: response.data.birthday ?? '',
                        photo: response.data.photo ?? '',
                        orders: []
                    }

                    newCustomerOrders.orders = response.data.orders.map(
                        (order: any) => ({
                            orderDate: order.order_date ?? '',
                            productId: order.product_id ?? '',
                            quantity: order.quantity ?? '',
                            price: order.price ?? '',
                            currency: order.currency ?? '',
                            date: order.date ?? ''
                        })
                    );

                    // @ts-ignore
                    setCustomerOrders(newCustomerOrders);
                    localStorage.setItem(cacheKey, JSON.stringify({customerOrders: newCustomerOrders}));
                    localStorage.setItem(cacheTimeKey, Date.now().toString());
                } else {
                    console.warn("La propriété hydra:member est manquante dans response.data");
                }
            } catch (e: unknown) {
                setError('Erreur lors du chargement des données');
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
                    setCustomerOrders(parsedData.customerOrders);
                    customerOrders = parsedData.customerOrders;
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

    return (
        <div className="bg-gray-600 text-blue-100">
            <div className="flex items-center justify-center py-8 app-min-height">

                {error ? (
                    <span className="badge badge-error size-4 w-full py-20 text-blue-100 font-bold">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 mr-1 size-4"/>
                        {error}
                            </span>
                ) : loading ? (
                    <span
                        className="flex items-center justify-center h-full loading loading-spinner text-primary px-36 bg-primary"></span>
                ) : (
                    <div className="overflow-x-auto app-width-100">
                        <div className="card bg-gray-700 text-amber-50 w-2/3 m-2">
                            <div className="card-body justify-center">
                                <h2 className="font-bold underline card-title">
                                    Commandes du Client numèro : {customerId}
                                </h2>
                            </div>
                            <ul className="justify-start list-disc">
                                <li>Nom: {customerOrders.title}{" "}{customerOrders.firstname}{" "}{customerOrders.lastname}</li>
                                <li>Email : {customerOrders.email}</li>
                                <li>Adresse : {customerOrders.postalCode}{" "}{customerOrders.city}</li>
                            </ul>
                        </div>
                        <div className="justify-end py-5 pb-5">
                            <button
                                className="btn btn-secondary mb-5 space-x-5"
                                onClick={() => navigate(`/customers`)}
                            >
                                <FontAwesomeIcon icon={faBackward} className="w-5 h-5 mr-1"/>
                                Back
                            </button>
                        </div>

                        <TableComponent arrayData={customerOrders.orders} isTotal={true}/>
                    </div>
                )}
            </div>
        </div>
    );
};


export default CustomerOrdersComponent;
