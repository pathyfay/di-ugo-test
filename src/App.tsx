import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import './style.css';
import ToolbarComponent from './components/ToolbarComponent.tsx';
import HomePage from './pages/HomePage.tsx';
import CustomerOrdersComponent from './components/CustomerOrdersComponent.tsx';
import CustomerForm from './form/CustomerForm.tsx';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query';
import {FetchApi} from './api/FetchApi.tsx';
import {useEffect, useState} from "react";
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import OrderForm from "./form/OrderForm.tsx";

const queryClient = new QueryClient();
const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
});

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
});

const AppContent = () => {
    const [theme, setTheme] = useState('light');
    const {data, isLoading, error} = useQuery({
        queryKey: ['customers'],
        queryFn: () => FetchApi(),
    });
    useEffect(() => {
        window.localStorage.setItem('react-router-v7_relativeSplatPath', 'true');
        window.localStorage.setItem('react-router-v7_startTransition', 'true');
    }, []);

    return (
        <div className="flex items-center p-2" data-theme={theme}>
            <div className="app-width-100 mockup-browser border-base-300 border py-5">
                <h1 className="ml-3 text-indigo-600 p-5 align-middle">Di-UGO-Test</h1>
                <div className="glass bg-opacity-90 border-gray-500 flex-grow p-2">
                    <ToolbarComponent theme={theme} toggleTheme={setTheme}/>
                    <div className="flex items-center justify-center py-8 app-min-height">
                        {isLoading ? (
                            <span
                                className="flex items-center justify-center h-full loading loading-spinner text-primary px-36 bg-primary"></span>
                        ) : error ? (
                            <div className="badge badge-error size-4 w-full py-20 mb-5 text-blue-100 font-bold">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 mr-1 size-4"/>
                                Erreur lors du chargement des données
                            </div>
                        ) : (
                            <div className="app-width-100">
                                <Router>
                                    <Routes>
                                        <Route path="/" element={<HomePage/>}/>
                                        <Route path="/customers" element={<CustomersPage customerList={data?.customerList}/>}/>
                                        <Route path="/customers/new" element={<CustomerForm/>}/>
                                        <Route path="/customers/:id/edit" element={<CustomerForm/>}/>
                                        <Route path="/customers/:id/orders" element={<CustomerOrdersComponent/>}/>

                                        <Route path="/orders" element={<OrdersPage orderList={data?.orderList}/>}/>
                                        <Route path="/orders/new" element={<OrderForm/>}/>
                                        <Route path="/orders/:id/edit" element={<OrderForm/>}/>
                                    </Routes>
                                </Router>
                            </div>
                        )}
                    </div>
                    <footer className="footer footer-center bg-base-300 text-base-content p-4">
                        <aside>
                            <p>
                                Copyright © {new Date().getFullYear()} - All right reserved by Patrician Fayette
                            </p>
                        </aside>
                    </footer>
                </div>
            </div>
        </div>
    );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AppContent/>
    </QueryClientProvider>
);

export default App;
