import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4">Register</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block w-full mb-2 p-2 border" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block w-full mb-2 p-2 border" />
        <button type="submit" className="w-full p-2 bg-green-500 text-white">Register</button>
      </form>
    </div>
  );
}

export default Register; 