'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface Property { id: string; address: string; unit?: string; }
interface Summary { totalDue: number; totalReceived: number; recentPayments: any[]; }
export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({ address: '', unit: '' });
  const router = useRouter();
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth'); return; }
      const [propsRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProperties(propsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      localStorage.removeItem('token');
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/properties`, newProperty, { headers: { Authorization: `Bearer ${token}` } });
      setNewProperty({ address: '', unit: '' });
      setShowAddProperty(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add property', error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      <header className="bg-white border-b border-green-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#2d6a4f]">🏠 RentFast</div>
          <button onClick={handleLogout} className="px-4 py-2 text-[#2d6a4f] hover:bg-green-100 rounded-lg transition">Logout</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Manage your properties and track rent collections</p>
        </div>
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card">
              <div className="text-sm font-medium text-gray-600 mb-2">Rent Due This Month</div>
              <div className="text-3xl font-bold text-[#2d6a4f]">${summary.totalDue.toFixed(2)}</div>
            </div>
            <div className="card">
              <div className="text-sm font-medium text-gray-600 mb-2">Payments Settled</div>
              <div className="text-3xl font-bold text-green-600">${summary.totalReceived.toFixed(2)}</div>
            </div>
            <div className="card">
              <div className="text-sm font-medium text-gray-600 mb-2">Pending Payments</div>
              <div className="text-3xl font-bold text-yellow-600">${(summary.totalDue - summary.totalReceived).toFixed(2)}</div>
            </div>
          </div>
        )}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
            <button onClick={() => setShowAddProperty(!showAddProperty)} className="btn-primary">+ Add Property</button>
          </div>
          {showAddProperty && (
            <div className="card mb-6">
              <form onSubmit={handleAddProperty} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" value={newProperty.address} onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })} placeholder="123 Main St" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit (Optional)</label>
                  <input type="text" value={newProperty.unit} onChange={(e) => setNewProperty({ ...newProperty, unit: e.target.value })} placeholder="Unit 2A" className="input" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">Save Property</button>
                  <button type="button" onClick={() => setShowAddProperty(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}
          {properties.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No properties yet</p>
              <button onClick={() => setShowAddProperty(true)} className="btn-primary">Add Your First Property</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <div className="card cursor-pointer hover:shadow-xl transition">
                    <div className="text-lg font-bold text-gray-900 mb-2">{property.address}</div>
                    {property.unit && <div className="text-sm text-gray-600 mb-4">Unit {property.unit}</div>}
                    <div className="text-[#2d6a4f] font-medium hover:underline">View Details →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
