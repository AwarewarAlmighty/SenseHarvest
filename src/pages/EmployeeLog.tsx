import React, { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "../components/MainHeader";

const apiUrl = import.meta.env.VITE_API_URL || '';

type Log = {
  uid: string;
  payload: {
    UID: string;
    status: string;
    timestamp: string;
    name: string;
  };
};

const ITEMS_PER_PAGE = 10;

const EmployeeLog = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    axios
      .get(`${apiUrl}/api/employees/logs`) 
      .then((res) => {
          if(Array.isArray(res.data)) {
            // Sort logs by timestamp in descending order
            const sortedLogs = res.data.sort((a, b) => 
                new Date(b.payload.timestamp).getTime() - new Date(a.payload.timestamp).getTime()
            );
            setLogs(sortedLogs);
          } else {
            setLogs([]);
            setError("Received invalid data from server.");
          }
        })
      .catch((err) => {
          console.error("Failed to load logs", err);
          setError("Failed to load logs. Please try again later.");
      });
  }, []);

  const filteredLogs = logs.filter((log) => {
    const name = log.payload.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Employee Entry & Exit Logs</h2>
          <p className="text-muted-foreground">
            View and manage employee entry and exit logs.
          </p>
        </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employee by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md px-4 py-2 border border-[#759b8c] rounded-lg shadow-sm bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-[#1a1a1a]">
        <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="bg-[#759b8c] text-white">
            <tr>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400 italic">
                  No matching logs found.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#ecfdf5] dark:hover:bg-[#222f22] transition">
                  <td className="p-3">
                    {log.payload.name || (
                      <span className="italic text-gray-400">Unnamed</span>
                    )}
                  </td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.payload.status === "accepted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {log.payload.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(log.payload.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default EmployeeLog;