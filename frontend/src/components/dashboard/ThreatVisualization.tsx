import React, { useState } from "react";
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
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
} from "lucide-react";

// Import chart components
import ThreatPatternChart from "./charts/ThreatPatternChart";
import AttackVectorsChart from "./charts/AttackVectorsChart";
import AnomalyDetectionChart from "./charts/AnomalyDetectionChart";

interface ThreatVisualizationProps {
  isLoading?: boolean;
  onRefresh?: () => void;
}

const ThreatVisualization = ({
  isLoading = false,
  onRefresh = () => console.log("Refreshing visualization data"),
}: ThreatVisualizationProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              Threat Visualization
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Interactive visualization of security threats and anomalies
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh visualization data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export visualization data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              All Charts
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="vectors" className="flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Vectors
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Anomalies
            </TabsTrigger>
          </TabsList>

          {/* All Charts View */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ThreatPatternChart isLoading={isLoading} onRefresh={onRefresh} />
              <AttackVectorsChart />
              <AnomalyDetectionChart />
            </div>
          </TabsContent>

          {/* Individual Chart Views */}
          <TabsContent value="patterns">
            <div className="max-w-4xl mx-auto">
              <ThreatPatternChart
                isLoading={isLoading}
                onRefresh={onRefresh}
                title="Detailed Threat Patterns Analysis"
                description="Comprehensive visualization of threat patterns detected in the system over time"
              />
            </div>
          </TabsContent>

          <TabsContent value="vectors">
            <div className="max-w-4xl mx-auto">
              <AttackVectorsChart
                title="Attack Vectors Distribution Analysis"
                description="Detailed breakdown of attack vectors by type and frequency"
              />
            </div>
          </TabsContent>

          <TabsContent value="anomalies">
            <div className="max-w-4xl mx-auto">
              <AnomalyDetectionChart
                title="Anomaly Detection Timeline Analysis"
                description="Comprehensive timeline of detected anomalies with detailed severity indicators"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend and information */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="text-sm text-muted-foreground">
              <p>
                Visualization data is updated every 5 minutes. Last updated:{" "}
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <Button variant="link" size="sm" className="text-sm p-0">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatVisualization;
