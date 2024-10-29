import {CustomerType} from "../model/CustomerType.tsx";
import React from "react";
import { useNavigate } from 'react-router-dom';
import {getFormattedHeadersByLabel} from "../Utils.tsx";


type CustomerComponentProps = {
    customers: CustomerType[];
};
const CustomerComponent: React.FC<CustomerComponentProps> = ({customers}) => {
    const navigate = useNavigate();
    const headers = getFormattedHeadersByLabel(customers,"id");

    return (
        <div className="card bg-gray-600 text-blue-100">
            <h2 className="font-bold underline m-3 px-5 py-1 card-title" >Liste des Clients</h2>
            <div className="overflow-x-auto">
                <table className="table table-xs bordered rounded-md border-collapse border border-slate-400">
                    <thead>
                    <tr>
                        <th className="border border-slate-300 text-blue-100">#</th>
                        {headers.map((header, index) => (
                            <th className="border border-slate-300 text-blue-100" key={index}>{header.replace('_', ' ').toUpperCase()}</th>
                        ))}
                        <th className="border border-slate-300 text-blue-100">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer, index) => (
                        <tr key={index}>
                            <th className="border border-slate-300">{index + 1}</th>
                            <td className="border border-slate-300">{customer.title} </td>
                            <td className="border border-slate-300">{customer.customerId} </td>
                            <td className="border border-slate-300">{customer.lastname} </td>
                            <td className="border border-slate-300">{customer.firstname} </td>
                            <td className="border border-slate-300">{customer.postalCode} </td>
                            <td className="border border-slate-300">{customer.city} </td>
                            <td className="border border-slate-300">{customer.email} </td>
                            <td className="border border-slate-300">
                                <button
                                    className="btn btn-primary m-1 space-x-5 w-full max-w-xs py-4 float-end"
                                    onClick={() => navigate(`/customers/${customer.customerId}/orders`)}
                                >
                                    Show Orders
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerComponent;
