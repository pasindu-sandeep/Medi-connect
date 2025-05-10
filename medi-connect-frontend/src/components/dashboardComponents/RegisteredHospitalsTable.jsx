import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import { getHospitalsWithDetails } from "../../services/hospitalInfoAPI";
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

const HospitalTable = () => {
  const [hospitalDetails, sethospitalDetails] = useState([]);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const data = await getHospitalsWithDetails();
        sethospitalDetails(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHospitalDetails();
  }, []);

  return (
    <div className="flex w-full mb-6">
      <div className="flex-1 p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registered Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lab Services</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitalDetails.map((hospital, index) => (
                  <TableRow key={index}>
                    <TableCell>{hospital.hospitalName}</TableCell>
                    <TableCell>{hospital.address}</TableCell>
                    <TableCell>{hospital.contact}</TableCell>
                    <TableCell>
                      {hospital.labServices
                        .map((service) => service.name)
                        .join(", ")}
                    </TableCell>
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

export default HospitalTable;
