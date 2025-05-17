import React, { useEffect, useState } from "react";
import { getCart, addToCart, deleteCartItem } from "../services/cartAPI";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("pre");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleQtyChange = async (sku, qty) => {
    const updatedItem = cart.find((item) => item.sku === sku);
    if (!updatedItem) return;

    const updatedCart = cart.map((item) =>
      item.sku === sku ? { ...item, qty } : item
    );
    setCart(updatedCart);

    try {
      await addToCart({ ...updatedItem, qty });
    } catch (error) {
      alert("Failed to update quantity.");
    }
  };

  const handleRemove = async (sku) => {
    try {
      await deleteCartItem(sku);
      setCart(cart.filter((item) => item.sku !== sku));
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("Rs. ", "")) * item.qty,
    0
  );

  const handleOrder = () => {
    navigate("/pickup", {
      state: { orderType },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.sku}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain border rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>
                    Qty:
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleQtyChange(item.sku, Number(e.target.value))
                      }
                      className="w-16 ml-2 border px-1"
                    />
                  </p>
                  <p className="text-sm text-gray-500">{item.price}</p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.sku)}
                className="text-red-600 hover:underline"
              >
                Remove From Cart
              </button>
            </div>
          ))}

          <div className="mt-6">
            <p className="text-md">Subtotal: Rs. {total.toFixed(2)}</p>
            <p className="text-md">Delivery Charge: Rs. 250.00</p>
            <p className="font-bold text-lg">
              Grand Total: Rs. {(total + 250).toFixed(2)}
            </p>

            <div className="mt-2">
              <label>
                <input
                  type="radio"
                  value="pre"
                  checked={orderType === "pre"}
                  onChange={() => setOrderType("pre")}
                />
                <span className="ml-2">Pre-Order</span>
              </label>
              <label className="ml-6">
                <input
                  type="radio"
                  value="post"
                  checked={orderType === "post"}
                  onChange={() => setOrderType("post")}
                />
                <span className="ml-2">Post-Order</span>
              </label>
            </div>
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
