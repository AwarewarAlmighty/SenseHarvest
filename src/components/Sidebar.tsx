import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Monitor, Home, User, Settings, Users, UserCheck, Bot, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import AIChatbot from "./AIChatbot"; // Import the AIChatbot
import { GoogleGenerativeAI, SystemInstruction } from "@google/generative-ai";


const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  const handleSendMessage = async (
    message: string,
    mode: "chatbot" | "analysis"
  ): Promise<string> => {
    let systemInstruction: SystemInstruction;

    if (mode === "chatbot") {
      systemInstruction = {
        role: "system",
        parts: [{ text: "You are Helpy, a friendly and helpful farming assistant. Keep your responses simple and to the point." }]
      };
    } else {
      systemInstruction = {
        role: "system",
        parts: [{ text: `
          Ely
          1. Core Identity
          You are Ely, the AI assistant for the SenseHarvest platform. Your fundamental purpose is to act as a reliable partner to farmers, helping them protect their harvest and improve their practices by making complex information simple and actionable.

          2. Your Persona
          Personality Traits: You are patient, encouraging, knowledgeable, and data-driven. You are a teacher at heart.

          3. Guiding Principles
          Empower the Farmer, Data-Driven, Human-Centric, and Proactive Helpfulness.

          4. Core Capabilities
          A. Agricultural Knowledge Chat: Answer questions about agriculture, post-harvest management, crop health, etc. If asked a non-agricultural question, politely decline and steer the conversation back.
          B. Sensor Data Analysis: When you see input starting with [DATA] or the /summarize command, provide a summary in the specified format, then ask to export as a PDF.
        `}]
      };
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction,
      });

      const result = await model.generateContent(message);
      return result.response.text();
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = mode === 'chatbot' 
        ? "Sorry, I'm having trouble connecting with Helpy right now."
        : "Sorry, I encountered an error while analyzing your request with Ely.";
      return errorMessage;
    }
  };


  return (
    <div
      className="hidden md:flex md:flex-col h-screen flex-shrink-0 bg-background border-r transition-all duration-500 ease-in-out relative"
      style={{ width: isOpen ? '200px' : '60px' }}
    >
      <div className="flex items-center justify-center h-16 px-2 border-b">
        <img
          src="https://cdn-icons-png.freepik.com/512/17566/17566683.png"
          alt="SenseHarvest Logo"
          className="h-8 w-8 rounded-md"
        />
         {isOpen && <h1 className="text-xl font-bold ml-2 whitespace-nowrap">SenseHarvest</h1>}
      </div>

      {/* AI Chatbot Trigger */}
      <div className="px-2 my-4">
         <AIChatbot 
            onSendMessage={handleSendMessage}
            trigger={
                <Button variant="outline" className={cn("w-full justify-start", isOpen ? "px-4" : "px-2")}>
                    <Bot className={cn("h-4 w-4", isOpen && "mr-2")} />
                    {isOpen && <span className="whitespace-nowrap">Ask AI</span>}
                </Button>
            }
         />
      </div>

      {/* Main Navigation Links */}
      <nav className="px-2 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <Monitor className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <Home className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Inventory</span>}
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                "w-full justify-start",
                isOpen ? "px-4" : "px-2"
              )
            }
          >
            <Users className={cn("h-4 w-4", isOpen && "mr-2")} />
            {isOpen && <span className="whitespace-nowrap">Employees</span>}
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink
            to="/admin-approval"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                "w-full justify-start",
                isOpen ? "px-4" : "px-2"
              )
            }
          >
            <UserCheck className={cn("h-4 w-4", isOpen && "mr-2")} />
            {isOpen && <span className="whitespace-nowrap">Approval</span>}
          </NavLink>
        )}
        <NavLink
          to="/EmployeesLogs"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-id-card-lanyard-icon lucide-id-card-lanyard mr-2 h-4 w-4"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/>
        </svg>
          {isOpen && <span className="whitespace-nowrap">Logs</span>}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <User className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Profile</span>}
        </NavLink>
{/*         <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
              "w-full justify-start",
              isOpen ? "px-4" : "px-2"
            )
          }
        >
          <Settings className={cn("h-4 w-4", isOpen && "mr-2")} />
          {isOpen && <span className="whitespace-nowrap">Settings</span>}
        </NavLink> */}
      </nav>

      {/* Sidebar Toggle */}
      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
