"use client"
import React, { useState } from 'react'; 
import { useRouter } from 'next/navigation'; 

export default function Home() { 
  const router = useRouter(); 
  const [ name, setName ] = useState(''); 

  function handleName(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault(); 
    const newUser = { 
      name: name, 
      slug: name.toLowerCase().split(' ').join('-'), 
      status: 'incomplete' 
    } 
    setName(''); 

    let users: (any[] | string | null) = localStorage.getItem('users'); 
    users = users ? JSON.parse(users) : []; 

    if(Array.isArray(users)) { 
      const tempUser = users.find(u => u.slug === newUser.slug); 
      if(tempUser) { 
        if(tempUser.status === 'complete') {
          router.push(`/review/${tempUser.slug}`);
        }
        else router.push(`/${newUser.slug}`); 
        return; 
      }
      users.push(newUser); 
    } 
    localStorage.setItem('users', JSON.stringify(users)); 
    router.push(`/${newUser.slug}`); 
  } 

  return ( 
    <main className="min-h-screen flex justify-center items-center bg-white">
      <div className="min-h-[500px] w-[80%] md:w-[400px] border-4 border-slate-500 p-4 rounded-lg">
        <h1 className="text-2xl font-bold underline underline-offset-8 mb-8"> 
          Start Booking 
        </h1> 

        <form onSubmit={handleName}> 
          <label htmlFor="name" className="mr-2 font-bold text-lg">
            Name: 
          </label> 
          <input 
            type="text" 
            id="name" 
            required 
            className="border-2 border-slate-400 pl-3 h-[35px] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={name} 
            onChange={(event) => setName(event.target.value)} 
          /> 

          <button className="inline-block my-4 px-5 py-1 bg-slate-800 text-white rounded-sm">
            Next 
          </button> 
        </form> 
      </div> 
    </main> 
  ); 
} 
