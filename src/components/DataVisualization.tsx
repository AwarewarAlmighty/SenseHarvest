import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface DataPoint {
  timestamp: string;
  value: number;
}

interface SensorData {
  id: string;
  name: string;
  unit: string;
  data: DataPoint[];
  color: string;
}

interface DataVisualizationProps {
  sensorData?: SensorData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

const DataVisualization = ({
  sensorData = [
    {
      id: "temp1",
      name: "Temperature",
      unit: "°C",
      color: "#FF6384",
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: 20 + Math.random() * 5,
      })),
    },
    {
      id: "hum1",
      name: "Humidity",
      unit: "%",
      color: "#36A2EB",
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: 60 + Math.random() * 20,
      })),
    },
    {
      id: "soil1",
      name: "Soil Moisture",
      unit: "%",
      color: "#4BC0C0",
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: 40 + Math.random() * 15,
      })),
    },
    {
      id: "gas1",
      name: "CO2 Level",
      unit: "ppm",
      color: "#9966FF",
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: 400 + Math.random() * 100,
      })),
    },
  ],
  isLoading = false,
  onRefresh = () => {},
  onExport = () => {},
}: DataVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("realtime");
  const [selectedSensor, setSelectedSensor] = useState<string>(
    sensorData[0]?.id || "",
  );
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) });

  // Find the currently selected sensor data
  const currentSensorData =
    sensorData.find((sensor) => sensor.id === selectedSensor) || sensorData[0];

  // Function to render the chart (placeholder for actual chart implementation)
  const renderChart = () => {
    return (
      <div className="w-full h-64 bg-muted/20 rounded-md flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Chart visualization would render here
          </p>
          <p className="text-sm text-muted-foreground">
            Displaying {currentSensorData?.name} data ({currentSensorData?.unit}
            )
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {currentSensorData?.data.slice(0, 5).map((point, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span>{new Date(point.timestamp).toLocaleTimeString()}</span>
                <span>
                  {point.value.toFixed(1)} {currentSensorData.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Data Visualization</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-8"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full sm:w-auto">
              <Tabs
                defaultValue="realtime"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList>
                  <TabsTrigger value="realtime">Real-time</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select sensor" />
                </SelectTrigger>
                <SelectContent>
                  {sensorData.map((sensor) => (
                    <SelectItem key={sensor.id} value={sensor.id}>
                      {sensor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d, yyyy")} -{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange as any}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="realtime"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="realtime" className="mt-0 border-0 p-0">
              {renderChart()}
            </TabsContent>
            <TabsContent value="daily" className="mt-0 border-0 p-0">
              {renderChart()}
            </TabsContent>
            <TabsContent value="weekly" className="mt-0 border-0 p-0">
              {renderChart()}
            </TabsContent>
            <TabsContent value="monthly" className="mt-0 border-0 p-0">
              {renderChart()}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>Source: Farm Sensors Network</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
