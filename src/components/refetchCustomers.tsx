import { useQueryClient } from '@tanstack/react-query';

export const RefetchCustomers = () => {
    const queryClient = useQueryClient();
    queryClient.invalidateQueries(['customers']).then(r => {
        console.log("error refetchCustomers");
        console.log(r);
    });
};
