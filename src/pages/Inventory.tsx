import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import MainHeader from "../components/MainHeader";

interface InventoryItem {
  _id: string;
  item: string;
  place: string;
  amount: string;
}

const ITEMS_PER_PAGE = 10;
const apiUrl = import.meta.env.VITE_API_URL || '';

export default function Inventory() {
  const { user, logout } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPlace, setNewItemPlace] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editedPlace, setEditedPlace] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/inventory`);
        if (Array.isArray(response.data)) {
            setInventoryItems(response.data);
        } else {
            setInventoryItems([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const filteredItems = inventoryItems.filter((item) => {
    const itemName = item.item || "";
    return itemName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemPlace && newItemAmount) {
      const newItem = {
        item: newItemName,
        place: newItemPlace,
        amount: newItemAmount,
      };
      try {
        const response = await axios.post(`${apiUrl}/api/inventory`, newItem);
        setInventoryItems([...inventoryItems, response.data]);
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
      try {
        const response = await axios.put(`${apiUrl}/api/inventory/${editingItem._id}`, { place: editedPlace, amount: editedAmount });
        setInventoryItems(
          inventoryItems.map((item) =>
            item._id === editingItem._id ? response.data : item
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
        await axios.delete(`${apiUrl}/api/inventory/${id}`);
        setInventoryItems(inventoryItems.filter((item) => item._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your farm's inventory in real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory..."
            className="px-3 py-2 text-sm rounded-lg border border-[#759b8c] bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm rounded-lg bg-[#759b8c] text-white hover:bg-[#5c7a6e] transition disabled:opacity-50"
          >
            Add Inventory
          </button>
          <button
            className="px-4 py-2 text-sm rounded-lg bg-[#759b8c] text-white hover:bg-[#5c7a6e] transition disabled:opacity-50"
          >
            Export Data
          </button>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-[#1a1a1a]">
            <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
              <thead className="bg-[#759b8c] text-white">
                <tr>
                  <th className="p-3 font-semibold">Item</th>
                  <th className="p-3 font-semibold">Place</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400 italic">
                      No matching inventory items found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr key={item._id} className="hover:bg-[#ecfdf5] dark:hover:bg-[#222f22] transition">
                      <td className="p-3">{item.item}</td>
                      <td className="p-3">{item.place}</td>
                      <td className="p-3">{item.amount}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-3 py-1 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item._id)}
                          className="px-3 py-1 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm rounded-lg bg-[#759b8c] text-white hover:bg-[#5c7a6e] transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm rounded-lg bg-[#759b8c] text-white hover:bg-[#5c7a6e] transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-4">
              Add New Inventory Item
            </h2>
            <form onSubmit={handleAddItem}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#759b8c] rounded-lg shadow-sm bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={newItemPlace}
                  onChange={(e) => setNewItemPlace(e.target.value)}
                  className="w-full px-3 py-2 border border-[#759b8c] rounded-lg shadow-sm bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[#759b8c] rounded-lg shadow-sm bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-[#759b8c] text-white hover:bg-[#5c7a6e] transition"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-4">
              Edit Inventory: {editingItem.item}
            </h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={editedPlace}
                  onChange={(e) => setEditedPlace(e.target.value)}
                  className="w-full px-3 py-2 border border-[#759b8c] rounded-lg shadow-sm bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[#759b8c] rounded-lg shadow-sm bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-[#759b8c] text-white hover:bg-[#5c7a6e] transition"
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