import React, { useEffect, useState } from "react";
import Sidebar from "../SideBar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/molecules/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/molecules/Table";
import { getAllOrders } from "../../services/orderAPI";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.username}</TableCell>
                    <TableCell>{order.orderType}</TableCell>
                    <TableCell>{order.pickupDetails?.name}</TableCell>
                    <TableCell>{order.pickupDetails?.phone}</TableCell>
                    <TableCell className="whitespace-pre-wrap max-w-xs">
                      {order.pickupDetails?.address}
                    </TableCell>
                    <TableCell className="text-xs whitespace-pre-wrap max-w-sm">
                      {order.cart
                        ?.map(
                          (item) => `${item.name} x${item.qty} @ ${item.price}`
                        )
                        .join("\n")}
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
}

export default AdminOrdersPage;
