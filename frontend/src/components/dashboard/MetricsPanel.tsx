import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Shield, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color: "red" | "amber" | "green" | "blue";
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  description = "No description available",
  icon = <Activity size={24} />,
  trend = "neutral",
  trendValue = "0%",
  color = "blue",
}: MetricCardProps) => {
  const colorClasses = {
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const iconColorClasses = {
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  };

  const trendColorClasses = {
    up: "text-red-600",
    down: "text-green-600",
    neutral: "text-gray-600",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <Card className={cn("border", colorClasses[color])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", iconColorClasses[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span className={trendColorClasses[trend]}>
            {trendIcons[trend]} {trendValue}
          </span>
          <span className="text-xs text-gray-500 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsPanelProps {
  activeThreats?: number;
  recentEvents?: number;
  systemStatus?: "operational" | "degraded" | "critical";
  threatLevel?: "low" | "medium" | "high" | "critical";
}

const MetricsPanel = ({
  activeThreats = 12,
  recentEvents = 48,
  systemStatus = "operational",
  threatLevel = "medium",
}: MetricsPanelProps) => {
  // Map system status to color
  const statusColor = {
    operational: "green",
    degraded: "amber",
    critical: "red",
  } as const;

  // Map threat level to color
  const threatColor = {
    low: "green",
    medium: "amber",
    high: "red",
    critical: "red",
  } as const;

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Security Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Threats"
          value={activeThreats}
          description="Detected in last 24h"
          icon={<AlertTriangle size={24} />}
          trend="up"
          trendValue="+8%"
          color="red"
        />

        <MetricCard
          title="Recent Events"
          value={recentEvents}
          description="Logged in last 24h"
          icon={<Activity size={24} />}
          trend="neutral"
          trendValue="+2%"
          color="blue"
        />

        <MetricCard
          title="System Status"
          value={systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
          description="All systems monitored"
          icon={<CheckCircle size={24} />}
          trend="neutral"
          trendValue="Stable"
          color={statusColor[systemStatus]}
        />

        <MetricCard
          title="Threat Level"
          value={threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}
          description="Current security posture"
          icon={<Shield size={24} />}
          trend={threatLevel === "low" ? "down" : "up"}
          trendValue={threatLevel === "low" ? "Reduced" : "Elevated"}
          color={threatColor[threatLevel]}
        />
      </div>
    </div>
  );
};

export default MetricsPanel;
