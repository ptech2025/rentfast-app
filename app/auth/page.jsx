'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignup ? { email, password, name } : { email, password };
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex flex-col">
      <header className="border-b border-green-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-3xl font-bold text-[#2d6a4f]">🏠 RentFast</div>
          <p className="text-sm text-green-600">Fast rent collection. Zero delays.</p>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isSignup ? 'Start collecting rent faster' : 'Access your properties and payments'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition" />
              </div>
              {error && <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-[#2d6a4f] hover:bg-green-800 text-white font-medium rounded-lg transition disabled:bg-gray-400 mt-6">
                {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            <div className="mt-6 text-center border-t border-green-100 pt-6">
              <p className="text-gray-600 text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsSignup(!isSignup)} className="text-[#2d6a4f] font-medium hover:text-green-800 transition">
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm mb-6">
              ✓ 1-3 day payment settlement<br />
              ✓ No subscription fees<br />
              ✓ Transparent pricing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
