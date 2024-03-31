import React from 'react';
import Button from '../../ui/Button';
import { useFetcher } from 'react-router-dom';
import { updateOrder } from '../../services/apiRestaurant';

function UpdateOrder({ order }) {
    const fetcher = useFetcher();

    return (
        //if we want to write data to a different route we can use the fetcher.Form component, even though there is no input data in this case
        <fetcher.Form method="PATCH" className="text-right">
            <Button type="primary">Make Priority</Button>
        </fetcher.Form>
    );
}

export default UpdateOrder;

export async function action({ request, params }) {
    const data = { priority: true };
    await updateOrder(params.orderId, data);
    return null;
}
