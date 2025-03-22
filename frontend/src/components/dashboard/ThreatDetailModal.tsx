import React from "react";
import {
  Shield,
  AlertTriangle,
  Clock,
  MapPin,
  Server,
  Activity,
  FileText,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ThreatDetailProps {
  isOpen?: boolean;
  onClose?: () => void;
  threatData?: ThreatData;
}

interface ThreatData {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "mitigated" | "investigating";
  sourceIp: string;
  destinationIp: string;
  timestamp: string;
  attackVector: string;
  affectedSystems: string[];
  timeline: TimelineEvent[];
  rawData: string;
  location?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
}

interface TimelineEvent {
  time: string;
  event: string;
  type: "detection" | "system" | "user";
}

const ThreatDetailModal: React.FC<ThreatDetailProps> = ({
  isOpen = true,
  onClose = () => {},
  threatData = {
    id: "THR-2023-06-15-001",
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
  },
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "destructive";
      case "mitigated":
        return "default";
      case "investigating":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "detection":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "system":
        return <Server className="h-4 w-4 text-blue-500" />;
      case "user":
        return <Activity className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              <DialogTitle className="text-xl">{threatData.title}</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant={getSeverityColor(threatData.severity)}>
                {threatData.severity.toUpperCase()}
              </Badge>
              <Badge variant={getStatusColor(threatData.status)}>
                {threatData.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            ID: {threatData.id} • Detected:{" "}
            {new Date(threatData.timestamp).toLocaleString()}
          </p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
            <TabsTrigger value="remediation">Remediation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Threat Details
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {threatData.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Attack Vector:</span>
                    <span className="font-medium">
                      {threatData.attackVector}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Affected Systems:</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {threatData.affectedSystems.map((system, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Server className="h-4 w-4" /> Network Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Source IP:</span>
                    <span className="font-medium">{threatData.sourceIp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Destination IP:</span>
                    <span className="font-medium">
                      {threatData.destinationIp}
                    </span>
                  </div>
                  {threatData.location && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {threatData.location.city},{" "}
                        {threatData.location.country}
                      </span>
                    </div>
                  )}
                </div>

                {/* Placeholder for a small map visualization */}
                <div className="mt-4 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Map visualization placeholder
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-4">Event Timeline</h3>
              <div className="space-y-4">
                {threatData.timeline.map((event, index) => (
                  <div
                    key={index}
                    className="relative pl-6 pb-4 border-l border-gray-200 last:pb-0"
                  >
                    <div className="absolute left-0 top-0 -translate-x-1/2 bg-white p-1">
                      {getTimelineIcon(event.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.event}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Raw Event Data
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(JSON.parse(threatData.rawData), null, 2)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="remediation" className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Recommended Actions</h3>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Block Source IP</p>
                    <p className="text-sm text-gray-600">
                      Add the source IP to your firewall blocklist to prevent
                      further access attempts.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Review Authentication Logs</p>
                    <p className="text-sm text-gray-600">
                      Check for any successful logins from this IP address and
                      review account activity.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Update SSH Configuration</p>
                    <p className="text-sm text-gray-600">
                      Consider implementing key-based authentication and
                      disabling password authentication.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" /> Export Report
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm">
              <XCircle className="h-4 w-4 mr-1" /> Block IP
            </Button>
            <Button size="sm">
              <ArrowUpRight className="h-4 w-4 mr-1" /> Investigate
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThreatDetailModal;
