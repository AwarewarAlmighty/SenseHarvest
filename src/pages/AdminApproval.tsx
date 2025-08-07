import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainHeader from '../components/MainHeader';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
}

const AdminApprovalPage = () => {
  const { token } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/pending-users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setPendingUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, [token]);

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      const action = approve ? 'approve' : 'reject';
      const response = await fetch(`${apiUrl}/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Failed to ${action} user`);
      fetchPendingUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container py-6">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Admin Approval</h2>
        <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-[#1a1a1a]">
          <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
            <thead className="bg-[#759b8c] text-white">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length > 0 ? pendingUsers.map(user => (
                <tr key={user._id} className="hover:bg-[#ecfdf5] dark:hover:bg-[#222f22]">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleApproval(user._id, true)} className="px-3 py-1 text-xs rounded-md bg-green-500 text-white hover:bg-green-600">Approve</button>
                    <button onClick={() => handleApproval(user._id, false)} className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600">Reject</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">No pending approvals.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminApprovalPage;