import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PieChart, BarChart, ArrowUpDown } from "lucide-react";

interface AttackVector {
  name: string;
  count: number;
  color: string;
}

interface AttackVectorsChartProps {
  data?: AttackVector[];
  title?: string;
  description?: string;
  chartType?: "pie" | "bar";
}

const defaultAttackVectors: AttackVector[] = [
  { name: "SQL Injection", count: 42, color: "#FF6384" },
  { name: "XSS", count: 28, color: "#36A2EB" },
  { name: "Brute Force", count: 19, color: "#FFCE56" },
  { name: "DDoS", count: 14, color: "#4BC0C0" },
  { name: "Malware", count: 9, color: "#9966FF" },
  { name: "Other", count: 7, color: "#FF9F40" },
];

const AttackVectorsChart = ({
  data = defaultAttackVectors,
  title = "Attack Vectors Distribution",
  description = "Distribution of attack vectors detected in the system",
  chartType = "pie",
}: AttackVectorsChartProps) => {
  const [chartData, setChartData] = useState<AttackVector[]>(data);
  const [currentChartType, setCurrentChartType] = useState<"pie" | "bar">(
    chartType,
  );
  const [sortBy, setSortBy] = useState<"name" | "count">("count");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setChartData(data);
  }, [data]);

  const toggleChartType = () => {
    setCurrentChartType(currentChartType === "pie" ? "bar" : "pie");
  };

  const toggleSort = () => {
    if (sortBy === "count") {
      setSortBy("name");
      setSortDirection("asc");
    } else {
      setSortBy("count");
      setSortDirection("desc");
    }
  };

  const sortedData = [...chartData].sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === "asc" ? a.count - b.count : b.count - a.count;
    }
  });

  const total = sortedData.reduce((sum, item) => sum + item.count, 0);

  // Calculate percentages and angles for pie chart
  const calculatePieSegments = () => {
    let startAngle = 0;
    return sortedData.map((item) => {
      const percentage = (item.count / total) * 100;
      const angle = (percentage / 100) * 360;
      const segment = {
        ...item,
        percentage,
        startAngle,
        endAngle: startAngle + angle,
      };
      startAngle += angle;
      return segment;
    });
  };

  const pieSegments = calculatePieSegments();
  const maxCount = Math.max(...sortedData.map((item) => item.count));

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleSort}
            className="p-1 rounded-md hover:bg-gray-100"
            title={`Sort by ${sortBy === "name" ? "count" : "name"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <button
            onClick={toggleChartType}
            className="p-1 rounded-md hover:bg-gray-100"
            title={`Switch to ${currentChartType === "pie" ? "bar" : "pie"} chart`}
          >
            {currentChartType === "pie" ? (
              <BarChart className="h-4 w-4" />
            ) : (
              <PieChart className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[280px]">
          <div className="relative flex-1 flex items-center justify-center">
            {currentChartType === "pie" ? (
              <div className="relative w-48 h-48">
                {/* Pie Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {pieSegments.map((segment, index) => {
                    const x1 =
                      50 + 40 * Math.cos((segment.startAngle * Math.PI) / 180);
                    const y1 =
                      50 + 40 * Math.sin((segment.startAngle * Math.PI) / 180);
                    const x2 =
                      50 + 40 * Math.cos((segment.endAngle * Math.PI) / 180);
                    const y2 =
                      50 + 40 * Math.sin((segment.endAngle * Math.PI) / 180);
                    const largeArcFlag =
                      segment.endAngle - segment.startAngle > 180 ? 1 : 0;

                    return (
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="white"
                        strokeWidth="1"
                        className="hover:opacity-80 cursor-pointer transition-opacity"
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
              </div>
            ) : (
              <div className="w-full h-full flex items-end space-x-2 pt-4 pb-2">
                {/* Bar Chart */}
                {sortedData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-full rounded-t-sm transition-all duration-500 ease-in-out"
                      style={{
                        height: `${(item.count / maxCount) * 200}px`,
                        backgroundColor: item.color,
                      }}
                      title={`${item.name}: ${item.count} (${((item.count / total) * 100).toFixed(1)}%)`}
                    />
                    <span className="text-xs mt-1 truncate w-full text-center">
                      {item.name.length > 6
                        ? `${item.name.substring(0, 6)}...`
                        : item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sortedData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs truncate">{item.name}</span>
                <span className="text-xs ml-auto font-medium">
                  {((item.count / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackVectorsChart;
