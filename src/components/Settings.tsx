import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SensorSettings from "./SensorSettings";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your application settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {user?.role === "admin" ? (
            <SensorSettings />
          ) : (
            <p>You do not have permission to view this page.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;