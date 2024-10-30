import React from 'react';
import {OrderType} from "../model/OrderType.tsx";
import {getFormattedHeadersByLabel} from "../Utils.tsx";
import TableComponent from "./TableComponent.tsx";

type OrderComponentProps = {
    orders: OrderType[];
};
const OrderComponent: React.FC<OrderComponentProps> = ({orders}) => {
    const headers = getFormattedHeadersByLabel(orders,"id");

    return (
        <div className="card bg-gray-600 text-blue-100">
            <h2 className="font-bold underline m-3 px-5 py-1 card-title">Liste des Orders</h2>
            <div className="overflow-x-auto">
                <TableComponent headers={headers} datas={orders} isIndex={true} isAction={false} isTotal={false}/>
            </div>
        </div>
    );
};

export default OrderComponent;
