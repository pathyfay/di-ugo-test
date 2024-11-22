import {useNavigate, useParams} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward} from "@fortawesome/free-solid-svg-icons/faBackward";
import TableComponent from "./TableComponent.tsx";
import {faBrush, faExclamationTriangle, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useQuery} from "@tanstack/react-query";
import {FetchCustomerById} from "../api/FetchApi.tsx";

const CustomerOrdersComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const cacheKey = "Customer_id_" + `${id}`;
    const cacheTimeKey = "Customer_timestamp_id_" + `${id}`;
    const cacheExpiry = 20 * 60 * 1000;

    const {data: customerOrders, isLoading, error} = useQuery({
        queryKey: ['customerOrders', id],
        queryFn: () => FetchCustomerById(id),
        initialData: () => {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const cachedTimestamp = localStorage.getItem(cacheTimeKey);
                const now = Date.now();
                if (cachedTimestamp && now - parseInt(cachedTimestamp, 10) < cacheExpiry) {
                    return JSON.parse(cachedData);
                }
            }
            return undefined;
        },
        onSuccess: (data: any) => {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
        },
        onError: (err: any) => {
            console.error('Erreur lors de la récupération des données', err);
        }
    });

    return (
        <div className="bg-gray-600 text-blue-100">
            <div className="flex items-center justify-center m-4 py-8 app-min-height">
                {error ? (
                    <span className="badge badge-error size-4 w-full py-20 text-blue-100 font-bold">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 mr-1 size-4"/> Erreur lors du chargement des données
                    </span>
                ) : isLoading ? (
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
                                className="btn btn-warning mb-5 space-x-5 mr-2"
                                onClick={() => navigate(`/customers/${id}/edit`)}
                            >
                                <FontAwesomeIcon icon={faBrush} className="w-5 h-5 mr-1"/>
                                Update
                            </button>
                            <button
                                className="btn btn-warning mb-5 space-x-5"
                                onClick={() => navigate(`/orders/${id}/edit`)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-1"/>
                                Add Order
                            </button>
                        </div>

                        <TableComponent arrayData={customerOrders.orders} isTotal={true}/>
                    </div>
                ) : (
                    <p> Pas d'informations</p>
                )}
            </div>
        </div>
    );
};


export default CustomerOrdersComponent;
