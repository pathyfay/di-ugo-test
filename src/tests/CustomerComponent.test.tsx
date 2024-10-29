import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {CustomerType} from "../model/CustomerType.tsx";
import CustomerComponent from "../components/CustomerComponent.tsx";

const mockCustomers: CustomerType[] = [
    {
        title: 'Mr.',
        customerId: 1,
        lastname: 'Doe',
        firstname: 'John',
        postalCode: '12345',
        city: 'Somewhere',
        email: 'john.doe@example.com'
    },
    {
        title: 'Ms.',
        customerId: 2,
        lastname: 'Smith',
        firstname: 'Jane',
        postalCode: '67890',
        city: 'Anywhere',
        email: 'jane.smith@example.com'
    }
];

describe('CustomerComponent', () => {
    it('affiche la liste des clients avec les bons titres de colonne', () => {
        render(
            <MemoryRouter>
                <CustomerComponent customers={mockCustomers} />
            </MemoryRouter>
        );

        // Vérifier le titre du tableau
        expect(screen.getByText(/Liste des Clients/i)).toBeInTheDocument();

        // Vérifier les titres des colonnes
        expect(screen.getByText(/TITLE/i)).toBeInTheDocument();
        expect(screen.getByText(/CUSTOMER ID/i)).toBeInTheDocument();
        expect(screen.getByText(/LASTNAME/i)).toBeInTheDocument();
        expect(screen.getByText(/FIRSTNAME/i)).toBeInTheDocument();
        expect(screen.getByText(/POSTAL CODE/i)).toBeInTheDocument();
        expect(screen.getByText(/CITY/i)).toBeInTheDocument();
        expect(screen.getByText(/EMAIL/i)).toBeInTheDocument();
    });

    it('affiche les informations de chaque client et un bouton d\'action', () => {
        render(
            <MemoryRouter>
                <CustomerComponent customers={mockCustomers} />
            </MemoryRouter>
        );

        // Vérifier les informations des clients
        mockCustomers.forEach((customer) => {
            expect(screen.getByText(customer.lastname)).toBeInTheDocument();
            expect(screen.getByText(customer.firstname)).toBeInTheDocument();
            expect(screen.getByText(customer.email)).toBeInTheDocument();
        });

        // Vérifier la présence des boutons
        const buttons = screen.getAllByText(/Show Orders/i);
        expect(buttons.length).toBe(mockCustomers.length);
    });
});
