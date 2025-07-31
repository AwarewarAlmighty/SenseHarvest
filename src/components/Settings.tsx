import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const defaultThresholds = {
  temperature: 30,
  humidity: 80,
  soilMoisture: 60,
  co2: 900,
};

const Settings = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [initialThresholds, setInitialThresholds] = useState(defaultThresholds);

  const handleSave = () => {
    // Here you would typically make an API call to save the settings
    console.log("Saving thresholds:", thresholds);
    setInitialThresholds(thresholds);
    toast({
      title: "Settings Saved",
      description: "Your environmental thresholds have been updated.",
    });
  };

  const handleCancel = () => {
    setThresholds(initialThresholds);
  };

  const handleReset = () => {
    setThresholds(defaultThresholds);
  };

  const isChanged = JSON.stringify(thresholds) !== JSON.stringify(initialThresholds);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>
            Manage environmental thresholds for automated alerts and actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={thresholds.temperature}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, temperature: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    value={thresholds.humidity}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, humidity: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                  <Input
                    id="soilMoisture"
                    type="number"
                    value={thresholds.soilMoisture}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, soilMoisture: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co2">CO2 Level (ppm)</Label>
                  <Input
                    id="co2"
                    type="number"
                    value={thresholds.co2}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, co2: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} disabled={!isChanged}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isChanged}>
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;