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
import { format, subDays, subWeeks, subMonths, startOfWeek, addDays } from "date-fns";
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


const generateValue = (base: number, range: number) => base + Math.random() * range;

const sensorTemplates = [
  { id: "temp1", name: "Temperature", unit: "°C", color: "#FF6384", baseValue: 20, range: 5 },
  { id: "hum1", name: "Humidity", unit: "%", color: "#36A2EB", baseValue: 60, range: 20 },
  { id: "soil1", name: "Soil Moisture", unit: "%", color: "#4BC0C0", baseValue: 40, range: 15 },
  { id: "gas1", name: "CO2 Level", unit: "ppm", color: "#9966FF", baseValue: 400, range: 100 },
];

const fetchSensorData = async (sensorId: string, range: string): Promise<SensorData> => {
  const response = await fetch(`http://localhost:3000/api/sensors/${sensorId}?range=${range}`);
  const rawData = await response.json();

  const sensorTemplate = sensorTemplates.find(t => t.id === sensorId);
  if (!sensorTemplate) throw new Error(`No template for sensorId: ${sensorId}`);

  const formattedData: DataPoint[] = rawData.map((d: any) => ({
    timestamp: d.timestamp,
    value: d.value,
    label: format(new Date(d.timestamp), 
    range === "realtime"
      ? "HH:mm:ss"              
      : range === "daily"
      ? "MMM d, HH:mm"           
      : range === "weekly"
      ? "'Week' w"               // e.g. "Week 31"
      : "MMM"                    // e.g. "Jul"
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
  const [realtimeData, setRealtimeData] = useState<SensorData[]>([]);
  const [dailyData, setDailyData] = useState<SensorData[]>([]);
  const [weeklyData, setWeeklyData] = useState<SensorData[]>([]);
  const [monthlyData, setMonthlyData] = useState<SensorData[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("realtime");
  const [selectedSensor, setSelectedSensor] = useState<string>("temp1");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) });

  useEffect(() => {
  const loadData = async () => {
    const sensorIds = ["temp1", "hum1", "soil1", "gas1"];
    const data = await Promise.all(sensorIds.map(id => fetchSensorData(id, "realtime")));
    setRealtimeData(data);
  };

  loadData();
}, []);


  const handleRefresh = useCallback(async () => {
  setIsLoading(true);

  try {
    const sensorIds = ["temp1", "hum1", "soil1", "gas1"];

    const [
      realtime,
      daily,
      weekly,
      monthly
    ] = await Promise.all([
      Promise.all(sensorIds.map(id => fetchSensorData(id, "realtime"))),
      Promise.all(sensorIds.map(id => fetchSensorData(id, "daily"))),
      Promise.all(sensorIds.map(id => fetchSensorData(id, "weekly"))),
      Promise.all(sensorIds.map(id => fetchSensorData(id, "monthly")))
    ]);

    setRealtimeData(realtime);
    setDailyData(daily);
    setWeeklyData(weekly);
    setMonthlyData(monthly);
  } catch (err) {
    console.error("Error refreshing sensor data:", err);
  }

  setIsLoading(false);
}, []);


  const handleExport = () => {
    console.log("Exporting data...");
  };

  const getDataForTab = (tab: string) => {
    switch (tab) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return realtimeData;
    }
  };

  const currentData = getDataForTab(activeTab);
  const currentSensorData =
    currentData.find((sensor) => sensor.id === selectedSensor) || (currentData.length > 0 ? currentData[0] : null);

  const renderChart = (data: SensorData | null) => {
    if (!data) {
      return (
        <div className="w-full h-64 bg-muted/20 rounded-md flex items-center justify-center">
          Loading data...
        </div>
      );
    }
    return (
      <div>
        <h3 className="text-lg font-medium text-center mb-4">
          {data.name} ({data.unit})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              interval={0}
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
              stroke={data.color}
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
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 ">
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

            <div className="flex flex-col sm:flex-row gap-2 ">
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Select sensor" />
                </SelectTrigger>
                <SelectContent>
                  {(currentData || []).map((sensor) => (
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
                      onSelect={setDateRange as any}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            className="w-full"
          >
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
