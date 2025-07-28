import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  location: string;
  lastUpdated: string;
}

interface SensorStatusGridProps {
  sensors?: SensorData[];
}

const SensorStatusGrid: React.FC<SensorStatusGridProps> = ({
  sensors = defaultSensors,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case "stable":
        return <ArrowRightIcon className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Sensor Status</h2>
        <Badge variant="outline" className="text-xs">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => (
          <Card
            key={sensor.id}
            className={`border-l-4 ${getStatusColor(sensor.status)} transition-all hover:shadow-md`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-700">{sensor.name}</h3>
                  <p className="text-gray-500 text-xs">{sensor.location}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mt-1">{getStatusIcon(sensor.status)}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {sensor.status.charAt(0).toUpperCase() +
                          sensor.status.slice(1)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    {sensor.value}
                  </span>
                  <span className="ml-1 text-sm text-gray-600">
                    {sensor.unit}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        {getTrendIcon(sensor.trend)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Trend:{" "}
                        {sensor.trend.charAt(0).toUpperCase() +
                          sensor.trend.slice(1)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Updated: {new Date(sensor.lastUpdated).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Default sensor data for demonstration
const defaultSensors: SensorData[] = [
  {
    id: "1",
    name: "Temperature",
    value: 24.5,
    unit: "°C",
    status: "normal",
    trend: "stable",
    location: "Field A",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Humidity",
    value: 68,
    unit: "%",
    status: "warning",
    trend: "up",
    location: "Field A",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Soil Moisture",
    value: 42,
    unit: "%",
    status: "normal",
    trend: "down",
    location: "Field B",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "CO2 Level",
    value: 1250,
    unit: "ppm",
    status: "critical",
    trend: "up",
    location: "Greenhouse",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Light Intensity",
    value: 8500,
    unit: "lux",
    status: "normal",
    trend: "stable",
    location: "Field C",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "6",
    name: "pH Level",
    value: 6.2,
    unit: "pH",
    status: "normal",
    trend: "stable",
    location: "Field B",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Wind Speed",
    value: 15.2,
    unit: "km/h",
    status: "warning",
    trend: "up",
    location: "Weather Station",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Rainfall",
    value: 0,
    unit: "mm",
    status: "normal",
    trend: "stable",
    location: "Weather Station",
    lastUpdated: new Date().toISOString(),
  },
];

export default SensorStatusGrid;
