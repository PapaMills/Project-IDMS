import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, ChevronDown, Filter, Search, X } from "lucide-react";

interface FilterState {
  searchQuery: string;
  threatType: string;
  severity: string;
  timeRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sourceIp: string;
  savedFilters: string;
}

interface FilteringSystemProps {
  className?: string;
  onFilterChange: (filters: FilterState) => void;
}

// Sample data for dropdowns
const threatTypes = [
  { value: "all", label: "All Types" },
  { value: "malware", label: "Malware" },
  { value: "phishing", label: "Phishing" },
  { value: "ddos", label: "DDoS" },
  { value: "intrusion", label: "Intrusion" },
  { value: "ransomware", label: "Ransomware" },
];

const severityLevels = [
  { value: "all", label: "All Levels" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const savedFilterPresets = [
  { value: "none", label: "No Preset" },
  { value: "critical-24h", label: "Critical (24h)" },
  { value: "malware-7d", label: "Malware (7 days)" },
  { value: "external-30d", label: "External (30 days)" },
];

const FilteringSystem = ({ className = "", onFilterChange = () => {} }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    threatType: "all",
    severity: "all",
    timeRange: {
      from: undefined,
      to: undefined,
    },
    sourceIp: "",
    savedFilters: "none",
  });

  const [dateOpen, setDateOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTimeRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    const newFilters = { ...filters, timeRange: range };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSavedFilterChange = (preset: string) => {
    // In a real implementation, this would load predefined filter settings
    // For now, we'll just update the savedFilters field
    handleFilterChange("savedFilters", preset);
  };

  const handleReset = () => {
    const resetFilters = {
      searchQuery: "",
      threatType: "all",
      severity: "all",
      timeRange: {
        from: undefined,
        to: undefined,
      },
      sourceIp: "",
      savedFilters: "none",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    setActiveFilters([]);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  return (
    <div
      className={`w-full bg-background p-4 rounded-md border shadow-sm ${className}`}
    >
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threats..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuCheckboxItem
              checked={activeFilters.includes("threatType")}
              onCheckedChange={() => toggleFilter("threatType")}
            >
              Threat Type
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.includes("severity")}
              onCheckedChange={() => toggleFilter("severity")}
            >
              Severity
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.includes("timeRange")}
              onCheckedChange={() => toggleFilter("timeRange")}
            >
              Time Range
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.includes("sourceIp")}
              onCheckedChange={() => toggleFilter("sourceIp")}
            >
              Source IP
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Saved Filter Presets */}
        <Select
          value={filters.savedFilters}
          onValueChange={handleSavedFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saved Filters" />
          </SelectTrigger>
          <SelectContent>
            {savedFilterPresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="ghost"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {activeFilters.includes("threatType") && (
          <div className="flex-shrink-0">
            <Select
              value={filters.threatType}
              onValueChange={(value) => handleFilterChange("threatType", value)}
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Threat Type" />
              </SelectTrigger>
              <SelectContent>
                {threatTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {activeFilters.includes("severity") && (
          <div className="flex-shrink-0">
            <Select
              value={filters.severity}
              onValueChange={(value) => handleFilterChange("severity", value)}
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {activeFilters.includes("timeRange") && (
          <div className="flex-shrink-0">
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 w-[240px] justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.timeRange.from ? (
                    filters.timeRange.to ? (
                      <>
                        {format(filters.timeRange.from, "MMM dd, yyyy")} -{" "}
                        {format(filters.timeRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(filters.timeRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarUI
                  initialFocus
                  mode="range"
                  defaultMonth={filters.timeRange.from}
                  selected={{
                    from: filters.timeRange.from,
                    to: filters.timeRange.to,
                  }}
                  onSelect={(range) => {
                    if (range) {
                      handleTimeRangeChange(range);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {activeFilters.includes("sourceIp") && (
          <div className="flex-shrink-0">
            <Input
              placeholder="Source IP"
              value={filters.sourceIp}
              onChange={(e) => handleFilterChange("sourceIp", e.target.value)}
              className="h-9 w-[160px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format dates
function format(date: Date, formatStr: string): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return formatStr
    .replace("MMM", month)
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("yyyy", year.toString());
}

export default FilteringSystem;
