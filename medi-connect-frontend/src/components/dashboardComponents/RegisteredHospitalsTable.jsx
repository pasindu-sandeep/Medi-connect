import React, { useEffect, useState } from "react";
import {
  getHospitalsWithDetails,
  deleteHospital,
} from "../../services/hospitalInfoAPI";
import Sidebar from "../SideBar";
import { Card, CardContent, CardHeader, CardTitle } from "../molecules/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../molecules/Table";
import { Trash2 } from "lucide-react";

const HospitalTable = () => {
  const [hospitalDetails, setHospitalDetails] = useState([]);

  const fetchHospitalDetails = async () => {
    try {
      const data = await getHospitalsWithDetails();
      setHospitalDetails(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHospitalDetails();
  }, []);

  const handleDelete = async (hospitalName) => {
    const confirmed = window.confirm(`Delete hospital "${hospitalName}"?`);
    if (!confirmed) return;

    try {
      await deleteHospital(hospitalName);
      alert("Hospital deleted successfully.");
      fetchHospitalDetails(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete hospital.");
    }
  };

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
                  <TableHead className="w-10">Delete</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lab Services</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitalDetails.map((hospital, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(hospital.hospitalName)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete hospital"
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                    <TableCell>{hospital.hospitalName}</TableCell>
                    <TableCell>{hospital.address}</TableCell>
                    <TableCell>{hospital.contact}</TableCell>
                    <TableCell>
                      {hospital.labServices.map((s) => s.name).join(", ")}
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
