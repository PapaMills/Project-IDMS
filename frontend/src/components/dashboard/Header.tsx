import React from "react";
import { Bell, Settings, Shield, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

const Header = ({
  userName = "Admin User",
  userAvatar = "",
  notificationCount = 3,
  onNotificationsClick = () => {},
  onSettingsClick = () => {},
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">IDMS</h1>
            <p className="text-xs text-muted-foreground">
              Intrusion Detection and Monitoring System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationsClick}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      userAvatar ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=security"
                    }
                    alt={userName}
                  />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogoutClick}
                className="text-destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
