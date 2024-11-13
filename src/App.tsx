import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import './style.css';
import ToolbarComponent from "./components/ToolbarComponent.tsx";
import HomePage from "./pages/HomePage.tsx";
import axios from "axios";
import CustomerOrdersComponent from "./components/CustomerOrdersComponent.tsx";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CustomerInterface} from "./Interface/CustomerInterface.tsx";
import {OrderInterface} from "./Interface/OrderInterface.tsx";

const App = () => {
    const [theme, setTheme,] = useState("light");
    const [customerList, setCustomerList] = useState<CustomerInterface[]>([]);
    const [orderList, setOrderList] = useState<OrderInterface[]>([]);
    const [loading, setLoading] = useState(true);
    let [error, setError] = useState('');

    const cacheKey = "apiCustomers";
    const cacheTimeKey = "apiCustomersTimestamp";
    const cacheExpiry = 10 * 60 * 1000;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/customers');
                if (response.data) {
                    let aOrders: any[] = [];
                    let customers = response.data.map((customer: any) =>{
                        aOrders = [ ...aOrders, ...customer.orders];
                        return {
                            title: customer?.title ?? '',
                            customerId: customer?.customer_id ?? 0,
                            lastname: customer?.lastname ?? '',
                            firstname: customer?.firstname ?? '',
                            postalCode: customer?.postal_code ?? customer?.postalCode ?? '',
                            city: customer?.city ?? '',
                            email: customer?.email ?? '',
                            mobile: customer?.mobile ?? '',
                            birthday: customer?.birthday ?? '',
                            photo: customer?.photo ?? '',
                            orders: customer?.orders ?? [],
                        }});
                    const orders = aOrders.sort((a, b) => a.id - b.id).map((order: any) => {
                        return(
                            {
                                id: order.id,
                                orderDate: order.order_date,
                                productId: order.product_id  ?? 0,
                                quantity: order.quantity  ?? 0,
                                price: order.price ?? 0,
                                currency: order.currency ?? '',
                                date: order.date ?? ''
                            }
                        )
                    });

                    setCustomerList(customers);
                    setOrderList(orders);
                    localStorage.setItem(cacheKey, JSON.stringify({customers: customers, orders: orders}));
                    localStorage.setItem(cacheTimeKey, Date.now().toString());
                } else {
                    console.warn("La propriété hydra:member est manquante dans response.data");
                }
            } catch (e: unknown) {
                error = 'Erreur lors du chargement des données';
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        const checkCacheAndFetch = () => {
            const cachedData = localStorage.getItem(cacheKey);
            const cachedTimestamp = localStorage.getItem(cacheTimeKey);

            if (cachedData && cachedTimestamp) {
                const now = Date.now();
                const cacheTime = parseInt(cachedTimestamp, 10);
                if (now - cacheTime < cacheExpiry) {
                    const parsedData = JSON.parse(cachedData);
                    setCustomerList(parsedData.customers);
                    setOrderList(parsedData.orders);
                    setLoading(false);
                    return;
                }
            }

            fetchData().catch(err => console.error('Error in fetchData:', err));
        };

        checkCacheAndFetch();
        const intervalId = setInterval(checkCacheAndFetch, cacheExpiry);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex items-center p-2" data-theme={theme}>
            <div className="app-width-100 mockup-browser border-base-300 border py-5">
                <h1 className="ml-3 text-indigo-600 p-5 align-middle">Di-UGO-Test </h1>
                <div className="glass bg-opacity-90 border-gray-500 flex-grow p-2">
                    <ToolbarComponent theme={theme} toggleTheme={setTheme}/>
                    <div className="flex items-center justify-center py-8 app-min-height">
                        {error ? (
                            <span className="badge badge-error size-4 w-full py-20 text-blue-100 font-bold">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 mr-1 size-4"/>
                                {error}
                            </span>
                        ) : loading ? (
                            <span
                                className="flex items-center justify-center h-full loading loading-spinner text-primary px-36 bg-primary"></span>
                        ) : (
                            <div className="app-width-100">
                                <Router>
                                    <Routes>
                                        <Route path="/" element={<HomePage/>}/>
                                        <Route path="/customers" element={<CustomersPage customerList={customerList}/>}/>
                                        <Route path="/customers/:customerId/orders"
                                               element={<CustomerOrdersComponent/>}/>
                                        <Route path="/orders" element={<OrdersPage orderList={orderList}/>}/>
                                    </Routes>
                                </Router>
                            </div>
                        )}
                    </div>
                    <footer className="footer footer-center bg-base-300 text-base-content p-4">
                        <aside>
                            <p>Copyright © {new Date().getFullYear()} - All right reserved by Patrician
                                Fayette</p>
                        </aside>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default App;


