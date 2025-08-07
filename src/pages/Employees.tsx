import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainHeader from '../components/MainHeader';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Employee {
  _id: string;
  uid: string;
  name: string;
  department: string;
}

interface Log {
  _id: string;
  employeeName: string;
  timestamp: string;
  status: string;
}

const EmployeesPage = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [employeesResponse, logsResponse] = await Promise.all([
          fetch(`${apiUrl}/api/employees`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/api/employees/logs`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!employeesResponse.ok || !logsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const employeesData = await employeesResponse.json();
        const logsData = await logsResponse.json();

        setEmployees(employeesData);
        setLogs(logsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddEmployee = async (name: string, uid: string, department: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, uid, department })
      });
      if (!response.ok) throw new Error('Failed to add employee');
      const newEmployee = await response.json();
      setEmployees(prev => [...prev, newEmployee]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete employee');
      setEmployees(prev => prev.filter(e => e._id !== id));
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
        <h2 className="text-3xl font-bold tracking-tight mb-6">Employees Management</h2>
        {/* Further UI elements would go here, using the state variables */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-xl mb-3">Employee List</h3>
            <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-[#1a1a1a]">
              <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
                <thead className="bg-[#759b8c] text-white">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">UID</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id} className="hover:bg-[#ecfdf5] dark:hover:bg-[#222f22]">
                      <td className="p-3">{emp.name}</td>
                      <td className="p-3">{emp.department}</td>
                      <td className="p-3">{emp.uid}</td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteEmployee(emp._id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-3">Recent Logs</h3>
            <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-[#1a1a1a]">
              <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
                <thead className="bg-[#759b8c] text-white">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 10).map(log => (
                    <tr key={log._id} className="hover:bg-[#ecfdf5] dark:hover:bg-[#222f22]">
                      <td className="p-3">{log.employeeName}</td>
                      <td className="p-3">{log.status}</td>
                      <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeesPage;