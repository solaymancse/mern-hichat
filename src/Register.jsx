import React, { useContext, useState } from 'react';
import axios from 'axios'
import { UserContext } from './UserContext';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister ,setLoginOrRegister] = useState('register');

  const {setUsername:setLoggedInUsername, setId}= useContext(UserContext);
  const register = async (e) => {
    e.preventDefault();
    
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    const {data} = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);

    

  }
  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={register}>

        <input type="text" placeholder='username' className='block w-full p-2 mb-2 rounded-sm text-center' 
        value={username} onChange={(e) => setUsername(e.target.value)} />

        <input type="password" placeholder='password' className='block w-full p-2 mb-2 rounded-sm text-center' 
        value={password} onChange={(e) => setPassword(e.target.value)}  />

        <button className='bg-blue-500 text-white w-full rounded-sm p-2' >
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className='text-center mt-2'>
          {isLoginOrRegister === 'register' && (
            <div>
               Already have account?
            <button onClick={()=> setLoginOrRegister('login')}>
            Click here
          </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
               don't have account?
            <button onClick={()=> setLoginOrRegister('register')}>
            Click here
          </button>
            </div>
          )}
      
        </div>
      </form>
    </div>
  )
}
