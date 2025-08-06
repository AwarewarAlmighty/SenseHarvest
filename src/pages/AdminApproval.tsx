import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface PendingUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminApproval: React.FC = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("/api/admin/pending-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch pending users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchPendingUsers();
    }
  }, [token]);

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to approve user");
      }
      // Refresh the list after approval
      fetchPendingUsers();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to reject user");
      }
      // Refresh the list after rejection
      fetchPendingUsers();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Approval</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Requested Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleApprove(user._id)}
                  className="mr-2"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(user._id)}
                  variant="destructive"
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminApproval;
