import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  LineChart as LineChartIcon,
  ZoomIn,
  ZoomOut,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
);

interface DataPoint {
  timestamp: string;
  value: number;
  severity: "low" | "medium" | "high" | "critical";
}

interface ThreatPatternChartProps {
  data?: DataPoint[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onTimeRangeChange?: (range: string) => void;
}

const ThreatPatternChart = ({
  data = generateMockData(),
  title = "Threat Patterns Over Time",
  description = "Visualization of threat patterns detected in the system",
  isLoading = false,
  onRefresh = () => console.log("Refresh data"),
  onTimeRangeChange = (range) => console.log(`Time range changed to ${range}`),
}: ThreatPatternChartProps) => {
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const chartRef = useRef<ChartJS>(null);

  // Prepare data for Chart.js
  const chartData = {
    labels: data.map((point) => {
      const date = new Date(point.timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Threat Level",
        data: data.map((point) => point.value),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: data.map((point) => {
          switch (point.severity) {
            case "low":
              return "#22c55e"; // green
            case "medium":
              return "#eab308"; // yellow
            case "high":
              return "#f97316"; // orange
            case "critical":
              return "#ef4444"; // red
            default:
              return "#3b82f6"; // blue
          }
        }),
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const point = data[context.dataIndex];
            return [
              `Value: ${point.value}`,
              `Severity: ${point.severity.charAt(0).toUpperCase() + point.severity.slice(1)}`,
              `Time: ${new Date(point.timestamp).toLocaleString()}`,
            ];
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange(range);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.zoom(1.2);
      chart.update();
    }
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.zoom(0.8);
      chart.update();
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Chart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="24h" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 w-[300px]">
            <TabsTrigger
              value="1h"
              onClick={() => handleTimeRangeChange("1h")}
              className={cn(timeRange === "1h" ? "font-medium" : "")}
            >
              1H
            </TabsTrigger>
            <TabsTrigger
              value="24h"
              onClick={() => handleTimeRangeChange("24h")}
              className={cn(timeRange === "24h" ? "font-medium" : "")}
            >
              24H
            </TabsTrigger>
            <TabsTrigger
              value="7d"
              onClick={() => handleTimeRangeChange("7d")}
              className={cn(timeRange === "7d" ? "font-medium" : "")}
            >
              7D
            </TabsTrigger>
            <TabsTrigger
              value="30d"
              onClick={() => handleTimeRangeChange("30d")}
              className={cn(timeRange === "30d" ? "font-medium" : "")}
            >
              30D
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full h-[250px] border rounded-md p-2">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading chart data...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <LineChartIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No threat data available
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={onRefresh}
                  >
                    Refresh Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <Line
                  data={chartData}
                  options={chartOptions as any}
                  ref={chartRef}
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-orange-500 mr-1"></span>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-xs">Critical</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              Custom Range
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to generate mock data
function generateMockData(): DataPoint[] {
  const severityLevels: Array<"low" | "medium" | "high" | "critical"> = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  const now = new Date();
  const data: DataPoint[] = [];

  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(
      now.getTime() - (23 - i) * 60 * 60 * 1000,
    ).toISOString();
    const value = Math.floor(Math.random() * 80) + 10; // Random value between 10 and 90
    const severityIndex = Math.floor(Math.random() * 4);

    data.push({
      timestamp,
      value,
      severity: severityLevels[severityIndex],
    });
  }

  return data;
}

export default ThreatPatternChart;
