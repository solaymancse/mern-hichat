import React, { useState } from 'react';
import axios from 'axios'

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();

    await axios.post('/register', { username, password })

    console.log(username,password);

  }
  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={register}>

        <input type="text" placeholder='username' className='block w-full p-2 mb-2 rounded-sm text-center' 
        value={username} onChange={(e) => setUsername(e.target.value)} />

        <input type="password" placeholder='password' className='block w-full p-2 mb-2 rounded-sm text-center' 
        value={password} onChange={(e) => setPassword(e.target.value)}  />

        <button className='bg-blue-500 text-white w-full rounded-sm p-2' >Register</button>
      </form>
    </div>
  )
}
