import React, { useState } from "react";

export default function Manager({
  role,
  menuItems,
  orders,
  onAddDish,
  onRemoveDish,
  onAdvanceOrder,
  onRemoveOrder
}) {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");

  const isAdmin = role === "admin";

  function handleAddSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !restaurant.trim() || !price || !desc.trim()) return;
    onAddDish({
      name: name.trim(),
      restaurant: restaurant.trim(),
      price: Number(price),
      image: image.trim(),
      desc: desc.trim()
    });
    setName("");
    setRestaurant("");
    setPrice("");
    setImage("");
    setDesc("");
  }

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status !== "Delivered").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <section className="dashboard">
      <div className="banner-header">
        <div>
          <h2>{isAdmin ? "Admin Dashboard" : "Manager Dashboard"}</h2>
          <p className="subtitle">
            {isAdmin
              ? "Order counts & analytics plus full manager controls"
              : "Accept orders, add menu items, and remove items or orders"}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active / Pending Orders</div>
            <div className="stat-value">{activeOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Delivered Orders</div>
            <div className="stat-value">{deliveredOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Order Value</div>
            <div className="stat-value">₹{totalRevenue}</div>
          </div>
        </div>
      )}

      <div className="mgmt-grid">
        <div className="card">
          <h3>{isAdmin ? "All Orders (Accept, Progress & Remove)" : "Accept & Manage Orders"}</h3>
          {orders.length === 0 ? (
            <p className="empty-msg">No orders available.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-box">
                  <div className="order-top">
                    <span>
                      {order.id} • {order.time}
                    </span>
                    <span className={`badge st-${order.status.split(" ")[0]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.88rem" }}>
                    <strong>Items:</strong>{" "}
                    {order.items.map((i) => `${i.name} (×${i.qty})`).join(", ")}
                  </p>
                  <p className="subtitle">
                    Customer: {order.customer} | Slot: {order.slot} |{" "}
                    <strong>₹{order.total}</strong>
                  </p>
                  <div className="btn-row">
                    {order.status === "Pending" && (
                      <button
                        className="btn action-btn"
                        onClick={() => onAdvanceOrder(order.id)}
                      >
                        Accept Order
                      </button>
                    )}
                    {order.status !== "Pending" && order.status !== "Delivered" && (
                      <button
                        className="btn action-btn"
                        onClick={() => onAdvanceOrder(order.id)}
                      >
                        Next Stage
                      </button>
                    )}
                    <button
                      className="btn danger-btn"
                      onClick={() => onRemoveOrder(order.id)}
                    >
                      Remove Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Add New Dish / Menu Item</h3>
          <form className="form-group" onSubmit={handleAddSubmit}>
            <input
              type="text"
              placeholder="Dish Name (e.g., Chicken 65)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Restaurant (e.g., Spice Garden)"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price in ₹ (e.g., 220)"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <input
              type="text"
              placeholder="Short Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            <button type="submit" className="btn primary-btn">
              Add Dish
            </button>
          </form>

          <h3 className="mt-20">Manage / Remove Menu Items</h3>
          {menuItems.length === 0 ? (
            <p className="empty-msg">No menu items.</p>
          ) : (
            <div className="manage-list">
              {menuItems.map((item) => (
                <div key={item.id} className="manage-row">
                  <div>
                    <strong>{item.name}</strong> — ₹{item.price}
                    <br />
                    <small className="subtitle">{item.restaurant}</small>
                  </div>
                  <button
                    className="btn danger-btn"
                    onClick={() => onRemoveDish(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
