// import React, { useState, useEffect } from "react";
// import {
//   Bell,
//   CheckCircle,
//   AlertTriangle,
//   AlertCircle,
//   X,
//   ChevronRight,
// } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { ScrollArea } from "./ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { useAuth } from "../context/AuthContext";

// interface Notification {
//   _id: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   severity: "info" | "warning" | "critical";
//   read: boolean;
//   action?: string;
// }

// const NotificationCenter: React.FC = () => {
//   const { token } = useAuth();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<string>("all");

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!token) return;
//       try {
//         const response = await fetch("/api/events", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) throw new Error("Failed to fetch notifications");
//         const data = await response.json();
//         setNotifications(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchNotifications();
//   }, [token]);

//   const handleMarkAsRead = async (id: string) => {
//     try {
//       const response = await fetch(`/api/events/${id}/read`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error("Failed to mark as read");
//       setNotifications(
//         notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleClearAll = async () => {
//     try {
//       const response = await fetch("/api/events", {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error("Failed to clear notifications");
//       setNotifications([]);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const filteredNotifications = notifications.filter((notification) => {
//     if (activeTab === "all") return true;
//     if (activeTab === "unread") return !notification.read;
//     if (activeTab === "critical") return notification.severity === "critical";
//     if (activeTab === "warning") return notification.severity === "warning";
//     if (activeTab === "info") return notification.severity === "info";
//     return true;
//   });

//   const getSeverityIcon = (severity: string) => {
//     switch (severity) {
//       case "critical":
//         return <AlertCircle className="h-5 w-5 text-destructive" />;
//       case "warning":
//         return <AlertTriangle className="h-5 w-5 text-amber-500" />;
//       case "info":
//       default:
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//     }
//   };

//   const getSeverityBadge = (severity: string) => {
//     switch (severity) {
//       case "critical":
//         return <Badge variant="destructive">Critical</Badge>;
//       case "warning":
//         return (
//           <Badge variant="secondary" className="bg-amber-500 text-white">
//             Warning
//           </Badge>
//         );
//       case "info":
//       default:
//         return (
//           <Badge variant="secondary" className="bg-green-500 text-white">
//             Info
//           </Badge>
//         );
//     }
//   };

//   return (
//     <Card className="w-full h-full shadow-md">
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Bell className="h-5 w-5" />
//             <CardTitle className="text-lg">Notifications</CardTitle>
//             {unreadCount > 0 && (
//               <Badge variant="secondary" className="bg-primary text-white">
//                 {unreadCount} new
//               </Badge>
//             )}
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleClearAll}
//             disabled={notifications.length === 0}
//           >
//             Clear all
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Tabs
//           defaultValue="all"
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="w-full"
//         >
//           <div className="px-4">
//             <TabsList className="w-full grid grid-cols-5">
//               <TabsTrigger value="all">All</TabsTrigger>
//               <TabsTrigger value="unread">Unread</TabsTrigger>
//               <TabsTrigger value="critical">Critical</TabsTrigger>
//               <TabsTrigger value="warning">Warning</TabsTrigger>
//               <TabsTrigger value="info">Info</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value={activeTab} className="mt-0">
//             <ScrollArea className="h-[320px] px-4">
//               {isLoading ? (
//                 <p>Loading notifications...</p>
//               ) : error ? (
//                 <p className="text-red-500">{error}</p>
//               ) : filteredNotifications.length > 0 ? (
//                 <div className="space-y-2 py-2">
//                   {filteredNotifications.map((notification) => (
//                     <div
//                       key={notification._id}
//                       className={`p-3 rounded-lg border ${notification.read ? "bg-card" : "bg-muted/30"} ${notification.severity === "critical" ? "border-destructive/30" : notification.severity === "warning" ? "border-amber-500/30" : "border-green-500/30"}`}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex gap-3">
//                           {getSeverityIcon(notification.severity)}
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <h4 className="font-medium text-sm">
//                                 {notification.title}
//                               </h4>
//                               {getSeverityBadge(notification.severity)}
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-1">
//                               {notification.description}
//                             </p>
//                             <div className="flex justify-between items-center mt-2">
//                               <span className="text-xs text-muted-foreground">
//                                 {new Date(
//                                   notification.createdAt
//                                 ).toLocaleString()}
//                               </span>
//                               {notification.action && (
//                                 <Button
//                                   variant="link"
//                                   size="sm"
//                                   className="p-0 h-auto text-xs flex items-center gap-1"
//                                 >
//                                   {notification.action}
//                                   <ChevronRight className="h-3 w-3" />
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         {!notification.read && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-6 w-6 p-0 rounded-full"
//                             onClick={() => handleMarkAsRead(notification._id)}
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full py-8 text-center">
//                   <Bell className="h-10 w-10 text-muted-foreground mb-2" />
//                   <p className="text-muted-foreground">
//                     No notifications to display
//                   </p>
//                 </div>
//               )}
//             </ScrollArea>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// };

// export default NotificationCenter;
import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../context/AuthContext";
import useWebSocket from "../hooks/useWebSocket";

interface Notification {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  severity: "info" | "warning" | "critical";
  action?: string;
}

const websocketUrl = import.meta.env.VITE_WS_URL || "wss://senseharvest.ddns.net/ws/SenseHarvest";
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const NotificationCenter: React.FC = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const receivedWebSocketData = useWebSocket(`${websocketUrl}/Sensors`);

  const postNotification = useCallback(async (newNotificationData) => {
    if (!token) {
      console.error("No token available to post notification.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNotificationData),
      });

      if (!response.ok) {
        throw new Error("Failed to post new event.");
      }
      const postedEvent = await response.json();
      console.log("New event posted successfully:", postedEvent);
      
      setNotifications((prevNotifications) => {
        const updatedNotifications = [postedEvent, ...prevNotifications];
        const sortedNotifications = updatedNotifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return sortedNotifications.slice(0, 3);
      });
    } catch (err) {
      console.error("Error posting new notification:", err);
      setError("Failed to post new notification");
    }
  }, [token]);

  useEffect(() => {
    if (receivedWebSocketData) {
      const sensorDataArray = Array.isArray(receivedWebSocketData)
        ? receivedWebSocketData
        : [receivedWebSocketData];

      sensorDataArray.forEach((sensorData) => {
        if (sensorData.status === 'critical' || sensorData.status === 'warning') {
          const newNotification = {
            title: `Live Sensor Alert: ${sensorData.name || sensorData.sensorId || 'Unknown'}`,
            description: `Value: ${sensorData.value || 'N/A'}, Status: ${sensorData.status || 'normal'}`,
            createdAt: sensorData.lastUpdated || new Date().toISOString(),
            severity: sensorData.status,
          };
          postNotification(newNotification);
        }
      });
    }
  }, [receivedWebSocketData, postNotification]);

  useEffect(() => {
    const fetchHistoricalNotifications = async () => {
      if (!token) {
        setIsLoading(false);
        console.log("No authentication token available for fetching historical data.");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/events?limit=3`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data: Notification[] = await response.json();
        console.log("Historical notifications fetched successfully:", data);

        setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err: any) {
        console.error("Error fetching historical notifications:", err);
        setError(err.message || "Failed to fetch historical notifications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistoricalNotifications();
  }, [token]);

  const handleClearAll = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to clear notifications: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      console.log("Historical notifications cleared successfully.");
      setNotifications([]);
    } catch (err: any) {
      console.error("Error clearing notifications:", err);
      setError(err.message || "Failed to clear notifications");
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    return notification.severity === activeTab;
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
    <Card className="w-full h-full shadow-md rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Clear historical
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
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[320px] px-4">
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Loading notifications...</p>
              ) : error ? (
                <p className="text-red-500 text-center py-8">{error}</p>
              ) : filteredNotifications.length > 0 ? (
                <div className="space-y-2 py-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-3 rounded-lg border ${
                        notification.severity === "critical"
                          ? "border-destructive/30"
                          : notification.severity === "warning"
                          ? "border-amber-500/30"
                          : "border-green-500/30"
                      }`}
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
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
                              </span>
                              {notification.action && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-xs flex items-center gap-1"
                                >
                                  {notification.action}
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
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
