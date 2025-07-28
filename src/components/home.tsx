import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SensorStatusGrid from "./SensorStatusGrid";
import DataVisualization from "./DataVisualization";
import NotificationCenter from "./NotificationCenter";
import AIChatbot from "./AIChatbot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const Home = () => {
  const { logout, user } = useAuth(); // Get logout and the user object from context

  // Use the user data from context, or fallback to a default if not available
  // 'user' from useAuth() will contain the decoded JWT payload (userId, username, email, etc.)
  const displayUser = user || {
    username: "Guest", // Fallback username
    email: "guest@example.com", // Fallback email
    // You can generate a dynamic avatar URL based on the username/email
    // This URL will be used if 'user' from context is null (e.g., if somehow not authenticated)
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
  };

  // Function to get initials for AvatarFallback
  const getInitials = (name: string) => {
    // Ensure name is a string before splitting
    if (typeof name !== "string" || name.trim() === "") {
      return "??"; // Default for empty or invalid names
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You have 3 unread notifications
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
                    {/* Use dynamic avatar based on displayUser.username */}
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUser.username}`}
                      alt={displayUser.username}
                    />
                    {/* Fallback to initials */}
                    <AvatarFallback>
                      {getInitials(displayUser.username)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Display dynamic username */}
                  <span className="hidden md:inline">
                    {displayUser.username}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={logout}>
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

        {/* Sensor Status Grid */}
        <div className="mb-8">
          <SensorStatusGrid />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Data Visualization - Takes 2/3 of the screen on large devices */}
          <div className="lg:col-span-2">
            <DataVisualization />
          </div>

          {/* Right Sidebar - Takes 1/3 of the screen on large devices */}
          <div className="space-y-6">
            {/* Notification Center */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <NotificationCenter />
              </CardContent>
            </Card>

            {/* AI Chatbot */}
            <div className="flex justify-center">
              <AIChatbot />
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
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
