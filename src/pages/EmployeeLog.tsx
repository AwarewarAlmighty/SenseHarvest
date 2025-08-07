import { useState, useEffect } from "react";
import axios from "axios";
import MainHeader from "../components/MainHeader";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface EmployeeLog {
  _id: string;
  employeeName: string;
  uid: string;
  status: 'entered' | 'exited';
  timestamp: string;
}

const ITEMS_PER_PAGE = 15;

export default function EmployeeLog() {
  const [logs, setLogs] = useState<EmployeeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "entered" | "exited">("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/employees/logs`);
        setLogs(response.data.sort((a: EmployeeLog, b: EmployeeLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs
    .filter(log => log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(log => filterStatus === 'all' || log.status === filterStatus);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));


  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Employee Logs</h2>
          <p className="text-muted-foreground">
            View access logs for all employees.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="px-3 py-2 text-sm rounded-lg border border-[#759b8c] bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-[#759b8c] bg-white dark:bg-[#1e1e1e] dark:text-white dark:border-[#759b8c] focus:outline-none focus:ring-2 focus:ring-[#759b8c] transition"
          >
            <option value="all">All Statuses</option>
            <option value="entered">Entered</option>
            <option value="exited">Exited</option>
          </select>
        </div>
        {isLoading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-[#1a1a1a]">
            <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
              <thead className="bg-[#759b8c] text-white">
                <tr>
                  <th className="p-3 font-semibold">Employee Name</th>
                  <th className="p-3 font-semibold">UID</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#ecfdf5] dark:hover:bg-[#222f22] transition">
                    <td className="p-3">{log.employeeName}</td>
                    <td className="p-3">{log.uid}</td>
                    <td className={`p-3 font-medium ${log.status === 'entered' ? 'text-green-600' : 'text-red-600'}`}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </td>
                    <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
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
    </div>
  );
}