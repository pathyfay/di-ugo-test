import React, {useEffect, useState} from "react";
import {CustomerInterface} from "../Interface/CustomerInterface.tsx";
import axios from "axios";
import {useParams} from "react-router-dom";
import {RefetchCustomers} from "../components/refetchCustomers.tsx";

const CustomerForm: React.FC = () => {
    const url = "http://localhost:8080/api/customers";
    const [file, setFile] = useState<File | null>(null);
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useState<CustomerInterface>({
        title: "Mr",
        id: 0,
        lastname: "",
        firstname: "",
        postalCode: "",
        city: "",
        email: "",
        mobile: "",
        birthday: "",
        photo: "",
        orders: [],
    });

    useEffect(() => {
        fetchCustomer(id).then((data) => {
            setCustomer({
                id: 0,
                orders: [],
                title: data.title || "",
                lastname: data.lastname || "",
                firstname: data.firstname || "",
                postalCode: data.postalCode || "",
                city: data.city || "",
                email: data.email || "",
                mobile: data.mobile || "",
                birthday: data.birthday || "",
                photo: data.photo || ""
            });
        });
    }, [id]);

    const fetchCustomer = async (id: string | undefined) => {
        if (id !== undefined) {
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/${id}/orders`);
                return response.data;
            } catch (error) {
                console.error("Erreur lors de la récupération du client :", error);
                throw error;
            }
        }

        return customer;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", customer.title);
        formData.append("lastname", customer.lastname);
        formData.append("firstname", customer.firstname);
        formData.append("postalCode", customer.postalCode);
        formData.append("city", customer.city);
        formData.append("email", customer.email);
        formData.append("mobile", customer.mobile);
        formData.append("birthday", customer.birthday);
        if (file) {
            formData.append("photo", file);
        }
        console.log("Customer data submitted formData:", formData)
        try {
            const response = id ? await axios.put(url+`/${id}/edit`, formData)
                : await axios.post(url+'/new', formData);

            if (response.status === 200 || response.status === 201) {
                RefetchCustomers();
                setTimeout((() => {
                    window.location.href = window.location.protocol + '//' + window.location.host + '/customers';
                }),1000)
            } else {
                console.log('Error Customer Updated :', response.data);
            }
        } catch (error) {
            console.log(`Erreur lors de l'update du client.`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Title:
                    <select className="select select-bordered" name="title" value={customer.title} onChange={handleChange}>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mme</option>
                    </select>
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Firstname:
                    <input
                        type="text"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="firstname"
                        value={customer.firstname || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Lastname:
                    <input
                        type="text"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="lastname"
                        value={customer.lastname || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Email:
                    <input
                        type="email"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="email"
                        value={customer.email || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Mobile:
                    <input
                        type="text"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="mobile"
                        value={customer.mobile || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Postal Code:
                    <input
                        type="text"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="postalCode"
                        value={customer.postalCode}
                        onChange={handleChange || ""}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    City:
                    <input
                        type="text"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="city"
                        value={customer.city || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Birthday:
                    <input
                        type="date"
                        className="input input-bordered input-primary w-full max-w-xs"
                        name="birthday"
                        value={customer.birthday || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="form-control m-2">
                <label className="form-control w-full max-w-xs">
                    Photo URL:
                    {customer.photo ? (<p>File selected: {customer.photo}</p>) :( <span> {file?.name}</span>)}
                    <input
                        type="file"
                        className="file-input w-full max-w-xs"
                        name="photo"
                        value=""
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            <button className="btn btn-success w-full max-w-lg m-4" type="submit">Submit</button>
        </form>
    );
};

export default CustomerForm;