import React from "react";
import TableComponent from "./TableComponent.tsx";
import {useNavigate} from "react-router-dom";
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";

type CustomerComponentProps = {
    customers: CustomerInterface[];
};

const CustomerComponent: React.FC<CustomerComponentProps> = ({customers}) => {
    const navigate = useNavigate();
    const actions = (customerId: number) => [
        {
            'btnLabel': 'Show Orders',
            'className': 'btn btn-primary m-1 bordered',
            'action': () => navigate(`/customers/${customerId}/orders`)
        }
    ];

    const newCustomers = customers.map(customer => ({
        ...customer, actions: actions(customer.customerId)
    })).map(({ orders, ...customer }) => customer);

    return (
        <div className="bg-gray-600 text-blue-100">
            <h2 className="font-bold underline m-3 px-5 py-1 card-title">Liste des Clients</h2>
            <div className="overflow-x-auto">
                <TableComponent arrayData={newCustomers} isTotal={false}/>
            </div>
        </div>
    );
};

export default CustomerComponent;
