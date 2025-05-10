import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import { getPatientsListWithDetails } from "../../services/patientAPI";
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

const PatientsTable = () => {
  const [patientDetails, setpatientDetails] = useState([]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const data = await getPatientsListWithDetails();
        setpatientDetails(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatientDetails();
  }, []);

  return (
    <div className="flex w-full mb-6">
      <div className="flex-1 p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registered Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientDetails.map((patient, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <img
                          src={`data:image/jpeg;base64,${patient.profilePicture}`}
                          alt={patient.nameWithInitials}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <span>{patient.nameWithInitials}</span>
                      </div>
                    </TableCell>

                    <TableCell>{patient.address}</TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientsTable;
