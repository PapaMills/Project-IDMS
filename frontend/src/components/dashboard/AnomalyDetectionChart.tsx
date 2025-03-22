import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AlertCircle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(LinearScale, PointElement, LineElement, ChartTooltip, Legend);

interface AnomalyEvent {
  id: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  sourceIp: string;
}

interface AnomalyDetectionChartProps {
  data?: AnomalyEvent[];
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const AnomalyDetectionChart = ({
  data = [
    {
      id: "1",
      timestamp: "2023-06-01T08:30:00",
      severity: "low",
      description: "Unusual login attempt detected",
      sourceIp: "192.168.1.105",
    },
    {
      id: "2",
      timestamp: "2023-06-01T09:45:00",
      severity: "medium",
      description: "Multiple failed authentication attempts",
      sourceIp: "192.168.1.120",
    },
    {
      id: "3",
      timestamp: "2023-06-01T11:15:00",
      severity: "high",
      description: "Potential data exfiltration detected",
      sourceIp: "192.168.1.130",
    },
    {
      id: "4",
      timestamp: "2023-06-01T14:20:00",
      severity: "critical",
      description: "Unauthorized access to sensitive data",
      sourceIp: "192.168.1.140",
    },
    {
      id: "5",
      timestamp: "2023-06-01T16:05:00",
      severity: "medium",
      description: "Unusual network traffic pattern",
      sourceIp: "192.168.1.115",
    },
    {
      id: "6",
      timestamp: "2023-06-01T17:30:00",
      severity: "low",
      description: "Anomalous process execution",
      sourceIp: "192.168.1.125",
    },
    {
      id: "7",
      timestamp: "2023-06-01T19:45:00",
      severity: "high",
      description: "Suspicious file modification activity",
      sourceIp: "192.168.1.135",
    },
  ],
  title = "Anomaly Detection Timeline",
  description = "Timeline of detected anomalies with severity indicators",
  onRefresh = () => console.log("Refreshing anomaly data"),
}: AnomalyDetectionChartProps) => {
  const [selectedEvent, setSelectedEvent] = useState<AnomalyEvent | null>(null);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>(null);

  // Format the timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get color based on severity
  const getSeverityColor = (severity: AnomalyEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
  };

  // Get text color based on severity
  const getSeverityTextColor = (severity: AnomalyEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  // Get severity value for chart
  const getSeverityValue = (severity: AnomalyEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return 4;
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  // Get color for chart points
  const getSeverityPointColor = (severity: AnomalyEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return "rgb(220, 38, 38)";
      case "high":
        return "rgb(249, 115, 22)";
      case "medium":
        return "rgb(234, 179, 8)";
      case "low":
        return "rgb(59, 130, 246)";
      default:
        return "rgb(156, 163, 175)";
    }
  };

  // Prepare chart data
  useEffect(() => {
    if (data.length > 0) {
      const chartDatasets = {
        datasets: [
          {
            label: "Anomaly Events",
            data: data.map((event) => ({
              x: new Date(event.timestamp).getTime(),
              y: getSeverityValue(event.severity),
              description: event.description,
              sourceIp: event.sourceIp,
              severity: event.severity,
              id: event.id,
            })),
            backgroundColor: data.map((event) =>
              getSeverityPointColor(event.severity),
            ),
            pointRadius: 8,
            pointHoverRadius: 12,
          },
        ],
      };
      setChartData(chartDatasets);
    }
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          callback: function (value: any) {
            const date = new Date(value);
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Severity",
        },
        ticks: {
          callback: function (value: any) {
            switch (value) {
              case 1:
                return "Low";
              case 2:
                return "Medium";
              case 3:
                return "High";
              case 4:
                return "Critical";
              default:
                return "";
            }
          },
        },
        min: 0.5,
        max: 4.5,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const point = context.raw;
            return [
              `Severity: ${point.severity.charAt(0).toUpperCase() + point.severity.slice(1)}`,
              `Description: ${point.description}`,
              `Source IP: ${point.sourceIp}`,
              `Time: ${new Date(point.x).toLocaleString()}`,
            ];
          },
        },
      },
      legend: {
        display: false,
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const dataPoint = data[index];
        setSelectedEvent(dataPoint);
      }
    },
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
            >
              {showChart ? "Show Timeline" : "Show Chart"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Info size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showChart && chartData ? (
          <div className="h-[280px] w-full">
            <Scatter data={chartData} options={chartOptions as any} />
          </div>
        ) : (
          <div className="relative">
            {/* Timeline axis */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline events */}
            <div className="space-y-6 pl-12 pr-4 py-2 max-h-[280px] overflow-y-auto">
              {data.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "relative p-3 rounded-lg border transition-all",
                    selectedEvent?.id === event.id
                      ? "border-primary shadow-sm"
                      : "border-gray-200",
                    "hover:border-gray-300 cursor-pointer",
                  )}
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-2.5rem] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        getSeverityColor(event.severity),
                      )}
                    ></div>
                  </div>

                  {/* Time */}
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {formatTime(event.timestamp)}
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{event.description}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Source: {event.sourceIp}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        getSeverityTextColor(event.severity),
                      )}
                    >
                      {event.severity.charAt(0).toUpperCase() +
                        event.severity.slice(1)}
                    </div>
                  </div>

                  {/* Severity indicator for critical and high */}
                  {(event.severity === "critical" ||
                    event.severity === "high") && (
                    <div className="absolute right-2 top-2">
                      <AlertCircle
                        size={16}
                        className={cn(
                          event.severity === "critical"
                            ? "text-red-600"
                            : "text-orange-500",
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-end space-x-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
            <span>Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDetectionChart;
