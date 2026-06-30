'use client';
import { useState } from 'react';
export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    }
  };
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">RentFast</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border rounded-lg mb-4" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border rounded-lg mb-4" required />
        <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800">Sign In</button>
      </form>
    </div>
  );
}
