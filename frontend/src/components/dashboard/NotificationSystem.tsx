import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NotificationSeverity = "critical" | "high" | "medium" | "low" | "info";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  severity: NotificationSeverity;
  read: boolean;
  source?: string;
  actionRequired?: boolean;
}

interface NotificationSystemProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onAction?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications = [
    {
      id: "1",
      title: "Critical Threat Detected",
      message: "Potential SQL injection attempt from IP 192.168.1.105",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      severity: "critical",
      read: false,
      source: "Firewall",
      actionRequired: true,
    },
    {
      id: "2",
      title: "High CPU Usage",
      message: "System experiencing high CPU load (92%)",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      severity: "high",
      read: false,
      source: "System Monitor",
      actionRequired: false,
    },
    {
      id: "3",
      title: "Brute Force Attempt",
      message: "Multiple failed login attempts detected from IP 203.45.67.89",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      severity: "medium",
      read: true,
      source: "Authentication Service",
      actionRequired: true,
    },
    {
      id: "4",
      title: "System Update Available",
      message: "Security patch KB45678 is available for installation",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      severity: "low",
      read: true,
      source: "Update Service",
      actionRequired: false,
    },
    {
      id: "5",
      title: "New User Created",
      message: "Administrator created a new user account: analyst_2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      severity: "info",
      read: true,
      source: "User Management",
      actionRequired: false,
    },
  ],
  onDismiss = (id) => console.log(`Dismissed notification ${id}`),
  onSnooze = (id) => console.log(`Snoozed notification ${id}`),
  onAction = (id) => console.log(`Action taken on notification ${id}`),
  onMarkAsRead = (id) => console.log(`Marked notification ${id} as read`),
  onClearAll = () => console.log("Cleared all notifications"),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Calculate unread notifications count
    const count = notifications.filter(
      (notification) => !notification.read,
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "info":
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: NotificationSeverity): string => {
    switch (severity) {
      case "critical":
        return "bg-red-100 border-red-600 text-red-800";
      case "high":
        return "bg-orange-100 border-orange-500 text-orange-800";
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "low":
        return "bg-blue-100 border-blue-500 text-blue-800";
      case "info":
        return "bg-gray-100 border-gray-500 text-gray-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const getSeverityBadge = (severity: NotificationSeverity) => {
    const variantMap: Record<
      NotificationSeverity,
      "default" | "destructive" | "secondary" | "outline"
    > = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline",
      info: "outline",
    };

    return (
      <Badge variant={variantMap[severity]} className="ml-2">
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="relative bg-white">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    notifications.forEach((n) => !n.read && onMarkAsRead(n.id))
                  }
                >
                  Mark all as read
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onClearAll}>
                Clear all
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px] p-4">
            {notifications.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative rounded-md border-l-4 p-4 shadow-sm transition-colors ${getSeverityColor(notification.severity)} ${!notification.read ? "bg-opacity-100" : "bg-opacity-60"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {getSeverityIcon(notification.severity)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">
                              {notification.title}
                            </h4>
                            {getSeverityBadge(notification.severity)}
                          </div>
                          <p className="mt-1 text-sm">{notification.message}</p>
                          <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                            <span>{formatTime(notification.timestamp)}</span>
                            {notification.source && (
                              <span>Source: {notification.source}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end space-x-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(notification.id)}
                          className="h-7 px-2 text-xs"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Mark as read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSnooze(notification.id)}
                        className="h-7 px-2 text-xs"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Snooze
                      </Button>
                      {notification.actionRequired && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onAction(notification.id)}
                          className="h-7 px-2 text-xs"
                        >
                          Take action
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(notification.id)}
                        className="h-7 px-2 text-xs"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
