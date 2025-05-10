import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import { getDoctorsWithDetails } from "../../services/doctorInfoAPI";
import { Card, CardContent, CardHeader, CardTitle } from "../molecules/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../molecules/Table";
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
} from "lucide-react";
import { Badge } from "../atoms/Badge";

const DoctorsTable = () => {
  const [doctorDetails, setdoctorDetails] = useState([]);

  useEffect(() => {
    const fetchDpctorDetails = async () => {
      try {
        const data = await getDoctorsWithDetails();
        setdoctorDetails(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDpctorDetails();
  }, []);

  return (
    <div className="flex w-full mb-6">
      <div className="flex-1 p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registered Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Availability</TableHead>{" "}
                    {/* One cell for all days */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorDetails.map((entry, index) => {
                    const doctor = entry.doctor;
                    const availability = entry.availability;
                    const days = [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ];

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={doctor.profilePicture}
                              alt={doctor.name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <span className="text-sm truncate">
                              {doctor.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{doctor.Specialization}</TableCell>
                        <TableCell>{doctor.phoneNumber}</TableCell>
                        <TableCell>
                          <table
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                            }}
                          >
                            <thead>
                              <tr>
                                {days.map((day) => (
                                  <th
                                    key={day}
                                    style={{
                                      padding: "4px",
                                      textAlign: "center",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {day}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {days.map((day) => (
                                  <td
                                    key={day}
                                    style={{
                                      padding: "4px",
                                      verticalAlign: "top",
                                      fontSize: "12px",
                                      textAlign: "left",
                                      minWidth: "200px",
                                    }}
                                  >
                                    {availability[day] &&
                                    availability[day].length > 0 ? (
                                      <ul
                                        style={{
                                          paddingLeft: "1rem",
                                          margin: 0,
                                        }}
                                      >
                                        {availability[day].map((slot, i) => (
                                          <li key={i}>
                                            {slot.hospitalName} ({slot.timeSlot}
                                            )
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span style={{ color: "#aaa" }}>–</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorsTable;
