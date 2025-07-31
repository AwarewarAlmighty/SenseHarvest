import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { ModeToggle } from "./theme-toggle";
import SensorStatusGrid from "./SensorStatusGrid";
import DataVisualization from "./DataVisualization";
import NotificationCenter from "./NotificationCenter";
import AIChatbot from "./AIChatbot";
import { GoogleGenerativeAI, SystemInstruction } from "@google/generative-ai";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleTakeAction = (id: string, action: string) => {
    console.log(`Action taken for notification ${id}: ${action}`);
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
        parts: [{ text: "You are Helpy, a friendly and helpful farming assistant. Keep your responses simple and to the point." }],
      };
    } else {
      systemInstruction = {
        role: "system",
        parts: [{
          text: `
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
        ` }]
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
      return mode === 'chatbot'
        ? "Sorry, I'm having trouble connecting with Helpy right now."
        : "Sorry, I encountered an error while analyzing your request with Ely.";
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
                <Button variant="ghost" className="flex items-center gap-2" size="sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt={user?.email} />
                    <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your farm's environmental conditions in real-time.
          </p>
        </div>

        <div className="mb-8">
          <SensorStatusGrid />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DataVisualization />
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <NotificationCenter
                  notifications={notifications}
                  onClearAll={handleClearAll}
                  onMarkAsRead={handleMarkAsRead}
                  onTakeAction={handleTakeAction}
                />
              </CardContent>
            </Card>
            <div className="flex justify-center">
              <AIChatbot onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SenseHarvest. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
