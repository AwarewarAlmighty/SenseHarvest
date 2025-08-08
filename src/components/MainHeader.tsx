import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  Bell,
  Settings,
  LogOut,
  Sun,
  Cloud,
  Zap,
  CloudFog,
  CloudRain,
  Snowflake,
  Wind,
  MapPin,
  Menu,
  Monitor,
  Home,
  Users,
  UserCheck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// --- Weather Component with Live, User-configurable Data ---
const WeatherHeader = () => {
  const [location, setLocation] = useState<{ name: string; latitude: number; longitude: number; } | null>(null);
  const [weather, setWeather] = useState<{ temperature: number; weatherCode: number; windSpeed: number; } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");

  // Load saved location from localStorage on initial render
  useEffect(() => {
    const savedLocation = localStorage.getItem("weatherLocation");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else {
      // Default to Bekasi if no location is saved
      setLocation({ name: "Bekasi", latitude: -6.2383, longitude: 106.9756 });
    }
  }, []);

  // Fetch weather data whenever the location changes
  useEffect(() => {
    if (!location) return;

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m`;

    const fetchWeather = async () => {
      setError(null);
      setWeather(null); // Reset weather data on new fetch
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch weather data.");
        
        const data = await response.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weathercode,
          windSpeed: Math.round(data.current.wind_speed_10m),
        });
      } catch (err) {
        setError("Could not load weather.");
        console.error(err);
      }
    };

    fetchWeather();
  }, [location]);

  const handleLocationChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput) return;

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationInput)}&count=1&language=en&format=json`;
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const newLocation = {
            name: data.results[0].name,
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
        };
        setLocation(newLocation);
        localStorage.setItem("weatherLocation", JSON.stringify(newLocation));
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      setError("Failed to find location.");
      console.error(err);
    }
  };


  const getWeatherInfo = (code: number): { icon: React.ReactNode; condition: string } => {
    switch (code) {
      case 0:
        return { icon: <Sun className="h-6 w-6 text-yellow-500" />, condition: "Clear Sky" };
      case 1:
      case 2:
      case 3:
        return { icon: <Cloud className="h-6 w-6 text-gray-400" />, condition: "Partly Cloudy" };
      case 45:
      case 48:
        return { icon: <CloudFog className="h-6 w-6 text-gray-400" />, condition: "Fog" };
      case 51:
      case 53:
      case 55:
        return { icon: <CloudRain className="h-6 w-6 text-blue-400" />, condition: "Drizzle" };
      case 61:
      case 63:
      case 65:
        return { icon: <CloudRain className="h-6 w-6 text-blue-500" />, condition: "Rain" };
      case 71:
      case 73:
      case 75:
      case 77:
          return { icon: <Snowflake className="h-6 w-6 text-blue-300" />, condition: "Snow" };
      case 95:
      case 96:
      case 99:
        return { icon: <Zap className="h-6 w-6 text-yellow-400" />, condition: "Thunderstorm" };
      default:
        return { icon: <Cloud className="h-6 w-6 text-gray-400" />, condition: "Cloudy" };
    }
  };

  return (
    <div className="flex items-center gap-4">
        {weather ? (
            <>
                <div className="flex items-center gap-2">
                    {getWeatherInfo(weather.weatherCode).icon}
                    <div>
                        <p className="font-semibold">{weather.temperature}°C</p>
                        <p className="text-xs text-muted-foreground">{getWeatherInfo(weather.weatherCode).condition}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-gray-400" />
                    <div>
                        <p className="font-semibold">{weather.windSpeed} km/h</p>
                        <p className="text-xs text-muted-foreground">Wind</p>
                    </div>
                </div>
            </>
        ) : (
             <div className="text-sm text-muted-foreground">{error || "Loading weather..."}</div>
        )}
        
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MapPin className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <form onSubmit={handleLocationChange} className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Change Location</h4>
                        <p className="text-sm text-muted-foreground">
                            Current: {location?.name || 'Not set'}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="location"
                            placeholder="Enter city name..."
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            className="col-span-2 h-8"
                        />
                         <Button type="submit">Set Location</Button>
                    </div>
                </form>
            </PopoverContent>
      </Popover>
    </div>
  );
};

const MainHeader = () => {
    const { user, logout } = useAuth();
    const unreadCount = 3; // Mock data

    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                 {/* Mobile Navigation */}
                 <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] p-4">
                            <nav className="flex flex-col space-y-2">
                                <SheetClose asChild>
                                    <NavLink to="/" className={({ isActive }) => cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }), "w-full justify-start")}>
                                        <Monitor className="mr-2 h-4 w-4" /> Dashboard
                                    </NavLink>
                                </SheetClose>
                                <SheetClose asChild>
                                    <NavLink to="/inventory" className={({ isActive }) => cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }), "w-full justify-start")}>
                                        <Home className="mr-2 h-4 w-4" /> Inventory
                                    </NavLink>
                                </SheetClose>
                                {user?.role === "admin" && (
                                    <>
                                        <SheetClose asChild>
                                            <NavLink to="/employees" className={({ isActive }) => cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }), "w-full justify-start")}>
                                                <Users className="mr-2 h-4 w-4" /> Employees
                                            </NavLink>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <NavLink to="/admin-approval" className={({ isActive }) => cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }), "w-full justify-start")}>
                                                <UserCheck className="mr-2 h-4 w-4" /> Approval
                                            </NavLink>
                                        </SheetClose>
                                    </>
                                )}
                                <SheetClose asChild>
                                    <NavLink to="/EmployeesLogs" className={({ isActive }) => cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }), "w-full justify-start")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-id-card-lanyard-icon lucide-id-card-lanyard mr-2 h-4 w-4"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/>
                                        </svg> Logs
                                    </NavLink>
                                </SheetClose>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden md:flex">
                  <WeatherHeader />
                </div>
            <div className="flex items-center gap-4">
                <ModeToggle />

                <Link to="/#notifications">
                  <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                  </Button>
                </Link>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link to="/settings">
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </Link>
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
{/*                     <Link to="/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link to="/settings">
                      <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    </Link> */}
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
