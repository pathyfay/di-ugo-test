import {OrderInterface} from "./OrderInterface.tsx";

export interface CustomerInterface {
    title: string,
    customerId: number;
    lastname: string,
    firstname: string,
    postalCode: string,
    city: string,
    email: string,
    mobile: string,
    birthday: string,
    photo: string,
    orders: OrderInterface[]
}