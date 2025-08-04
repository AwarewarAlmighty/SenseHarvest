import React, { useEffect, useState } from "react";
import axios from "axios";

type Log = {
  uid: string;
  payload: {
    UID: string;
    status: string;
    timestamp: string;
    name: string;
  };
};

const EmployeeLog = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/employees/logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error("Failed to load logs", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Employee Entry/Exit Log</h1>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className={log.payload.status === "accepted" ? "bg-green-100" : "bg-red-100"}>
              <td className="p-2">{log.payload.name || "Undefined User"}</td>
              <td className="p-2 capitalize">{log.payload.status}</td>
              <td className="p-2">
                {new Date(log.payload.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeLog;
