import React, {useState} from "react";
import TableComponent from "./TableComponent.tsx";
import {useNavigate} from "react-router-dom";
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";
import axios from "axios";
import ShowPopupComponent from "./ShowPopupComponent.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {RefetchCustomers} from "./refetchCustomers.tsx";

type CustomerComponentProps = {
    customers: CustomerInterface[];
};

const CustomerComponent: React.FC<CustomerComponentProps> = ({customers}) => {
    const navigate = useNavigate();
    const url = "http://localhost:8080/api/customers";
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    let typeMessage = 'error';
    let newCustomer: any[] = [];
    const handleNewUpdateCustomerClick = (id: number | null) => {
        id === null ? navigate("/customers/new") : navigate(`/customers/${id}/edit`);
    };
    const queryClient = useQueryClient();
    async function deleteCustomer(id: number) {
        setLoading(true);
        try {
            const response = await axios.delete(`${url}/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/ld+json',
                        'Accept': 'application/ld+json',
                    }
                }
            );

            if (response.status === 200 || response.status === 204) {
                setPopupMessage(`Succès de la suppression du client ${id}.`);
                typeMessage = 'succes';
                setShowPopup(true);
                RefetchCustomers();
                setTimeout((() => {
                    window.location.href = window.location.protocol + '//' + window.location.host + '/customers';
                }),1000)
            } else {
                console.log('Error Customer deleted :', response.data);
            }
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            setPopupMessage(`Erreur lors de la suppression du client ${id}.`);
            setShowPopup(true);
        }
    }

    const actions = (id: number) => [
        {
            'btnLabel': 'Show',
            'className': 'btn btn-primary m-1 bordered',
            'action': () => navigate(`/customers/${id}/orders`)
        },
        {
            'btnLabel': 'Update',
            'className': 'btn btn-warning m-1 bordered',
            'action': () => handleNewUpdateCustomerClick(id)
        },
        {
            'btnLabel': 'Delete',
            'className': 'btn btn-danger m-1 bordered',
            'action': () => deleteCustomer(id)
        }
    ];

    newCustomer = customers.map(customer => ({
        ...customer, actions: actions(customer.id)
    })).map(({orders, ...customer}) => customer);

    return (
        <div className="app-min-height">
            {loading ? (
                <span
                    className="flex items-center justify-center h-full loading loading-spinner text-primary px-36 bg-primary"></span>
            ) : (
                <div className="bg-gray-600 text-blue-100">
                    <h2 className="font-bold underline m-3 px-5 py-1 card-title">Liste des Clients</h2>
                    <div className="overflow-x-auto">
                        <button className="btn btn-warning m-4"
                                onClick={() => handleNewUpdateCustomerClick(null)}>Create New Customer
                        </button>
                        <TableComponent arrayData={newCustomer} isTotal={false}/>
                    </div>
                </div>
            )}

            {showPopup && (
                <ShowPopupComponent
                    message={popupMessage || "Une erreur est survenue."}
                    type={typeMessage}
                    onClose={() => setShowPopup(false)}/>
            )}
        </div>
    );
};

export default CustomerComponent;
