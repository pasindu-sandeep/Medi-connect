import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../../components/SliderBar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../components/molecules/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/molecules/Table";
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./../../components/atoms/Avatar";
import { Badge } from "./../../components/atoms/Badge";
import NotificationBell from "./../../components/molecules/NotificationBell";
import DevPanel from "./../../components/molecules/DevPanel";

// Mock data
const studentLogs = [
  {
    id: "STU001",
    name: "John Doe",
    time: "08:30 AM",
    action: "Entry",
    date: "Today",
  },
  {
    id: "STU015",
    name: "Emma Wilson",
    time: "08:45 AM",
    action: "Entry",
    date: "Today",
  },
  {
    id: "STU007",
    name: "Michael Brown",
    time: "09:15 AM",
    action: "Entry",
    date: "Today",
  },
  {
    id: "STU001",
    name: "John Doe",
    time: "04:30 PM",
    action: "Exit",
    date: "Today",
  },
  {
    id: "STU023",
    name: "Sarah Parker",
    time: "08:30 AM",
    action: "Entry",
    date: "Yesterday",
  },
];

const alerts = [
  {
    id: "STU099",
    name: "Unknown Person",
    time: "10:15 AM",
    date: "Today",
    status: "Denied",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU045",
    name: "James Wilson",
    time: "02:30 PM",
    date: "Today",
    status: "Suspended",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU034",
    name: "Lisa Johnson",
    time: "11:45 AM",
    date: "Yesterday",
    status: "Expired ID",
    image: "/placeholder.svg?height=40&width=40",
  },
];

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/admin-dashboard");
      return;
    }

    setUserRole(JSON.parse(user).role);
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Doctors
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">842</div>
              <p className="text-xs text-muted-foreground">+86 since morning</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Appointments Today
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">-3 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Unauthorized Attempts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+3 today</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex w-full mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Highest Appointed Doctor (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Hospital</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          {log.time}
                          <span className="text-xs text-muted-foreground ml-1">
                            {log.date}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.action === "Entry" ? "default" : "secondary"
                          }
                        >
                          {log.action === "Entry" ? (
                            <ArrowRight className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownUp className="mr-1 h-3 w-3" />
                          )}
                          {log.action}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
