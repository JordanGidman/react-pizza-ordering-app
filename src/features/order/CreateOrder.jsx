import { useState } from 'react';
import React from 'react';
import { Form, redirect, useActionData, useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from '../../utilities/helpers';
// https://uibakery.io/regex-library/phone-number -- not my code
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    );

function CreateOrder() {
    const [withPriority, setWithPriority] = useState(false);
    const username = useSelector((state) => state.user.username);
    const cart = useSelector(getCart);
    const navigation = useNavigate();
    const isSubmitting = navigation.state === 'submitting';
    const formErrors = useActionData();
    const totalCartPrice = useSelector(getTotalCartPrice);
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
    const totalPrice = totalCartPrice + priorityPrice;

    if (!cart.length) return <EmptyCart />;

    return (
        <div className="px-4 py-6 ">
            <h2 className="mb-8 text-xl font-semibold ">
                Ready to order? Let's go!
            </h2>

            <Form method="POST">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input
                        className="input grow"
                        type="text"
                        name="customer"
                        defaultValue={username}
                        required
                    />
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input
                            type="tel"
                            name="phone"
                            className="input w-full"
                            required
                        />
                        {formErrors?.phone && (
                            <p className="mt-2 rounded-md bg-red-100 p-2 text-sm text-red-700">
                                {formErrors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            type="text"
                            name="address"
                            required
                            className="input w-full"
                        />
                    </div>
                </div>

                <div className="mb-12 flex items-center gap-5">
                    <input
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label htmlFor="priority" className="font-medium">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    {/* This is needed to pass our cart into our action function */}
                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />
                    <Button disabled={isSubmitting} type="primary">
                        {isSubmitting
                            ? 'Placing Order'
                            : `Order Now for ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);

    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'true',
    };

    const errors = {};

    if (!isValidPhone(order.phone))
        errors.phone = 'Please provide a valid phone number.';

    if (Object.keys(errors).length > 0) return errors;

    //If all is in order then create the new order and redirect else return the errors object.
    const newOrder = await createOrder(order);

    //should not be overused as it is not well optimized but works for our purpose here.
    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
