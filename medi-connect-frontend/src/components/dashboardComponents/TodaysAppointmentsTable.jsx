import React, { useEffect, useState } from "react";
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
import { getAll } from "./../../services/appointmentAPI";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // e.g. "2025-05-08"
        const response = await getAll(today); // pass the date as param
        setAppointments(response);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex w-full mb-6">
      <div className="flex-1 p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No appointments scheduled for today.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time-Slot</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Booking Time</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Docotor Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appt, index) => (
                    <TableRow key={index}>
                      <TableCell>{appt.date}</TableCell>
                      <TableCell>{appt.timeSlot}</TableCell>
                      <TableCell>{appt.hospitalName}</TableCell>
                      <TableCell>{appt.urgency}</TableCell>
                      <TableCell>
                        {new Date(parseInt(appt.bookedAt)).toLocaleString()}
                      </TableCell>
                      <TableCell>{appt.patientName}</TableCell>
                      <TableCell>{appt.doctorName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TodayAppointments;
