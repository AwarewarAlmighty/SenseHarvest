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

const generateSensorData = (timeRange: string): SensorData[] => {
  const now = new Date();
  let dataPoints: DataPoint[] = [];

  return sensorTemplates.map(sensorTemplate => {
    let adjustedDataPoints: DataPoint[] = [];
    if (timeRange === 'daily') {
        const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 0 });
        adjustedDataPoints = Array.from({ length: 7 }, (_, i) => {
            const date = addDays(startOfCurrentWeek, i);
            return {
                timestamp: date.toISOString(),
                value: generateValue(sensorTemplate.baseValue, sensorTemplate.range),
                label: format(date, 'eeee'),
            };
        });
    } else if (timeRange === 'weekly') {
        adjustedDataPoints = Array.from({ length: 4 }, (_, i) => {
            const date = subWeeks(now, i);
            return {
                timestamp: date.toISOString(),
                value: generateValue(sensorTemplate.baseValue * 7, sensorTemplate.range * 7), // Average of 7 daily values
                label: `Week ${4 - i}`,
            };
        }).reverse();
    } else if (timeRange === 'monthly') {
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(now, i);
            return {
                timestamp: date.toISOString(),
                value: generateValue(sensorTemplate.baseValue * 30, sensorTemplate.range * 30), // Average of 30 daily values (approx)
                label: format(date, 'MMMM'),
                monthIndex: date.getMonth()
            };
        }).sort((a, b) => a.monthIndex - b.monthIndex);
        adjustedDataPoints = months.map(({ monthIndex, ...rest }) => rest);
    } else { // realtime
        adjustedDataPoints = Array.from({ length: 8 }, (_, i) => {
            const date = new Date(now.getTime() - i * 60000); // 1 minute interval
            return {
                timestamp: date.toISOString(),
                value: generateValue(sensorTemplate.baseValue, sensorTemplate.range),
                label: format(date, 'p'),
            };
        }).reverse();
    }

    return {
      id: sensorTemplate.id,
      name: sensorTemplate.name,
      unit: sensorTemplate.unit,
      color: sensorTemplate.color,
      data: adjustedDataPoints
    };
  });
};

const DataVisualization = () => {
  const [realtimeData, setRealtimeData] = useState<SensorData[]>(generateSensorData('realtime'));
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
    setDailyData(generateSensorData('daily'));
    setWeeklyData(generateSensorData('weekly'));
    setMonthlyData(generateSensorData('monthly'));

    const interval = setInterval(() => {
        const now = new Date();
        const newLabel = format(now, 'p');

        setRealtimeData(prevData => 
            prevData.map(sensor => {
                const sensorTemplate = sensorTemplates.find(t => t.id === sensor.id);
                const newValue = sensorTemplate ? generateValue(sensorTemplate.baseValue, sensorTemplate.range) : 0;
                const newPoint = {
                    timestamp: now.toISOString(),
                    label: newLabel,
                    value: newValue
                };
                return {
                    ...sensor,
                    data: [...sensor.data.slice(sensor.data.length - 7), newPoint] // Keep 8 elements (slice from 7th from end)
                };
            })
        );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRealtimeData(generateSensorData('realtime'));
      setDailyData(generateSensorData('daily'));
      setWeeklyData(generateSensorData('weekly'));
      setMonthlyData(generateSensorData('monthly'));
      setIsLoading(false);
    }, 500);
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
        return <div className="w-full h-64 bg-muted/20 rounded-md flex items-center justify-center">Loading data...</div>;
    }
    return (
      <div className="w-full h-100 bg-muted/20 rounded-md flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Chart visualization for {activeTab} data
          </p>
          <p className="text-sm text-muted-foreground">
            Displaying {data?.name} data ({data?.unit})
          </p>
          <div className="mt-4 flex flex-col gap-2 w-48">
            {data?.data.map((point, index) => (
              <div key={index} className="flex justify-between text-xs gap-4">
                <span>{point.label}</span>
                <span>
                  {point.value.toFixed(1)} {data.unit}
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
                      className="w-full sm:w-[180px] justify-start text-left font-normal"
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
