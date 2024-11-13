import OrderComponent from '../components/OrderComponent';
import { OrderInterface } from '../Interface/OrderInterface';

const OrdersPage = (props: { orderList: OrderInterface[]; }) => {
    return (
        <div className="card bg-gray-600 text-blue-100">
            <h1>Gestion des Clients et Commandes</h1>
            <OrderComponent orders={props.orderList}/>
        </div>
    );
};

export default OrdersPage;
