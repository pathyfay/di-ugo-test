import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faUser} from "@fortawesome/free-solid-svg-icons";


const ToolbarComponent = ({theme, toggleTheme}) => {
    const handleChangeTheme = (event: { currentTarget: { value: any; }; }) => {
        toggleTheme(event.currentTarget.value);
    };

    return (
        <nav className="bg-base-100 shadow-2xl shadow-success-content">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
                    <li>
                        <a href="/" className="flex items-center">
                            <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-1"/>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/customers" className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-1"/>
                            Customers
                        </a>
                    </li>
                    <li>
                        <a href="/orders">
                            Orders
                            <span className="badge badge-xs badge-info"></span>
                        </a>
                    </li>
                </ul>
                <select className="select select-bordered w-full max-w-xs m-2" name="theme" defaultValue={theme}
                        onChange={handleChangeTheme}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="cupcake">cupcake</option>
                </select>
            </div>
        </nav>

    );
};

export default ToolbarComponent;
