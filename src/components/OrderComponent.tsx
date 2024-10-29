import React from 'react';
import {OrderType} from "../model/OrderType.tsx";
import {getFormattedHeadersByLabel} from "../Utils.tsx";

type OrderComponentProps = {
    orders: OrderType[];
};
const OrderComponent: React.FC<OrderComponentProps> = ({orders}) => {
    const headers = getFormattedHeadersByLabel(orders,"id");
    return (
        <div className="card bg-gray-600 text-blue-100">
            <h2 className="font-bold underline m-3 px-5 py-1 card-title">Liste des Orders</h2>
            <div className="overflow-x-auto">
                <table className="table table-xs bordered rounded-md border-collapse border border-slate-400">
                    <thead>
                    <tr>
                        <th className="border border-slate-300 text-blue-100">#</th>
                        {headers.map((header, index) => (
                            <th className="border border-slate-300 text-blue-100"
                                key={index}>{header.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
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
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderComponent;
