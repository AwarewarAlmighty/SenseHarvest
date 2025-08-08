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

import React, { useState, useEffect } from "react";
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
import useWebSocket from "../hooks/useWebSocket"; // Your custom hook

interface Notification {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  action?: string;
}

const websocketUrl = import.meta.env.VITE_WS_URL || "wss://senseharvest.ddns.net/ws/SenseHarvest";
// Define API URL for all HTTP requests, similar to Dashboard.tsx
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const NotificationCenter: React.FC = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Your custom useWebSocket hook returns the parsed data directly (or null initially)
  const receivedWebSocketData = useWebSocket(`${websocketUrl}/Sensors`);

  // Handle incoming WebSocket messages
  useEffect(() => {
    // Check if any data was received from the WebSocket hook and if it's an array
    if (receivedWebSocketData && Array.isArray(receivedWebSocketData)) {
      console.log("--- WebSocket Message Received ---");
      console.log("Parsed sensorData from hook (Array):", receivedWebSocketData);

      const newLiveNotifications: Notification[] = [];
      receivedWebSocketData.forEach((sensorData: any) => { // Iterate over each sensor object in the array
        console.log("Processing individual sensorData:", sensorData);
        console.log("Individual SensorData status:", sensorData.status);

        // Only create notification if status is critical or warning for live updates
        if (sensorData.status === 'critical' || sensorData.status === 'warning') {
          const newNotification: Notification = {
            _id: `ws-${sensorData.id || new Date().getTime()}-${Math.random()}`, // Use sensor ID if available, else generate
            title: `Live Sensor: ${sensorData.name || sensorData.sensorId || 'Unknown'}`, // Use 'name' or 'sensorId'
            description: `Value: ${sensorData.value || 'N/A'}, Status: ${sensorData.status || 'normal'}`,
            createdAt: sensorData.lastUpdated || new Date().toISOString(), // Use lastUpdated if available
            severity: (sensorData.status as "info" | "warning" | "critical") || "info",
            read: false, // Live notifications are initially unread
          };
          newLiveNotifications.push(newNotification);
          console.log("Potential live notification:", newNotification.title);
        } else {
          console.log(`Live sensor data for ${sensorData.name || sensorData.sensorId} is 'normal', not adding as a notification.`);
        }
      });

      // Limit to the latest 3 live notifications (assuming receivedWebSocketData is already ordered by time)
      const limitedLiveNotifications = newLiveNotifications.slice(0, 3);
      
      // Update state, ensuring live notifications are at the top and limited
      setNotifications((prevNotifications) => {
        // Filter out old WebSocket notifications to only keep the latest 3
        const existingHistoricalNotifications = prevNotifications.filter(n => !n._id.startsWith('ws-'));
        return [...limitedLiveNotifications, ...existingHistoricalNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });

      console.log("--- End WebSocket Message Processing ---");
    } else if (receivedWebSocketData) {
        // This block handles cases where the WebSocket might send a single object, not an array
        console.log("--- WebSocket Message Received (Single Object) ---");
        console.log("Parsed sensorData from hook (Single Object):", receivedWebSocketData);
        console.log("SensorData status:", receivedWebSocketData.status);

        if (receivedWebSocketData.status === 'critical' || receivedWebSocketData.status === 'warning') {
            const newNotification: Notification = {
                _id: `ws-${receivedWebSocketData.id || new Date().getTime()}-${Math.random()}`,
                title: `Live Sensor: ${receivedWebSocketData.name || receivedWebSocketData.sensorId || 'Unknown'}`,
                description: `Value: ${receivedWebSocketData.value || 'N/A'}, Status: ${receivedWebSocketData.status || 'normal'}`,
                createdAt: receivedWebSocketData.lastUpdated || new Date().toISOString(),
                severity: (receivedWebSocketData.status as "info" | "warning" | "critical") || "info",
                read: false,
            };
            // For a single object, we replace the previous live notifications with this new one, if it's one of the top 3
            setNotifications((prevNotifications) => {
                const existingHistoricalNotifications = prevNotifications.filter(n => !n._id.startsWith('ws-'));
                // Add the new notification and ensure it's at the top if it's within the latest 3
                return [newNotification, ...existingHistoricalNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3 + existingHistoricalNotifications.length); // Keep 3 live + historical
            });
            console.log("Notification added from WebSocket (single object):", newNotification.title);
        } else {
            console.log(`Live sensor data (single object) is 'normal', not adding as a notification.`);
        }
        console.log("--- End WebSocket Message Processing (Single Object) ---");
    } else {
        console.log("No new WebSocket data yet (receivedWebSocketData is null/undefined).");
    }
  }, [receivedWebSocketData]); // Depend on receivedWebSocketData to react to new messages

  useEffect(() => {
    const fetchHistoricalNotifications = async () => {
      if (!token) {
        setIsLoading(false);
        console.log("No authentication token available for fetching historical data.");
        return;
      }
      console.log("Attempting to fetch historical notifications...");
      try {
        // Use direct fetch with apiUrl, similar to Dashboard.tsx
        const response = await fetch(`${apiUrl}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: Notification[] = await response.json(); // Parse JSON response
        console.log("Historical notifications fetched successfully:", data);

        setNotifications((prevNotifications) => {
          // Filter out any potential duplicates between live and historical data
          const existingIds = new Set(prevNotifications.map(n => n._id));
          const newHistoricalNotifications = data.filter((n: Notification) => !existingIds.has(n._id));
          
          // Combine current live notifications (if any) and new historical, then sort
          const currentLiveNotifications = prevNotifications.filter(n => n._id.startsWith('ws-'));
          return [...currentLiveNotifications, ...newHistoricalNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
      } catch (err: any) {
        console.error("Error fetching historical notifications:", err);
        setError(err.message || "Failed to fetch historical notifications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistoricalNotifications();
  }, [token]); // Re-fetch if token changes

  const handleClearAll = async () => {
    console.log("Attempting to clear historical notifications...");
    try {
      // Use direct fetch with apiUrl for clearing historical data
      const response = await fetch(`${apiUrl}/api/events`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to clear notifications: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      console.log("Historical notifications cleared successfully.");
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n._id.startsWith('ws-')) // Keep only WebSocket-originated notifications
      );
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
                          ? "border-destructive/30 bg-red-50"
                          : notification.severity === "warning"
                          ? "border-amber-500/30 bg-yellow-50"
                          : "border-green-500/30 bg-green-50"
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
