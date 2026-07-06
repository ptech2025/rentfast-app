'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', email: '', phone: '', monthly_rent: '' });
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id;
  useEffect(() => { fetchTenants(); }, [propertyId]);
  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/properties/${propertyId}/tenants`, { headers: { Authorization: `Bearer ${token}` } });
      setTenants(res.data);
      setProperty({ id: propertyId, address: 'Property ' + propertyId });
    } catch (error) {
      console.error('Failed to fetch tenants', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };
  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/properties/${propertyId}/tenants`, { ...newTenant, monthly_rent: parseFloat(newTenant.monthly_rent) }, { headers: { Authorization: `Bearer ${token}` } });
      setNewTenant({ name: '', email: '', phone: '', monthly_rent: '' });
      setShowAddTenant(false);
      fetchTenants();
    } catch (error) {
      console.error('Failed to add tenant', error);
    }
  };
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-[#2d6a4f] hover:underline mb-4 inline-block">← Back to Properties</Link>
          <h1 className="text-3xl font-bold text-gray-900">Property Tenants</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Tenants</h2>
          <button onClick={() => setShowAddTenant(!showAddTenant)} className="btn-primary">+ Add Tenant</button>
        </div>
        {showAddTenant && (
          <div className="card mb-8">
            <form onSubmit={handleAddTenant} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" value={newTenant.name} onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })} required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={newTenant.email} onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })} required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" value={newTenant.phone} onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
                  <input type="number" value={newTenant.monthly_rent} onChange={(e) => setNewTenant({ ...newTenant, monthly_rent: e.target.value })} required className="input" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Save Tenant</button>
                <button type="button" onClick={() => setShowAddTenant(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}
        {tenants.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No tenants yet</p>
            <button onClick={() => setShowAddTenant(true)} className="btn-primary">Add Your First Tenant</button>
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tenant.name}</div>
                    <div className="text-gray-600">{tenant.email}</div>
                    <div className="text-[#2d6a4f] font-medium mt-2">Monthly Rent: ${tenant.monthly_rent.toFixed(2)}</div>
                  </div>
                  <Link href={`/pay/${tenant.id}`}><button className="btn-primary">Request Payment</button></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
