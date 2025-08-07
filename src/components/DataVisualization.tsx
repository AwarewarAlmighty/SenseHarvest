import React, { useState, useCallback, useEffect } from "react";
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
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-day-picker";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DataPoint {
  timestamp: string;
  value: number;
  label: string;
}

interface SensorData {
  id: string;
  name: string;
  unit: string;
  data: DataPoint[];
  color: string;
}

const sensorTemplates = [
  { id: "temp1", name: "Temperature", unit: "°C", color: "#FF6384" },
  { id: "hum1", name: "Humidity", unit: "%", color: "#36A2EB" },
];

// Utility to download data as CSV
const downloadAsCSV = (data: DataPoint[], sensorName: string) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }
  const headers = "timestamp,value,label\n";
  const rows = data.map(d => `${d.timestamp},${d.value},"${d.label}"`).join("\n");
  const csvContent = headers + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${sensorName}-data.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const fetchSensorData = async (
  sensorId: string,
  range: string,
  from?: Date,
  to?: Date
): Promise<SensorData> => {
  let url = `http://${apiUrl}/api/sensors/${sensorId}?range=${range}`;
  if (from && to) {
    url += `&from=${from.toISOString()}&to=${to.toISOString()}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data for sensor ${sensorId}`);
  }
  const rawData = await response.json();

  const sensorTemplate = sensorTemplates.find(t => t.id === sensorId);
  if (!sensorTemplate) throw new Error(`No template for sensorId: ${sensorId}`);

  const formattedData: DataPoint[] = rawData.map((d: any) => ({
    timestamp: d.timestamp,
    value: d.value,
    label: format(new Date(d.timestamp),
      range === "realtime" ? "HH:mm:ss" : "MMM d, HH:mm"
    ),
  }));

  return {
    id: sensorId,
    name: sensorTemplate.name,
    unit: sensorTemplate.unit,
    color: sensorTemplate.color,
    data: formattedData,
  };
};

const DataVisualization = () => {
  const [data, setData] = useState<{ [key: string]: SensorData[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("realtime");
  const [selectedSensor, setSelectedSensor] = useState<string>("temp1");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const loadDataForTab = useCallback(async (tab: string) => {
    if (data[tab] && data[tab].length > 0) return;

    setIsLoading(true);
    try {
      const sensorIds = ["temp1", "hum1"];
      const fetchedData = await Promise.all(
        sensorIds.map(id => fetchSensorData(id, tab, dateRange?.from, dateRange?.to))
      );
      setData(prevData => ({ ...prevData, [tab]: fetchedData }));
    } catch (err) {
      console.error(`Error loading ${tab} data:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [data, dateRange]);

  useEffect(() => {
    loadDataForTab(activeTab);
  }, [activeTab, loadDataForTab]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const sensorIds = ["temp1", "hum1"];
      const fetchedData = await Promise.all(
        sensorIds.map(id => fetchSensorData(id, activeTab, dateRange?.from, dateRange?.to))
      );
      setData(prevData => ({ ...prevData, [activeTab]: fetchedData }));
    } catch (err) {
      console.error("Error refreshing sensor data:", err);
    }
    setIsLoading(false);
  }, [activeTab, dateRange]);
  
  const currentSensorData = (data[activeTab] || []).find(s => s.id === selectedSensor);

  const handleExport = () => {
      if (currentSensorData) {
          downloadAsCSV(currentSensorData.data, currentSensorData.name);
      }
  };


  const renderChart = (sensorData: SensorData | undefined) => {
    if (isLoading) {
      return (
        <div className="w-full h-64 bg-muted/20 rounded-md flex items-center justify-center">
          <p>Loading data...</p>
        </div>
      );
    }
    if (!sensorData || sensorData.data.length === 0) {
      return (
        <div className="w-full h-64 bg-muted/20 rounded-md flex items-center justify-center">
          <p>No data available for the selected period.</p>
        </div>
      );
    }
    return (
      <div>
        <h3 className="text-lg font-medium text-center mb-4">
          {sensorData.name} ({sensorData.unit})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={70}
              style={{ fontSize: "14px" }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={sensorData.color}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 ">
            <div className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="realtime">Real-time</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 ">
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Select sensor" />
                </SelectTrigger>
                <SelectContent>
                  {sensorTemplates.map((sensor) => (
                    <SelectItem key={sensor.id} value={sensor.id}>
                      {sensor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto justify-start text-left font-normal"
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
                      onSelect={setDateRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

            <TabsContent value="realtime" className="mt-0 border-0 p-0">
                {renderChart(currentSensorData)}
            </TabsContent>
            <TabsContent value="daily" className="mt-0 border-0 p-0">
                {renderChart(currentSensorData)}
            </TabsContent>
            <TabsContent value="weekly" className="mt-0 border-0 p-0">
                {renderChart(currentSensorData)}
            </TabsContent>
            <TabsContent value="monthly" className="mt-0 border-0 p-0">
                {renderChart(currentSensorData)}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>Source: Farm Sensors Network</span>
          </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
