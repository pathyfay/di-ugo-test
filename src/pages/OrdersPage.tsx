import OrderComponent from '../components/OrderComponent';

const CustomersPage = ({orderList}) => {
    const orders = orderList.map(
        ({orderId, productId, quantity, price, currency, city}) => ({
            purchaseIdentifier: orderId ?? '',
            productId: productId ?? '',
            quantity: quantity ?? '',
            price: price ?? '',
            currency: currency ?? '',
            city: city ?? ''
        })
    );
    return (
        <div className="card bg-gray-600 text-blue-100">
            <h1>Gestion des Clients et Commandes</h1>
            <OrderComponent orders={orders} />
        </div>
    );
};

export default CustomersPage;
