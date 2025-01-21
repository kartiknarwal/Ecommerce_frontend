import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartData } from '@/context/CartContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { server } from '@/main';
import {loadStripe} from '@stripe/stripe-js'

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Payment = () => {
    const { cart, subTotal, fetchCart } = CartData();
    const [address, setAddress] = useState({});
    const [method, setMethod] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch the selected address based on the ID
    async function fetchAddress() {
        try {
            const { data } = await axios.get(`${server}/api/address/${id}`, {
                headers: {
                    token: Cookies.get("token"),
                },
            });
            console.log("Address Data:", data); // Debugging log
            setAddress({
                address: data.address,
                phone: data.phone,
            });
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    }
    

    useEffect(() => {
        fetchAddress();
    }, [id]);

    const paymentHandler = async () => {
        if(method === "cod"){
            setLoading(true)
            try {
                const {data} =await axios.post(`${server}/api/order/new/cod`,{
                    method,
                    phone:address.phone,
                    address:address.address,
                },{
                    headers:{
                        token:Cookies.get("token"),
                    }
                }

            );
            setLoading(false);
            toast.success(data.message);
            fetchCart();
            navigate("/orders");
            } catch (error) {
                setLoading(false);
                toast.error(error.response.data.message)
            }
        }

        if(method === "online"){
            const stripePromise =loadStripe("pk_test_51QhlfYA8bDD5hbKCOJ0T8VqZJLfQGQjVFebsp7DRsMbc9iujrteMMQDEt8SAB0dxalRyuxFahLeGNNBG2yBNL5az00kvpeEcAW");
            try {
                setLoading(true);
                const stripe =await stripePromise

                const{data} =await axios.post(`${server}/api/order/new/online`,{
                    method,
                    phone:address.phone,
                    address:address.address,
                },
                {
                    headers:{
                        token:Cookies.get("token"),
                    }
                }
            );

            if(data.url){
                window.location.href =data.url
                setLoading(false);
            }else{
                toast.error("Failed to create Payment Session");
                setLoading(false);
            }
            } catch (error) {
                toast.error("Payment Failed Please Try again");
                setLoading(false);
            }
        }
    };



    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">Proceed to Payment</h2>
                        
                        {/* Cart Details */}
                        <div>
                            <h3 className="text-xl font-semibold">Products</h3>
                            <Separator className="my-2" />
                            <div className="space-y-4">
                                {cart &&
                                    cart.map((e, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border dark:border-gray-700"
                                        >
                                            <img
                                                src={e.product.images[0].url}
                                                alt="Product"
                                                className="w-16 h-16 object-cover rounded mb-4 md:mb-0"
                                            />
                                            <div className="flex-1 md:ml-4 text-center md:text-left">
                                                <h2 className="text-lg font-medium">{e.product.title}</h2>
                                                <p className="text-sm text-muted-foreground dark:text-gray-400">
                                                    ₹{e.product.price} X {e.quantity}
                                                </p>
                                                <p className="text-sm text-muted-foreground dark:text-gray-400">
                                                    ₹{e.product.price * e.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="text-lg font-medium text-center">
                            Total Price to be Paid: ₹{subTotal}
                        </div>

                        {address.address && (
                            <div className="bg-card p-4 rounded-lg shadow border space-y-4 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-center">Details</h3>
                                <Separator className="my-2" />

                                <div className="flex flex-col space-y-4">
                                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                                        <strong>Address:</strong> {address.address}
                                    </p>
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                                        <strong>Phone:</strong> {address.phone}
                                    </p>
                                </div>

                                <div className="w-full md:w-1/2">
                                    <h4 className="font-semibold mb-1">Select Payment Method</h4>
                                    <select
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-card dark:bg-gray-900 dark:text-white"
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="cod">COD</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </div>
                            
                        )}
                          {/* Proceed to Checkout Button */}
                    <Button
                        className="w-full py-3 mt-4"
                        onClick={paymentHandler}
                        disabled={!method || !address.address}
                    >
                        Proceed to Checkout
                    </Button>
                    </div>

                  
                </div>
            )}
        </div>
    );
};

export default Payment;
