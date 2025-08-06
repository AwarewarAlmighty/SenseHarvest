import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Sun, Cloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Compact Weather Component for Header ---
const WeatherHeader = () => {
  const [weather, setWeather] = useState<{
    location: string;
    temperature: number;
    condition: string;
  } | null>(null);

  useEffect(() => {
    // Mock API call to fetch weather data for Bekasi.
    const fetchWeather = () => {
      const mockWeatherData = {
        location: "Bekasi, ID",
        temperature: 31,
        condition: "Partly Cloudy",
      };
      setWeather(mockWeatherData);
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "Partly Cloudy":
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case "Rain":
        return <Zap className="h-6 w-6 text-blue-500" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />;
    }
  };

  if (!weather) {
    return <div className="text-sm text-muted-foreground">Loading weather...</div>;
  }

  return (
    <div className="flex items-center gap-3">
      {getWeatherIcon(weather.condition)}
      <div>
        <p className="font-semibold">{weather.temperature}°C</p>
        <p className="text-xs text-muted-foreground">{weather.condition}</p>
      </div>
    </div>
  );
};

const MainHeader = () => {
    const { user, logout } = useAuth();
    const unreadCount = 3; // Mock data

    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
            <WeatherHeader />
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
    )
}

export default MainHeader;