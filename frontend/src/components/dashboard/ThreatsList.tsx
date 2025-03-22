import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  Shield,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

interface Threat {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  sourceIP: string;
  timestamp: string;
  status: "active" | "mitigated" | "investigating";
  description: string;
}

interface ThreatsListProps {
  threats?: Threat[];
  onViewDetails?: (threatId: string) => void;
  onFilterChange?: (filters: ThreatsFilter) => void;
}

interface ThreatsFilter {
  type: string | null;
  severity: string | null;
  status: string | null;
  timeRange: string | null;
}

const ThreatsList: React.FC<ThreatsListProps> = ({
  threats = defaultThreats,
  onViewDetails = (id) => console.log(`View details for threat ${id}`),
  onFilterChange = (filters) => console.log("Filter changed:", filters),
}) => {
  const [sortColumn, setSortColumn] = useState<keyof Threat>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<ThreatsFilter>({
    type: null,
    severity: null,
    status: null,
    timeRange: null,
  });

  const handleSort = (column: keyof Threat) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (
    key: keyof ThreatsFilter,
    value: string | null,
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

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
      case "investigating":
        return "secondary";
      case "mitigated":
        return "default";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "medium":
        return <Shield className="h-4 w-4 mr-1" />;
      case "low":
        return <Shield className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Sort threats based on current sort settings
  const sortedThreats = [...threats].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-background rounded-lg border shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detected Threats</h2>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h3 className="font-medium mb-2">Threat Type</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {["All", "Malware", "Intrusion", "DDoS", "Phishing"].map(
                    (type) => (
                      <Badge
                        key={type}
                        variant={
                          filters.type === type ||
                          (type === "All" && !filters.type)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          handleFilterChange(
                            "type",
                            type === "All" ? null : type,
                          )
                        }
                      >
                        {type}
                      </Badge>
                    ),
                  )}
                </div>

                <h3 className="font-medium mb-2 mt-3">Severity</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {["All", "critical", "high", "medium", "low"].map(
                    (severity) => (
                      <Badge
                        key={severity}
                        variant={
                          filters.severity === severity ||
                          (severity === "All" && !filters.severity)
                            ? severity === "All"
                              ? "default"
                              : getSeverityColor(severity)
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          handleFilterChange(
                            "severity",
                            severity === "All" ? null : severity,
                          )
                        }
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Badge>
                    ),
                  )}
                </div>

                <h3 className="font-medium mb-2 mt-3">Status</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {["All", "active", "investigating", "mitigated"].map(
                    (status) => (
                      <Badge
                        key={status}
                        variant={
                          filters.status === status ||
                          (status === "All" && !filters.status)
                            ? status === "All"
                              ? "default"
                              : getStatusColor(status)
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          handleFilterChange(
                            "status",
                            status === "All" ? null : status,
                          )
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    ),
                  )}
                </div>

                <h3 className="font-medium mb-2 mt-3">Time Range</h3>
                <div className="flex flex-wrap gap-1">
                  {["All", "Last 24h", "Last 7d", "Last 30d"].map((range) => (
                    <Badge
                      key={range}
                      variant={
                        filters.timeRange === range ||
                        (range === "All" && !filters.timeRange)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() =>
                        handleFilterChange(
                          "timeRange",
                          range === "All" ? null : range,
                        )
                      }
                    >
                      {range}
                    </Badge>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of detected threats in your system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[180px] cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer"
                onClick={() => handleSort("severity")}
              >
                <div className="flex items-center">
                  Severity
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("sourceIP")}
              >
                <div className="flex items-center">
                  Source IP
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center">
                  Timestamp
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedThreats.length > 0 ? (
              sortedThreats.map((threat) => (
                <TableRow key={threat.id}>
                  <TableCell className="font-medium">{threat.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getSeverityIcon(threat.severity)}
                      <Badge variant={getSeverityColor(threat.severity) as any}>
                        {threat.severity.charAt(0).toUpperCase() +
                          threat.severity.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{threat.sourceIP}</TableCell>
                  <TableCell>
                    {new Date(threat.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(threat.status) as any}>
                      {threat.status.charAt(0).toUpperCase() +
                        threat.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(threat.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewDetails(threat.id)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Mark as Investigating
                          </DropdownMenuItem>
                          <DropdownMenuItem>Mark as Mitigated</DropdownMenuItem>
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No threats found matching the current filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Default mock data
const defaultThreats: Threat[] = [
  {
    id: "1",
    type: "Malware",
    severity: "critical",
    sourceIP: "192.168.1.105",
    timestamp: "2023-07-15T08:30:45Z",
    status: "active",
    description:
      "Ransomware detected on workstation WS-105. File encryption in progress.",
  },
  {
    id: "2",
    type: "Intrusion",
    severity: "high",
    sourceIP: "45.33.22.152",
    timestamp: "2023-07-15T07:15:22Z",
    status: "investigating",
    description:
      "Multiple failed SSH login attempts detected from external IP.",
  },
  {
    id: "3",
    type: "DDoS",
    severity: "medium",
    sourceIP: "78.45.12.67",
    timestamp: "2023-07-14T22:45:10Z",
    status: "mitigated",
    description:
      "Volumetric DDoS attack targeting web server. Traffic filtered.",
  },
  {
    id: "4",
    type: "Phishing",
    severity: "medium",
    sourceIP: "103.25.58.12",
    timestamp: "2023-07-14T16:20:33Z",
    status: "active",
    description: "Phishing campaign detected targeting finance department.",
  },
  {
    id: "5",
    type: "Malware",
    severity: "low",
    sourceIP: "192.168.1.87",
    timestamp: "2023-07-14T11:05:18Z",
    status: "mitigated",
    description: "Potentially unwanted application detected and quarantined.",
  },
  {
    id: "6",
    type: "Intrusion",
    severity: "critical",
    sourceIP: "209.58.128.45",
    timestamp: "2023-07-15T09:12:30Z",
    status: "active",
    description:
      "Possible data exfiltration detected. Large outbound data transfer to unknown IP.",
  },
];

export default ThreatsList;
