"use client"
import React, { useState, useEffect } from 'react'; 
import { usePathname, useRouter } from 'next/navigation';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

interface User {
    slug: string;
}

export default function page() { 
    const router = useRouter(); 
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        startDate: '', 
        endDate: '', 
        slug: '', 
        status: '', 
        addons: [] as string[] 
    }); 
    const [showStartCalender, setShowStartCalender] = useState(false); 
    const [showEndCalender, setShowEndCalender] = useState(false); 

    useEffect(() => { 
        const slug = pathname.split('/')[1]; 
        const users: any[] = JSON.parse(localStorage.getItem('users')!) || [];
        
        const user = users.find(u => u.slug === slug); 
        
        if (user?.status === 'complete') {
            router.push(`/review/${user.slug}`);
        } 
        else { 
            setUserInfo({ 
                ...user, 
                ...userInfo, 
                name: user?.name, 
                slug: user?.slug, 
                status: user.status, 
                email: user?.email, 
                phone: user.phone, 
                startDate: user.startDate, 
                endDate: user.endDate, 
                addons: user.addons || []
            }); 
        } 
    }, []) 

    useEffect(() => { 
        const users = JSON.parse(localStorage.getItem('users')!); 
        localStorage.clear(); 

        const newUsersInfo = users.filter((u: User) => u.slug != userInfo?.slug)
        newUsersInfo.push(userInfo); 

        const result = newUsersInfo.filter((u: User) => {
            if(u.slug) {
                return u; 
            }
        })

        localStorage.setItem('users', JSON.stringify(result)); 

        if(userInfo.status == 'complete') {
            router.push(`/review/${userInfo.slug}`);
        }
    }, [userInfo]);

    function checkAddons(e: React.FormEvent<HTMLFormElement>) {
        const {value, checked} = e.target; 
        console.log({value, checked});

        if(checked) { 
            setUserInfo({...userInfo, addons: [...userInfo.addons, value] });
        } 
        else { 
            const newAddons = userInfo.addons.filter(a => a !== value); 
            setUserInfo({...userInfo, addons: newAddons });
        } 
    }

    function confirmHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); 
        console.log(userInfo);
        setUserInfo({...userInfo, status: 'complete'}); 
        
    } 

    return ( 
        <main className="min-h-screen flex justify-center items-center bg-white">
            <div className="min-h-[500px] w-[80%] md:w-[400px] border-4 border-slate-500 p-4 rounded-lg"> 
                <h1 className="text-2xl font-bold underline underline-offset-8 mb-8">
                    Booking...  
                </h1> 
                <div className="mb-4 flex flex-wrap gap-[10px]"> 
                    <p 
                        className="mr-2 font-bold text-lg w-[100px] text-right inline-block">
                        Name: 
                    </p> 
                    <h2 className="text-xl font-bold">
                        {userInfo.name}
                    </h2> 
                </div> 

                <form onSubmit={confirmHandler}>
                    <div className="mb-4">
                        <label 
                            className="mr-2 font-bold text-lg w-[100px] text-right inline-block" 
                            htmlFor="email">
                            Email
                        </label> 
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={userInfo.email} 
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value })} 
                            className="border-2 border-slate-400 pl-3 h-[35px] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Email" 
                        /> 
                    </div> 
                    <div className="mb-4">
                        <label 
                            className="mr-2 font-bold text-lg w-[100px] text-right inline-block" 
                            htmlFor="phone">
                            Phone
                        </label> 
                        <input 
                            type="phone" 
                            name="phone" 
                            id="phone" 
                            value={userInfo.phone} 
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value })} 
                            className="border-2 border-slate-400 pl-3 h-[35px] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Phone No." 
                        /> 
                    </div> 
                    <div className="mb-4">
                        <label 
                            className="mr-2 font-bold text-lg w-[100px] text-right inline-block" 
                            htmlFor="startDate">
                            Start Date
                        </label> 
                        <input 
                            type="startDate" 
                            name="startDate" 
                            id="startDate" 
                            value={userInfo.startDate} 
                            // onChange={(e) => setUserInfo({...userInfo, startDate: e.target.value })} 
                            className="border-2 border-slate-400 pl-3 h-[35px] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Start Date" 
                            onClick={() => setShowStartCalender(!showStartCalender)} 
                            required
                        /> 

                        {
                            showStartCalender && 
                            <Calendar
                                date={new Date()}
                                onChange={(range:any) => {
                                    setUserInfo({...userInfo, startDate: format(range, 'd MMMM, yyyy') }); 
                                    setShowStartCalender(!showStartCalender); 
                                }} 
                            />
                        }
                    </div> 
                    <div className="mb-4">
                        <label 
                            className="mr-2 font-bold text-lg w-[100px] text-right inline-block" 
                            htmlFor="endDate">
                            End Date
                        </label> 
                        <input 
                            type="endDate" 
                            name="endDate" 
                            id="endDate" 
                            value={userInfo.endDate} 
                            className="border-2 border-slate-400 pl-3 h-[35px] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="End Date" 
                            onClick={() => setShowEndCalender(!showEndCalender)} 
                            required
                        /> 
                        { 
                            showEndCalender && 
                            <Calendar
                                date={new Date()}
                                onChange={(range:any) => {
                                    setUserInfo({...userInfo, endDate: format(range, 'd MMMM, yyyy') }); 
                                    setShowEndCalender(!showEndCalender)
                                }} 
                            />
                        }
                    </div> 
                    <div>
                        <p 
                            className="mr-2 font-bold text-lg w-[100px] text-right inline-block">
                            Addons
                        </p> 
                    </div> 
                    <div className='flex gap-[20px] justify-center'> 
                        <div>
                            <input 
                                type="checkbox" 
                                id="wifi" 
                                name="wifi" 
                                value="wifi" 
                                checked={userInfo?.addons?.includes('wifi')}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                onChange={(e) => checkAddons(e)} 
                            />
                            <label htmlFor="wifi"
                                className='text-lg ml-2'
                            > 
                                Wifi 
                            </label>
                        </div>
                        <div>
                            <input 
                                type="checkbox" 
                                id="breakfast" 
                                name="breakfast" 
                                value="breakfast" 
                                checked={userInfo?.addons?.includes('breakfast')}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' 
                                onChange={(e) => checkAddons(e)} />
                            <label htmlFor="breakfast" className='text-lg ml-2'> 
                                Breakfast 
                            </label> 
                        </div>
                        <div>
                            <input 
                                type="checkbox" 
                                id="lunch" 
                                name="lunch" 
                                value="lunch" 
                                checked={userInfo?.addons?.includes('lunch')}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' 
                                onChange={(e) => checkAddons(e)} />
                            <label htmlFor="lunch" className='text-lg ml-2'> 
                                Lunch
                            </label>
                            </div>
                    </div> 

                    <button 
                        className=' bg-slate-700 text-xl text-white w-full py-2 rounded-2xl mt-5'>
                        Confirm 
                    </button>
                </form>
            </div> 
        </main> 
    ) 
} 
