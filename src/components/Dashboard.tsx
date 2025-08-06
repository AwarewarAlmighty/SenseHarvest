import React, { useEffect, useRef } from "react";
import { gsap } from "gsap"; // Import GSAP
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { ModeToggle } from "./theme-toggle";
import DataVisualization from "./DataVisualization";
import NotificationCenter from "./NotificationCenter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Menu, ArrowRight, Thermometer, Droplets, Wind, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { Badge } from "@/components/ui/badge";

// --- Card Components (no changes here) ---

const InventoryOverviewCard = () => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle className="text-lg">Inventory Overview</CardTitle>
      <CardDescription>A snapshot of your current inventory.</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Fertilizers</span>
          <span className="font-semibold">5 types</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Seeds</span>
          <span className="font-semibold">12 varieties</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Equipment</span>
          <span className="font-semibold">8 units</span>
        </div>
      </div>
      <Button variant="outline" className="mt-4 w-full" asChild>
        <Link to="/inventory">
          View Full Inventory <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const EmployeeLogCard = () => (
    <Card className="flex flex-col h-full">
        <CardHeader>
            <CardTitle className="text-lg">Employee Log</CardTitle>
            <CardDescription>Recent warehouse access.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=employee1" />
                            <AvatarFallback>E1</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">John Doe</span>
                    </div>
                    <span className="text-xs text-muted-foreground">9:41 AM</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=employee2" />
                            <AvatarFallback>E2</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">Jane Smith</span>
                    </div>
                    <span className="text-xs text-muted-foreground">9:38 AM</span>
                </div>
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/EmployeesLogs">
                    View All Logs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
    </Card>
);

const InventoryInfoCard = () => {
  const liveSensors = useWebSocket("ws://localhost:1880/ws/SenseHarvest/Sensors");
    const sensors = liveSensors ?? [
        { name: 'Temperature', value: 24.5, unit: '°C', status: 'normal' },
        { name: 'Humidity', value: 68, unit: '%', status: 'warning' },
        { name: 'Soil Moisture', value: 42, unit: '%', status: 'normal' },
        { name: 'CO2 Level', value: 1250, unit: 'ppm', status: 'critical' },
  ];

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "normal": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "critical": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const sensorIcons: { [key: string]: React.ReactNode } = {
    'Temperature': <Thermometer className="h-5 w-5" />,
    'Humidity': <Droplets className="h-5 w-5" />,
    'Soil Moisture': <Mountain className="h-5 w-5" />,
    'CO2 Level': <Wind className="h-5 w-5" />,
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Environment Info</CardTitle>
        <CardDescription>Real-time environmental conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sensors.slice(0, 4).map((sensor: any) => (
            <div key={sensor.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                 <div className="text-muted-foreground">{sensorIcons[sensor.name] || <Thermometer className="h-5 w-5" />}</div>
                <span className="font-medium">{sensor.name}</span>
              </div>
              <Badge variant={sensor.status === 'critical' ? 'destructive' : 'secondary'} className={getStatusColorClass(sensor.status)}>
                {sensor.value}{sensor.unit}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const Dashboard = () => {
  const { user, logout } = useAuth();
  const unreadCount = 3; // Mock data

  // Ref for the main container of the cards to animate
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Target all direct children of the grid columns to animate them
        gsap.from(".dashboard-card > *", { 
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.3,
        });
    }, dashboardRef);

    // Cleanup function to revert animations
    return () => ctx.revert();
  }, []);


  return (
    <div className="min-h-screen bg-background">
       <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.freepik.com/512/17566/17566683.png"
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
            A high-level overview of your farm's operations.
          </p>
        </div>

        <div 
          ref={dashboardRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
            {/* Column 1 */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 dashboard-card">
                <InventoryOverviewCard />
                <EmployeeLogCard />
                <div className="sm:col-span-2">
                     <DataVisualization />
                </div>
            </div>

            {/* Column 2 */}
            <div className="lg:col-span-1 flex flex-col gap-6 dashboard-card">
                <InventoryInfoCard />
                <NotificationCenter />
            </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-8">
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