import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Settings {
  temperature: { min: number; max: number };
  humidity: { min: number; max: number };
}

const SensorSettings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    temperature: { min: 0, max: 100 },
    humidity: { min: 0, max: 100 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${apiUrl}/api/sensors/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Could not fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [category, type] = name.split('.');
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof Settings], [type]: Number(value) }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/api/sensors/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      toast.success('Settings updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings.');
    }
  };

  if (loading) return <p>Loading settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Sensor Thresholds</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Temperature (°C)</label>
          <div className="flex gap-2 mt-1">
            <input type="number" name="temperature.min" value={settings.temperature.min} onChange={handleChange} className="w-full p-2 rounded bg-input" placeholder="Min" />
            <input type="number" name="temperature.max" value={settings.temperature.max} onChange={handleChange} className="w-full p-2 rounded bg-input" placeholder="Max" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Humidity (%)</label>
          <div className="flex gap-2 mt-1">
            <input type="number" name="humidity.min" value={settings.humidity.min} onChange={handleChange} className="w-full p-2 rounded bg-input" placeholder="Min" />
            <input type="number" name="humidity.max" value={settings.humidity.max} onChange={handleChange} className="w-full p-2 rounded bg-input" placeholder="Max" />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">Save Settings</button>
      </form>
    </div>
  );
};

export default SensorSettings;