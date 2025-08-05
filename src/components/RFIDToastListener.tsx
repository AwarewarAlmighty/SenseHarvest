import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import axios from "axios";

const RFIDToastListener: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [registerUID, setRegisterUID] = useState<string>("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");


  useEffect(() => {
    const socket = new WebSocket("ws://52.65.165.101:1880/ws/SenseHarvest/RFID");
    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "accepted") {
          toast.success(` ${data.name} (${data.department}) entered the warehouse`);
        } else if (data.status === "denied") {
          toast.warn("Unregistered user detected!");
          setRegisterUID(data.UID);
          setShowModal(true);
        }
      } catch (error) {
        console.error("WebSocket error:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/api/employees", {
        uid: registerUID,
        name,
        department: department || "Default", 
      });
      toast.success("User registered successfully!");
      setShowModal(false);
      setName("");
      setDepartment("");
    } catch (err) {
      toast.error("Failed to register user");
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="p-6 flex flex-col bg-card rounded shadow-lg max-w-md mx-auto mt-32 gap-2"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-lg font-bold mb-4">Register Unrecognized UID</h2>
      <p className="mb-2">UID: <strong>{registerUID}</strong></p>
      <input
        type="text"
        placeholder="Enter Name"
        className="border p-2 mb-4 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Department"
        className="border p-2 mb-4 w-full"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>
      <button
        onClick={() => setShowModal(false)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        No
      </button>
    </Modal>
  );
};

export default RFIDToastListener;
