// Inventory.jsx (or Inventory.tsx)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../components/theme-toggle";
import { Bell, Settings, LogOut, Menu, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

// Define the type for an inventory item
interface InventoryItem {
  _id: string;
  item: string;
  place: string;
  amount: string;
}

// Define the props for the DefaultTable component
interface DefaultTableProps {
  tableRows: InventoryItem[];
  onEditClick: (rowData: InventoryItem) => void;
  onDeleteClick: (id: string) => void;
}

// A functional component for the table
const DefaultTable: React.FC<DefaultTableProps> = ({
  tableRows,
  onEditClick,
  onDeleteClick,
}) => {
  const TABLE_HEAD = ["Item", "Place", "Amount", ""];

  return (
    <div className="p-4 bg-card shadow-md rounded-lg overflow-x-auto mt-4">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr className="bg-gray-50">
            {TABLE_HEAD.map((head, index) => (
              <th key={index} className="p-4 border-b border-gray-200">
                <p className="font-semibold text-sm text-muted-foreground leading-none opacity-70">
                  {head}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((rowData: InventoryItem, index: number) => {
            const isLast = index === tableRows.length - 1;
            const classes = `p-4 ${isLast ? "" : "border-b border-gray-200"}`;

            return (
              <tr key={rowData._id}>
                <td className={classes}>
                  <p className="font-normal text-sm text-foreground">
                    {rowData.item}
                  </p>
                </td>
                <td className={classes}>
                  <p className="font-normal text-sm text-foreground">
                    {rowData.place}
                  </p>
                </td>
                <td className={classes}>
                  <p className="font-normal text-sm text-foreground">
                    {rowData.amount}
                  </p>
                </td>
                <td className={`${classes} flex gap-2`}>
                  <button
                    onClick={() => onEditClick(rowData)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.652.885a.75.75 0 01-.9-1.091l.885-2.652a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteClick(rowData._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Template notifications
const initialNotifications = [
  {
    id: "1",
    title: "Temperature Alert",
    description: "Greenhouse temperature exceeds threshold (32°C)",
    timestamp: "10 minutes ago",
    severity: "critical",
    read: false,
    action: "Activate cooling system",
  },
  {
    id: "2",
    title: "Humidity Warning",
    description: "Humidity levels below optimal range (30%)",
    timestamp: "1 hour ago",
    severity: "warning",
    read: false,
    action: "Check irrigation system",
  },
  {
    id: "3",
    title: "Soil Moisture Update",
    description: "Soil moisture levels have returned to normal",
    timestamp: "3 hours ago",
    severity: "info",
    read: true,
  },
  {
    id: "4",
    title: "Gas Level Alert",
    description: "CO2 levels above normal in storage area",
    timestamp: "5 hours ago",
    severity: "warning",
    read: false,
    action: "Increase ventilation",
  },
  {
    id: "5",
    title: "System Update",
    description: "Sensor firmware updated successfully",
    timestamp: "1 day ago",
    severity: "info",
    read: true,
  },
];

export default function Inventory() {
  const { user, logout } = useAuth();
  const [notifications] = useState(initialNotifications);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPlace, setNewItemPlace] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  // New state for handling the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editedPlace, setEditedPlace] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("/api/inventory");
        if (!response.ok) {
          throw new Error("Failed to fetch inventory items");
        }
        const data = await response.json();
        setInventoryItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemPlace && newItemAmount) {
      const newItem = {
        item: newItemName,
        place: newItemPlace,
        amount: newItemAmount,
      };
      try {
        const response = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        });
        if (!response.ok) {
          throw new Error("Failed to add item");
        }
        const savedItem = await response.json();
        setInventoryItems([...inventoryItems, savedItem]);
        setNewItemName("");
        setNewItemPlace("");
        setNewItemAmount("");
        setIsAddModalOpen(false);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleEditClick = (rowData: InventoryItem) => {
    setEditingItem(rowData);
    setEditedPlace(rowData.place);
    setEditedAmount(rowData.amount);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editedPlace && editedAmount) {
      const updatedItem = {
        ...editingItem,
        place: editedPlace,
        amount: editedAmount,
      };
      try {
        const response = await fetch(`/api/inventory/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ place: editedPlace, amount: editedAmount }),
        });
        if (!response.ok) {
          throw new Error("Failed to update item");
        }
        const result = await response.json();
        setInventoryItems(
          inventoryItems.map((item) =>
            item._id === editingItem._id ? result : item
          )
        );
        setIsEditModalOpen(false);
        setEditingItem(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/inventory/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        setInventoryItems(inventoryItems.filter((item) => item._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80"
                alt="SenseHarvest Logo"
                className="h-8 w-8 rounded-md"
              />
              <h1 className="text-xl font-bold">SenseHarvest</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {unreadCount} unread notifications
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                      alt={user?.email}
                    />
                    <AvatarFallback>
                      {user?.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your farm's inventory in real-time.
          </p>
        </div>
        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
            Add Inventory
          </Button>
          <Button variant="outline">Export Data</Button>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DefaultTable
            tableRows={inventoryItems}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </main>

      {/* Add Inventory Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Add New Inventory Item
              </h2>
            <form onSubmit={handleAddItem}>
              <div className="mb-4">
                <label className="block text-muted-foreground text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-muted-foreground text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={newItemPlace}
                  onChange={(e) => setNewItemPlace(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-muted-foreground text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Item
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Edit Inventory Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Edit Inventory: {editingItem.item}
            </h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-muted-foreground text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={editedPlace}
                  onChange={(e) => setEditedPlace(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-muted-foreground text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
