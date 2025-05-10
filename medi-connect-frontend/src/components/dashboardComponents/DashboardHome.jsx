import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
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
import { Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import {
  getAppointmentCountByDoctor,
  getSystemStats,
} from "./../../services/appointmentAPI";
function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState(null);
  const [doctorCounts, setDoctorCounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [doctorData, systemStats] = await Promise.all([
          getAppointmentCountByDoctor(),
          getSystemStats(),
        ]);
        setDoctorCounts(doctorData);
        setStats(systemStats);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/admin-dashboard");
      return;
    }

    setUserRole(JSON.parse(user).role);
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
              <div className="text-2xl font-bold">{stats?.patients ?? 0}</div>
              <p className="text-xs text-muted-foreground">Updated now</p>
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
              <div className="text-2xl font-bold">{stats?.doctors ?? 0}</div>
              <p className="text-xs text-muted-foreground">Updated now</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Appointments
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.appointments ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Updated now</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Hospitals
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.hospitals ?? 0}</div>
              <p className="text-xs text-muted-foreground">Updated now</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex w-full mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Appointed Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor name</TableHead>
                    <TableHead>Number of Appointments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorCounts.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell>{doc.doctorName}</TableCell>
                      <TableCell>{doc.appointmentCount}</TableCell>
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

export default DashboardHome;
