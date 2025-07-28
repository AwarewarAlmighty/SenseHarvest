import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  action?: string;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onTakeAction?: (id: string, action: string) => void;
  onClearAll?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [
    {
      id: "1",
      title: "Temperature Alert",
      description: "Greenhouse temperature exceeds threshold (32°C)",
      timestamp: "10 minutes ago",
      severity: "critical",
      read: false,
      action: "Activate cooling system",
    },
    {
      id: "2",
      title: "Humidity Warning",
      description: "Humidity levels below optimal range (30%)",
      timestamp: "1 hour ago",
      severity: "warning",
      read: false,
      action: "Check irrigation system",
    },
    {
      id: "3",
      title: "Soil Moisture Update",
      description: "Soil moisture levels have returned to normal",
      timestamp: "3 hours ago",
      severity: "info",
      read: true,
    },
    {
      id: "4",
      title: "Gas Level Alert",
      description: "CO2 levels above normal in storage area",
      timestamp: "5 hours ago",
      severity: "warning",
      read: false,
      action: "Increase ventilation",
    },
    {
      id: "5",
      title: "System Update",
      description: "Sensor firmware updated successfully",
      timestamp: "1 day ago",
      severity: "info",
      read: true,
    },
  ],
  onMarkAsRead = () => {},
  onTakeAction = () => {},
  onClearAll = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "critical") return notification.severity === "critical";
    if (activeTab === "warning") return notification.severity === "warning";
    if (activeTab === "info") return notification.severity === "info";
    return true;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return (
          <Badge variant="secondary" className="bg-amber-500 text-white">
            Warning
          </Badge>
        );
      case "info":
      default:
        return (
          <Badge variant="secondary" className="bg-green-500 text-white">
            Info
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[320px] px-4">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-2 py-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.read ? "bg-white" : "bg-muted/30"} ${notification.severity === "critical" ? "border-destructive/30" : notification.severity === "warning" ? "border-amber-500/30" : "border-green-500/30"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          {getSeverityIcon(notification.severity)}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              {getSeverityBadge(notification.severity)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                              {notification.action && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-xs flex items-center gap-1"
                                  onClick={() =>
                                    onTakeAction(
                                      notification.id,
                                      notification.action || "",
                                    )
                                  }
                                >
                                  {notification.action}
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No notifications to display
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
