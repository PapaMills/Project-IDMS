import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Shield,
  AlertTriangle,
  Settings,
  Users,
  Server,
  FileText,
  Home,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activePath?: string;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | null;
}

const Sidebar = ({
  className,
  collapsed = false,
  onToggleCollapse = () => {},
  activePath = "/",
}: SidebarProps) => {
  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      title: "Threats",
      icon: <AlertTriangle className="h-5 w-5" />,
      path: "/threats",
      badge: 12,
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/analytics",
    },
    {
      title: "Systems",
      icon: <Server className="h-5 w-5" />,
      path: "/systems",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/users",
    },
    {
      title: "Reports",
      icon: <FileText className="h-5 w-5" />,
      path: "/reports",
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
    {
      title: "Help",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/help",
    },
  ];

  const renderNavItem = (item: NavItem, index: number) => {
    const isActive = activePath === item.path;

    return (
      <TooltipProvider key={index} delayDuration={collapsed ? 100 : 1000}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                collapsed ? "justify-center" : "justify-start",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">{item.title}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex h-20 items-center justify-center border-b px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">IDMS</h1>
              <p className="text-xs text-muted-foreground">
                Security Dashboard
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">{mainNavItems.map(renderNavItem)}</nav>

        <div className="my-4 mx-2 h-px bg-border" />

        <nav className="grid gap-1 px-2">
          {secondaryNavItems.map(renderNavItem)}
        </nav>
      </div>

      <div className="border-t p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center"
          onClick={onToggleCollapse}
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
