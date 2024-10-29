import CustomerComponent from '../components/CustomerComponent';

const CustomersPage = ({customers}) => {
    return (
        <div className="card bg-gray-600 text-blue-100">
            <h1>Gestion des Clients et Commandes</h1>
            <CustomerComponent customers={customers} />
        </div>
    );
};

export default CustomersPage;
