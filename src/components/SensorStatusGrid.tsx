import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  // Returns theme-aware classes for the card's left border
  const getStatusBorder = (status: SensorData["status"]) => {
    switch (status) {
      case "normal":
        return "border-green-500";
      case "warning":
        return "border-yellow-500";
      case "critical":
        return "border-destructive"; // Using semantic color for critical status
      default:
        return "border-border";
    }
  };

  const getTrendIcon = (trend: SensorData["trend"]) => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4 text-destructive" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case "stable":
        return <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: SensorData["status"]) => {
    switch (status) {
      case "normal":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertCircleIcon className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    // Use a Card component for the main container for consistent, theme-aware styling
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Sensor Status</CardTitle>
          <Badge variant="outline" className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map((sensor) => (
            <Card
              key={sensor.id}
              // Apply the status color to the left border only
              className={`border-l-4 ${getStatusBorder(
                sensor.status
              )} transition-all hover:shadow-md`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Use theme-aware text colors */}
                    <h3 className="font-medium text-foreground">{sensor.name}</h3>
                    <p className="text-muted-foreground text-xs">{sensor.location}</p>
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
                    <span className="text-2xl font-bold text-foreground">
                      {sensor.value}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
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
                <div className="mt-2 text-xs text-muted-foreground">
                  Updated: {new Date(sensor.lastUpdated).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
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
  ];

export default SensorStatusGrid;