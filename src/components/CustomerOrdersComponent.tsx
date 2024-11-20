import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward} from "@fortawesome/free-solid-svg-icons/faBackward";
import TableComponent from "./TableComponent.tsx";
import {faBrush, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";

const CustomerOrdersComponent = () => {
    const {id} = useParams();
    const [customerOrders, setCustomerOrders] = useState<CustomerInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const cacheKey = "Customer_id_" + `${id}`;
    const cacheTimeKey = "Customer_timestamp_id_" + `${id}`;
    const cacheExpiry = 20 * 60 * 1000;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/${id}/orders`);
                if (response.data) {
                    const newCustomerOrders: CustomerInterface = {
                        id: response.data.id ?? '',
                        title: response.data.title ?? '',
                        lastname: response.data.lastname ?? '',
                        firstname: response.data.firstname ?? '',
                        postalCode: response.data.postal_code ?? '',
                        city: response.data.city ?? '',
                        email: response.data.email ?? '',
                        mobile: response.data.mobile ?? '',
                        birthday: response.data.birthday ?? '',
                        photo: response.data.photo ? `http://localhost:8080${response.data.photo}` : '',
                        orders: response.data.orders.map((order: any) => ({
                            orderDate: order.order_date ?? '',
                            productId: order.product_id ?? '',
                            quantity: order.quantity ?? '',
                            price: order.price ?? '',
                            currency: order.currency ?? '',
                            date: order.date ?? ''
                        }))
                    };

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
                    setLoading(false);
                    return;
                }
            }

            fetchData().catch(err => console.error('Error in fetchData:', err));
        };
        checkCacheAndFetch();
        const intervalId = setInterval(checkCacheAndFetch, cacheExpiry);

        return () => clearInterval(intervalId);
    }, [id]);

    return (
        <div className="bg-gray-600 text-blue-100">
            <div className="flex items-center justify-center m-4 py-8 app-min-height">

                {error ? (
                    <span className="badge badge-error size-4 w-full py-20 text-blue-100 font-bold">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 mr-1 size-4"/>
                        {error}
                            </span>
                ) : loading ? (
                    <span
                        className="flex items-center justify-center h-full loading loading-spinner text-primary px-36 bg-primary"></span>
                ) : customerOrders ? (
                    <div className="overflow-x-auto app-width-100">
                        <div className="card bg-gray-700 text-amber-50 m-2">
                            <div className="card-body justify-center">
                                <h2 className="font-bold underline card-title">
                                    Commandes du Client numèro : {id}
                                </h2>
                            </div>
                            <div className="float-start app-width-50">

                                    <ul className="justify-start list-disc p-4">
                                    <li>Nom: {customerOrders.title}{" "}{customerOrders.firstname}{" "}{customerOrders.lastname}</li>
                                    <li>Email : {customerOrders.email}</li>
                                    <li>Portable : {customerOrders.mobile}</li>
                                    <li>Birthday : {customerOrders.birthday}</li>
                                    <li>Adresse : {customerOrders.postalCode}{" "}{customerOrders.city}</li>

                                </ul>
                            </div>
                            <div className="float-end app-width-50">
                                <img className="rounded" alt="image user" src={customerOrders.photo}/>
                            </div>
                        </div>
                        <div className="flex justify-end py-5 pb-5">
                            <button
                                className="btn btn-secondary mb-5 space-x-5 mr-2"
                                onClick={() => navigate(`/customers`)}
                            >
                                <FontAwesomeIcon icon={faBackward} className="w-5 h-5 mr-2"/>
                                Back
                            </button>
                            <button
                                className="btn btn-warning mb-5 space-x-5"
                                onClick={() => navigate(`/customers/${id}/edit`)}
                            >
                                <FontAwesomeIcon icon={faBrush} className="w-5 h-5 mr-1"/>
                                Back
                            </button>
                        </div>

                        <TableComponent arrayData={customerOrders.orders} isTotal={true}/>
                    </div>
                ): (
                    <p> Pas d'informations</p>
                )}
            </div>
        </div>
    );
};


export default CustomerOrdersComponent;
