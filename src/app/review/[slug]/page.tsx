"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function page() {
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        slug: '',
        status: '',
        addons: [] as string[],
        notFound: false
    });

    useEffect(() => {
        const slug = pathname.split('/')[2];
        const users: any[] = JSON.parse(localStorage.getItem('users')!) || [];
        const user = users.find(u => u.slug === slug);

        if (!user) {
            setUserInfo({
                ...userInfo,
                notFound: true
            })
        }
        else if (user.status === 'complete') {
            setUserInfo({ ...user });
        }
    }, [])

    const notify = () => toast.success("Payment Successful!", {
        style: {
            backgroundColor: '#4bb516',
            color: 'white',
        }, 
        progressStyle: {
            backgroundColor: '#ffa500', // Orange color for the progress bar
        }}); 

    async function makePaymentRequest(token: any) {
        const body = {
            token,
            product: {
                name: 'Deluxe Room',
                price: 100
            }
        }

        const headers = {
            "Content-Type": "application/json"
        }

        try {
            const { data } = await axios.post('/api/payment', body, { headers });
            console.log("Payment successful:", data);
            notify();
            return data;
        }
        catch (error) {
            console.error("Error making payment:", error);
        }
    }

    if (userInfo?.notFound) {
        return (
            <main className="min-h-screen flex justify-center items-center bg-white">

                <div className="min-h-[200px] w-[80%] md:w-[400px] border-4 border-slate-500 p-4 rounded-lg flex flex-wrap justify-center items-center">
                    <h1 className="text-4xl font-bold text-red-700">
                        User Not Found
                    </h1>
                </div>
            </main>
        )
    }
    else {
        return (
            <main className="min-h-screen flex justify-center items-center bg-white">
                <div className="min-h-[500px] w-[80%] md:w-[450px] border-4 border-slate-500 p-4 flex flex-col justify-between">
                    <div className=''>
                        <h1 className="text-2xl font-bold mb-4">
                            Review Your Data
                        </h1>
                        <div className='bg-white border-2 border-gray-300 py-6 px-3'>
                            <div className="mb-4 flex flex-wrap">
                                <p
                                    className="mr-2 text-lg w-[100px] text-right inline-block">
                                    Name:
                                </p>
                                <h2 className="text-xl">
                                    {userInfo.name}
                                </h2>
                            </div>
                            <div className="mb-4 flex flex-wrap">
                                <p
                                    className="mr-2 text-lg w-[100px] text-right inline-block">
                                    Email:
                                </p>
                                <h2 className="text-xl">
                                    {userInfo.email || '-'}
                                </h2>
                            </div>
                            <div className="mb-4 flex flex-wrap">
                                <p
                                    className="mr-2 text-lg w-[100px] text-right inline-block">
                                    Phone No:
                                </p>
                                <h2 className="text-xl">
                                    {userInfo.phone || '-'}
                                </h2>
                            </div>
                            <div className="mb-4 flex flex-wrap">
                                <p
                                    className="mr-2 text-lg w-[100px] text-right inline-block">
                                    Start Date:
                                </p>
                                <h2 className="text-xl">
                                    {userInfo.startDate}
                                </h2>
                            </div>
                            <div className="flex flex-wrap">
                                <p
                                    className="mr-2 text-lg w-[100px] text-right inline-block">
                                    End Date:
                                </p>
                                <h2 className="text-xl">
                                    {userInfo.endDate}
                                </h2>
                            </div>
                            <div className='mt-4 flex '>
                                <p
                                    className="mr-2 pt-[6px] text-lg w-[100px] text-right inline-block">
                                    Addon:
                                </p>
                                <div className="mb-4 flex flex-wrap justify-center">
                                    {
                                        userInfo?.addons?.map((addon: string, index: number) => {
                                            return (
                                                <p className="text-xl mr-3 border-2 border-gray-400 px-2 py-1">
                                                    {addon}
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <StripeCheckout
                        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                        token={makePaymentRequest}
                        name=''
                        amount={100 * 100}
                    >
                        <button className='w-full py-2 bg-violet-600 text-white text-3xl rounded-sm'>
                            Pay $100
                        </button>
                    </StripeCheckout>
                </div>

                <ToastContainer
                    position='bottom-right'
                />
            </main>
        )
    }
} 
