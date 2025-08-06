import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DataVisualization from "./DataVisualization";
import NotificationCenter from "./NotificationCenter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Thermometer, Droplets, Wind, Mountain, Sun, Cloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { Badge } from "@/components/ui/badge";
import MainHeader from "./MainHeader";
import axios from 'axios';

// --- Card Components ---

interface InventoryItem {
  _id: string;
  item: string;
  place: string;
  amount: number;
}

const InventoryOverviewCard = () => {
    const [stats, setStats] = useState<{ uniqueItems: number; totalQuantity: number; locations: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInventoryStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/inventory');
                const items: InventoryItem[] = response.data;

                if (items.length > 0) {
                    const totalQuantity = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
                    const uniqueLocations = new Set(items.map(item => item.place)).size;

                    setStats({
                        uniqueItems: items.length,
                        totalQuantity,
                        locations: uniqueLocations,
                    });
                } else {
                     setStats({ uniqueItems: 0, totalQuantity: 0, locations: 0 });
                }
            } catch (err) {
                setError('Failed to fetch inventory stats.');
                console.error(err);
            }
        };

        fetchInventoryStats();
    }, []);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-lg">Inventory Overview</CardTitle>
                <CardDescription>A snapshot of your current inventory.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {stats ? (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Total Unique Items</span>
                                <span className="font-semibold">{stats.uniqueItems}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Total Stored Quantity</span>
                                <span className="font-semibold">{stats.totalQuantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Number of Locations</span>
                                <span className="font-semibold">{stats.locations}</span>
                            </div>
                        </>
                    ) : (
                        !error && <p className="text-sm text-muted-foreground">Loading stats...</p>
                    )}
                </div>
                <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link to="/inventory">
                        View Full Inventory <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};


type Log = {
  _id: string;
  payload: {
    name: string;
    status: string;
    timestamp: string;
  }
};

const EmployeeLogCard = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/employees/logs');
                const sortedLogs = response.data.sort((a: Log, b: Log) => new Date(b.payload.timestamp).getTime() - new Date(a.payload.timestamp).getTime());
                setLogs(sortedLogs.slice(0, 2));
            } catch (err) {
                setError('Failed to fetch employee logs.');
                console.error(err);
            }
        };

        fetchLogs();
    }, []);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-lg">Employee Log</CardTitle>
                <CardDescription>Recent warehouse access.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log._id} className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.payload.name}`} />
                                        <AvatarFallback>{log.payload.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">{log.payload.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(log.payload.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        !error && <p className="text-sm text-muted-foreground">No recent logs.</p>
                    )}
                </div>
                <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link to="/EmployeesLogs">
                        View All Logs <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};


const InventoryInfoCard = () => {
  const liveSensors = useWebSocket("ws://52.65.165.101:1880/ws/SenseHarvest");
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
      case "critical": return ""; 
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
        <CardTitle className="text-lg">Inventory Info</CardTitle>
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
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".dashboard-card > *", { 
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.3,
        });
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
       <MainHeader />
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
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 dashboard-card">
                <InventoryOverviewCard />
                <EmployeeLogCard />
                <div className="sm:col-span-2">
                     <DataVisualization />
                </div>
            </div>

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