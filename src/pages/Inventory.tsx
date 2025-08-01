// Inventory.jsx (or Inventory.tsx)
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../components/theme-toggle";
import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

// Define the type for an inventory item
interface InventoryItem {
  id: string;
  name: string;
  place: string;
  amount: string;
}

// Define the props for the DefaultTable component
interface DefaultTableProps {
  tableRows: InventoryItem[];
  onEditClick: (rowData: InventoryItem) => void;
}

// A functional component for the table
const DefaultTable: React.FC<DefaultTableProps> = ({
  tableRows,
  onEditClick,
}) => {
  const TABLE_HEAD = ["Name", "Place", "Amount", ""];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg overflow-x-auto mt-4">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr className="bg-gray-50">
            {TABLE_HEAD.map((head, index) => (
              <th key={index} className="p-4 border-b border-gray-200">
                <p className="font-semibold text-sm text-gray-700 leading-none opacity-70">
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
              <tr key={rowData.id}>
                <td className={classes}>
                  <p className="font-normal text-sm text-gray-800">
                    {rowData.name}
                  </p>
                </td>
                <td className={classes}>
                  <p className="font-normal text-sm text-gray-800">
                    {rowData.place}
                  </p>
                </td>
                <td className={classes}>
                  <p className="font-normal text-sm text-gray-800">
                    {rowData.amount}
                  </p>
                </td>
                <td className={classes}>
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Sample Data
const initialInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Hydroponics Unit 1",
    place: "Greenhouse A",
    amount: "150 plants",
  },
  {
    id: "2",
    name: "Soil Moisture Sensor",
    place: "Field B",
    amount: "N/A",
  },
  {
    id: "3",
    name: "IoT Weather Station",
    place: "Farm Entrance",
    amount: "N/A",
  },
  {
    id: "4",
    name: "Water Pump System",
    place: "Reservoir C",
    amount: "1 unit",
  },
  {
    id: "5",
    name: "Automated Sprinkler",
    place: "Field D",
    amount: "1 system",
  },
];

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
  const [inventoryItems, setInventoryItems] =
    useState<InventoryItem[]>(initialInventory);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPlace, setNewItemPlace] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  // New state for handling the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editedPlace, setEditedPlace] = useState("");
  const [editedAmount, setEditedAmount] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemPlace && newItemAmount) {
      const newItem = {
        id: Date.now().toString(), // Simple unique ID generation
        name: newItemName,
        place: newItemPlace,
        amount: newItemAmount,
      };
      setInventoryItems([...inventoryItems, newItem]);
      setNewItemName("");
      setNewItemPlace("");
      setNewItemAmount("");
      setIsAddModalOpen(false);
    }
  };

  /**
   * Handles the click on the edit button in the table.
   * Sets the state for the item being edited and opens the modal.
   * @param {InventoryItem} rowData The data of the row to be edited.
   */
  const handleEditClick = (rowData: InventoryItem) => {
    setEditingItem(rowData);
    setEditedPlace(rowData.place);
    setEditedAmount(rowData.amount);
    setIsEditModalOpen(true);
  };

  /**
   * Saves the changes from the edit modal.
   * Updates the inventoryItems state with the new values.
   * @param {React.FormEvent} e The form submission event.
   */
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editedPlace && editedAmount) {
      const updatedItems = inventoryItems.map((item) =>
        item.id === editingItem.id
          ? { ...item, place: editedPlace, amount: editedAmount }
          : item
      );
      setInventoryItems(updatedItems);
      setIsEditModalOpen(false);
      setEditingItem(null);
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
        <DefaultTable
          tableRows={inventoryItems}
          onEditClick={handleEditClick}
        />
      </main>

      {/* Add Inventory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Add New Inventory Item
            </h2>
            <form onSubmit={handleAddItem}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={newItemPlace}
                  onChange={(e) => setNewItemPlace(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
          </div>
        </div>
      )}

      {/* Edit Inventory Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Edit Inventory: {editingItem.name}
            </h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={editedPlace}
                  onChange={(e) => setEditedPlace(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
