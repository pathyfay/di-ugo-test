import CustomerComponent from '../components/CustomerComponent';
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";

const CustomersPage = (props: {customerList : CustomerInterface[]; }) => {

    return (
        <div className="card bg-gray-600 text-blue-100">
            <h1>Gestion des Clients et Commandes</h1>
            <CustomerComponent customers={props.customerList}/>
        </div>
    );
};

export default CustomersPage;
