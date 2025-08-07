import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainHeader from '../components/MainHeader';

const apiUrl = import.meta.env.VITE_API_URL || '';

interface Employee {
  _id: string;
  uid: string;
  name: string;
  role: string;
}

type Log = {
  uid: string;
  payload: {
    UID: string;
    status: string;
    timestamp: string;
    name: string;
  };
};

const Employees = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            setEmployees(data);
        } else {
            setEmployees([]);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/logs`, { // CORRECTED: The endpoint is /api/logs
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();
        if(Array.isArray(data)) {
            setLogs(data);
        } else {
            setLogs([]);
        }
      } catch (err: any) {
        console.error("Failed to load logs for employee status", err);
        // We don't set a visible error here, as status may just appear "unknown"
      }
    };

    if (token) {
      fetchEmployees();
      fetchLogs();
    }
  }, [token]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, name, role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      setUid('');
      setName('');
      setRole('employee');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${apiUrl}/api/employees/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const getEmployeeStatus = (uid: string) => {
    const employeeLogs = logs.filter((log) => log.payload.UID === uid);
    if (employeeLogs.length === 0) {
      return { status: 'unknown', timestamp: null };
    }
    const latestLog = employeeLogs.reduce((latest, current) => {
      return new Date(current.payload.timestamp) > new Date(latest.payload.timestamp) ? current : latest;
    });
    return { status: latestLog.payload.status, timestamp: latestLog.payload.timestamp };
  };

  return (
    <div className="min-h-screen bg-background">
        <MainHeader />
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Manage Employees</h1>
            {error && <p className="text-red-500">{error}</p>}
            <Card className="mb-4">
                <CardHeader>
                <CardTitle>Add New Employee</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleAddEmployee}>
                    <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="uid">UID</Label>
                        <Input
                        id="uid"
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border rounded"
                        >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        </select>
                    </div>
                    <Button type="submit">Add Employee</Button>
                    </div>
                </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Employee List</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead>
                      <tr>
                          <th className="text-left text-foreground p-2">UID</th>
                          <th className="text-left text-foreground p-2">Name</th>
                          <th className="text-left text-foreground p-2">Role</th>
                          <th className="text-left text-foreground p-2">Status</th>
                          <th className="text-right p-2"></th>
                      </tr>
                      </thead>
                      <tbody>
                      {employees.map((emp) => {
                          const { status } = getEmployeeStatus(emp.uid);
                          return (
                          <tr key={emp._id}>
                              <td className="text-foreground p-2">{emp.uid}</td>
                              <td className="text-foreground p-2">{emp.name}</td>
                              <td className="text-foreground p-2">{emp.role}</td>
                              <td className="text-foreground p-2">
                              <div className="flex items-center">
                                  <span
                                  className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                      status === 'accepted' ? 'bg-green-500' : status === 'unknown' ? 'bg-gray-400' : 'bg-red-500'
                                  }`}
                                  ></span>
                                  {status}
                              </div>
                              </td>
                              <td className="text-right p-2">
                              <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteEmployee(emp._id)}
                              >
                                  Delete
                              </Button>
                              </td>
                          </tr>
                          );
                      })}
                      </tbody>
                  </table>
                </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
};

export default Employees;