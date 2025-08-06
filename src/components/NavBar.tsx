import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./theme-toggle";
import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

const NavBar = () => {
  const { user, logout } = useAuth();
  const [notifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
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
  );
};

export default NavBar;
