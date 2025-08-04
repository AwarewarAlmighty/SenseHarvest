import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SensorSettings = () => {
  const { token } = useAuth();
  const [thresholds, setThresholds] = useState({
    temperature: '',
    humidity: '',
    moisture: '',
    co2: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/sensors/settings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setThresholds(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/sensors/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thresholds }),
      });
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Thresholds</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSaveSettings}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                value={thresholds.temperature}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                name="humidity"
                value={thresholds.humidity}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="moisture">Soil Moisture (%)</Label>
              <Input
                id="moisture"
                name="moisture"
                value={thresholds.moisture}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co2">CO2 (ppm)</Label>
              <Input
                id="co2"
                name="co2"
                value={thresholds.co2}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SensorSettings;
