import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ArrowUpDown,
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

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

  // Prepare data for Chart.js
  const pieChartData = {
    labels: sortedData.map((item) => item.name),
    datasets: [
      {
        data: sortedData.map((item) => item.count),
        backgroundColor: sortedData.map((item) => item.color),
        borderColor: sortedData.map(() => "#ffffff"),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const barChartData = {
    labels: sortedData.map((item) => item.name),
    datasets: [
      {
        label: "Count",
        data: sortedData.map((item) => item.count),
        backgroundColor: sortedData.map((item) => item.color),
        borderColor: sortedData.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 9,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

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
              <BarChartIcon className="h-4 w-4" />
            ) : (
              <PieChartIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[280px]">
          <div className="relative flex-1 flex items-center justify-center">
            {currentChartType === "pie" ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-48">
                  <Pie data={pieChartData} options={pieOptions as any} />
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <Bar data={barChartData} options={barOptions as any} />
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
