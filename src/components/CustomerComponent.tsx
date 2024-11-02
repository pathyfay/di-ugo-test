import {CustomerType} from "../model/CustomerType.tsx";
import React from "react";
import {getFormattedHeadersByLabel} from "../Utils.tsx";
import TableComponent from "./TableComponent.tsx";
import {useNavigate} from "react-router-dom";



type CustomerComponentProps = {
    customers: CustomerType[];
};
const CustomerComponent: React.FC<CustomerComponentProps> = ({customers}) => {
    const headers = getFormattedHeadersByLabel(customers, "id");
    const navigate = useNavigate();
    const actions = (customerId) => [
        {
            'btnLabel': 'Show Orders',
            'className': 'btn btn-primary m-1 space-x-5 w-full max-w-xs py-4 float-end',
            'action': () => navigate(`/customers/${customerId}/orders`)
        }
    ];

    const newCustomers = customers.map(customer => ({
        ...customer, actions: actions(customer.customerId)
    }));

    return (
        <div className="card bg-gray-600 text-blue-100">
            <h2 className="font-bold underline m-3 px-5 py-1 card-title">Liste des Clients</h2>
            <div className="overflow-x-auto">
                <TableComponent headers={headers} datas={newCustomers} isIndex={true} isAction={true} isTotal={false}/>
            </div>
        </div>
    );
};

export default CustomerComponent;
