import React, { useState, useEffect } from "react";
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
  LineChart,
  ZoomIn,
  ZoomOut,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";

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

  // Simulate chart rendering with canvas
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      renderChart();
    }
  }, [data, timeRange, zoomLevel, isLoading]);

  const renderChart = () => {
    // This would be replaced with actual Chart.js implementation
    const canvas = document.getElementById(
      "threat-pattern-canvas",
    ) as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw mock chart (this is just a placeholder visualization)
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);

        // Draw a line representing the data
        data.forEach((point, index) => {
          const x = (index / (data.length - 1)) * canvas.width;
          // Map the value to the canvas height (inverted, since canvas y=0 is at the top)
          const y = canvas.height - (point.value / 100) * (canvas.height - 60);
          ctx.lineTo(x, y);
        });

        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add data points with different colors based on severity
        data.forEach((point, index) => {
          const x = (index / (data.length - 1)) * canvas.width;
          const y = canvas.height - (point.value / 100) * (canvas.height - 60);

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);

          // Set color based on severity
          switch (point.severity) {
            case "low":
              ctx.fillStyle = "#22c55e"; // green
              break;
            case "medium":
              ctx.fillStyle = "#eab308"; // yellow
              break;
            case "high":
              ctx.fillStyle = "#f97316"; // orange
              break;
            case "critical":
              ctx.fillStyle = "#ef4444"; // red
              break;
            default:
              ctx.fillStyle = "#3b82f6"; // blue
          }

          ctx.fill();
        });
      }
    }
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange(range);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const dataIndex = Math.floor((x / canvas.width) * data.length);

    if (dataIndex >= 0 && dataIndex < data.length) {
      setHoveredPoint(data[dataIndex]);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredPoint(null);
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
                  <LineChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
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
              <>
                <canvas
                  id="threat-pattern-canvas"
                  width="400"
                  height="250"
                  className="w-full h-full"
                  onMouseMove={handleCanvasMouseMove}
                  onMouseLeave={handleCanvasMouseLeave}
                ></canvas>

                {hoveredPoint && (
                  <div className="absolute bg-white p-2 rounded-md shadow-md border text-xs">
                    <p className="font-medium">
                      Time: {new Date(hoveredPoint.timestamp).toLocaleString()}
                    </p>
                    <p>Value: {hoveredPoint.value}</p>
                    <p className="capitalize">
                      Severity:
                      <span
                        className={cn(
                          "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                          hoveredPoint.severity === "low" &&
                            "bg-green-100 text-green-800",
                          hoveredPoint.severity === "medium" &&
                            "bg-yellow-100 text-yellow-800",
                          hoveredPoint.severity === "high" &&
                            "bg-orange-100 text-orange-800",
                          hoveredPoint.severity === "critical" &&
                            "bg-red-100 text-red-800",
                        )}
                      >
                        {hoveredPoint.severity}
                      </span>
                    </p>
                  </div>
                )}
              </>
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
