import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

type showPopupProps = {
    message: string;
    type: string;
    onClose: () => void;
}

const ShowPopupComponent: React.FC<showPopupProps> = ({message, type, onClose}) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose();
        }, 10000);

        return () => clearTimeout(timeout);
    }, [onClose]);


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded shadow-lg">
                <h3 className={`font-bold ${type == "error" ? "text-red" : "text-green"}`}>
                    {type == "error" ? "Erreur" : "Succès"}
                </h3>
                {type === "error" ? (
                    <button className="btn btn-danger mt-3" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} className="h-5 mr-1"/> Fermer
                    </button>
                ) : ''
                }
                <p>{message}</p>
            </div>
        </div>
    );
};

export default ShowPopupComponent;
