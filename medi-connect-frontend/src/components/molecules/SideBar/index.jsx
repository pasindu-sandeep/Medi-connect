import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "./../../../components/atoms/Botton";
import {
  BarChart3,
  Users,
  Bell,
  LogOut,
  Menu,
  Moon,
  Sun,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "./../../../libs/utill";
import NotificationBell from "./../../../components/molecules/NotificationBell";

export function Sidebar({ className }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) {
      setUserRole(JSON.parse(user).role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href;

    return (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-background border-b p-2 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex items-center gap-2">
          <NotificationBell />
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r p-4 transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-10 mt-4">
            <ShieldAlert className="h-8 w-8 mr-2 text-primary" />
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </div>

          <nav className="space-y-2 flex-1">
            <NavItem
              href="/admin-dashboard"
              icon={BarChart3}
              label="Dashboard"
            />
            <NavItem href="/patients" icon={Bell} label="Patients" />
          </nav>

          <div className="space-y-4 mt-auto">
            <div className="hidden md:block">
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
