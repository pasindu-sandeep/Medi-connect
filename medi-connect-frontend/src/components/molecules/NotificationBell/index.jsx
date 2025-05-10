import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./../../../components/atoms/Botton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../../../components/molecules/DropDown";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./../../../components/atoms/Avatar";
import { Badge } from "./../../../components/atoms/Badge";

// Updated mock notifications to include ID mismatch
const initialNotifications = [
  {
    id: 1,
    title: "Unauthorized Access",
    description: "Unknown person tried to enter through Gate B",
    time: "Just now",
    read: false,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    title: "Suspended Student",
    description: "James Wilson (STU045) tried to enter the campus",
    time: "5 minutes ago",
    read: false,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    title: "ID Mismatch Detected",
    description: "Face recognized as Michael Brown but used Emma Wilson's ID",
    time: "10 minutes ago",
    read: false,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    title: "System Alert",
    description: "Gate C camera is offline",
    time: "1 hour ago",
    read: true,
    image: null,
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Use window.location.href for hard refresh
  const viewAllAlerts = () => {
    window.location.href = "/alerts"; // Hard refresh
    setOpen(false);
  };

  const viewAlertDetails = (id) => {
    markAsRead(id);
    window.location.href = "/alerts"; // Hard refresh to alerts page
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto text-xs p-0"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start gap-4 p-3 cursor-pointer ${
                notification.read ? "opacity-70" : "font-medium"
              }`}
              onClick={() => viewAlertDetails(notification.id)}
            >
              {notification.image ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={notification.image} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <Bell className="h-4 w-4" />
                </div>
              )}
              <div className="grid gap-1">
                <div className="text-sm">{notification.title}</div>
                <div className="text-xs text-muted-foreground">
                  {notification.description}
                </div>
                <div className="text-xs text-muted-foreground">
                  {notification.time}
                </div>
              </div>
              {!notification.read && (
                <div className="ml-auto h-2 w-2 rounded-full bg-destructive" />
              )}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center cursor-pointer"
          onClick={viewAllAlerts}
        >
          View all alerts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
