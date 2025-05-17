import React, { useEffect, useState } from "react";
import { getCart } from "../services/cartAPI";
import { placeOrder } from "../services/orderAPI";
import { useLocation, useNavigate } from "react-router-dom";

export default function PickupDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderType = location.state?.orderType || "pre";

  const [cart, setCart] = useState([]);
  const [pickupDetails, setPickupDetails] = useState({
    name: "",
    phone: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setPickupDetails({ ...pickupDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const orderData = {
      username: user.username,
      orderType,
      pickupDetails,
      cart,
    };

    try {
      await placeOrder(orderData);
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order.");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("Rs. ", "")) * item.qty,
    0
  );
  const deliveryCharge = 250;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Pickup Details</h1>

      {/* Cart Summary */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Your Items:</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.sku} className="flex justify-between">
                <span>
                  {item.name} x {item.qty}
                </span>
                <span>{item.price}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-sm">Subtotal: Rs. {subtotal.toFixed(2)}</p>
        <p className="text-sm">
          Delivery Charge: Rs. {deliveryCharge.toFixed(2)}
        </p>
        <p className="font-bold text-md">
          Grand Total: Rs. {grandTotal.toFixed(2)}
        </p>
      </div>

      {/* Pickup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            name="name"
            type="text"
            required
            value={pickupDetails.name}
            onChange={handleChange}
            className="border px-3 py-1 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            name="phone"
            type="tel"
            required
            value={pickupDetails.phone}
            onChange={handleChange}
            className="border px-3 py-1 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Pickup Address</label>
          <textarea
            name="address"
            required
            value={pickupDetails.address}
            onChange={handleChange}
            className="border px-3 py-1 w-full rounded"
          />
        </div>

        {orderType === "pre" && (
          <>
            <h2 className="font-semibold text-lg mt-6">Payment Details</h2>
            <div>
              <label className="block font-medium">Card Number</label>
              <input
                name="cardNumber"
                type="text"
                maxLength={16}
                required
                value={pickupDetails.cardNumber}
                onChange={handleChange}
                className="border px-3 py-1 w-full rounded"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium">Expiry Date</label>
                <input
                  name="expiry"
                  type="text"
                  placeholder="MM/YY"
                  required
                  value={pickupDetails.expiry}
                  onChange={handleChange}
                  className="border px-3 py-1 w-full rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium">CVV</label>
                <input
                  name="cvv"
                  type="password"
                  maxLength={4}
                  required
                  value={pickupDetails.cvv}
                  onChange={handleChange}
                  className="border px-3 py-1 w-full rounded"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
}
