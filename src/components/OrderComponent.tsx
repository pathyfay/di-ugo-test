import React from 'react';
import TableComponent from "./TableComponent.tsx";
import {OrderInterface} from "../Interface/OrderInterface.tsx";

type OrderComponentProps = {
    orders: OrderInterface[];
};
const OrderComponent: React.FC<OrderComponentProps> = ({orders}) => {
    return (
        <div className="bg-gray-600 text-blue-100">
            <h2 className="font-bold underline m-3 px-5 py-1 card-title">Liste des Orders</h2>
            <div className="overflow-x-auto">
                <TableComponent arrayData={orders} isTotal={false}/>
            </div>
        </div>
    );
};

export default OrderComponent;
