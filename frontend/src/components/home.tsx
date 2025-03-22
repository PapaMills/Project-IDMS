import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import Sidebar from "./dashboard/Sidebar";
import MetricsPanel from "./dashboard/MetricsPanel";
import ThreatVisualization from "./dashboard/ThreatVisualization";
import FilteringSystem from "./dashboard/FilteringSystem";
import ThreatsList from "./dashboard/ThreatsList";
import NotificationSystem from "./dashboard/NotificationSystem";
import ThreatDetailModal from "./dashboard/ThreatDetailModal";
import { useLocation } from "react-router-dom";

// Mock socket for real-time updates
const mockSocket = {
  on: (event: string, callback: Function) => {
    if (event === "threat-alert") {
      // Simulate receiving threat alerts every 30 seconds
      setInterval(() => {
        callback({
          id: `threat-${Date.now()}`,
          title: "New Threat Detected",
          message: "Suspicious activity detected from IP 203.45.67.89",
          timestamp: new Date(),
          severity: ["critical", "high", "medium", "low"][
            Math.floor(Math.random() * 4)
          ] as any,
          read: false,
          source: "Firewall",
          actionRequired: Math.random() > 0.5,
        });
      }, 30000);
    }
  },
};

const Home = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showThreatDetails, setShowThreatDetails] = useState(false);
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeThreats, setActiveThreats] = useState(12);
  const [recentEvents, setRecentEvents] = useState(48);
  const [systemStatus, setSystemStatus] = useState<
    "operational" | "degraded" | "critical"
  >("operational");
  const [threatLevel, setThreatLevel] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");

  // Initialize socket connection for real-time updates
  useEffect(() => {
    // In a real implementation, this would be a Socket.IO connection
    // For now, we'll use our mock socket
    mockSocket.on("threat-alert", (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);

      // Update metrics based on new threat
      if (
        notification.severity === "critical" ||
        notification.severity === "high"
      ) {
        setActiveThreats((prev) => prev + 1);
        setThreatLevel(notification.severity);
      }
      setRecentEvents((prev) => prev + 1);
    });

    // Simulate occasional system status changes
    const statusInterval = setInterval(() => {
      const random = Math.random();
      if (random < 0.1) {
        setSystemStatus("degraded");
        setTimeout(() => setSystemStatus("operational"), 60000);
      } else if (random < 0.05) {
        setSystemStatus("critical");
        setTimeout(() => setSystemStatus("degraded"), 30000);
        setTimeout(() => setSystemStatus("operational"), 90000);
      }
    }, 120000);

    return () => clearInterval(statusInterval);
  }, []);

  // Handle refresh of visualization data
  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Update metrics with new random data
      setActiveThreats(Math.floor(Math.random() * 10) + 8);
      setRecentEvents(Math.floor(Math.random() * 20) + 40);
    }, 1500);
  };

  // Handle viewing threat details
  const handleViewThreatDetails = (threatId: string) => {
    setSelectedThreatId(threatId);
    setShowThreatDetails(true);
  };

  // Handle closing threat details modal
  const handleCloseThreatDetails = () => {
    setShowThreatDetails(false);
  };

  // Handle notification click
  const handleNotificationClick = () => {
    console.log("Notification bell clicked");
  };

  // Handle notification actions
  const handleNotificationDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        activePath={location.pathname}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onNotificationsClick={handleNotificationClick}
          notificationCount={notifications.filter((n) => !n.read).length}
        />

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Metrics Panel */}
            <MetricsPanel
              activeThreats={activeThreats}
              recentEvents={recentEvents}
              systemStatus={systemStatus}
              threatLevel={threatLevel}
            />

            {/* Filtering System */}
            <FilteringSystem
              onFilterChange={(filters) =>
                console.log("Filters changed:", filters)
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Threat Visualization */}
              <div className="lg:col-span-3">
                <ThreatVisualization
                  isLoading={isLoading}
                  onRefresh={handleRefreshData}
                />
              </div>

              {/* Threats List */}
              <div className="lg:col-span-3">
                <ThreatsList onViewDetails={handleViewThreatDetails} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Fixed position elements */}
      <div className="fixed bottom-6 right-6 z-40">
        <NotificationSystem
          notifications={notifications}
          onDismiss={handleNotificationDismiss}
          onMarkAsRead={handleNotificationMarkAsRead}
        />
      </div>

      {/* Threat Detail Modal */}
      {showThreatDetails && (
        <ThreatDetailModal
          isOpen={showThreatDetails}
          onClose={handleCloseThreatDetails}
          threatData={{
            id: selectedThreatId || "THR-2023-06-15-001",
            title: "Suspicious SSH Brute Force Attempt",
            description:
              "Multiple failed SSH login attempts detected from a single IP address within a short time period, indicating a possible brute force attack.",
            severity: "high",
            status: "active",
            sourceIp: "198.51.100.76",
            destinationIp: "10.0.0.5",
            timestamp: "2023-06-15T14:32:17Z",
            attackVector: "Brute Force",
            affectedSystems: ["SSH Server", "Authentication System"],
            timeline: [
              {
                time: "2023-06-15T14:30:05Z",
                event: "First failed login attempt",
                type: "detection",
              },
              {
                time: "2023-06-15T14:31:12Z",
                event: "Multiple failed attempts detected",
                type: "system",
              },
              {
                time: "2023-06-15T14:32:17Z",
                event: "Threshold exceeded - Alert triggered",
                type: "system",
              },
              {
                time: "2023-06-15T14:35:22Z",
                event: "IP automatically blocked by firewall",
                type: "system",
              },
            ],
            rawData:
              '{"source_ip":"198.51.100.76","destination_ip":"10.0.0.5","port":22,"protocol":"TCP","attempts":35,"timeframe":"180s"}',
            location: {
              country: "Russian Federation",
              city: "Moscow",
              coordinates: [55.7558, 37.6173],
            },
          }}
        />
      )}
    </div>
  );
};

export default Home;
