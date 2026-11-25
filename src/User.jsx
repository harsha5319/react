import React, { useState } from "react";
import { FALLBACK_IMG, OFFERS } from "./data";

export default function User({ menuItems, orders, currentUser, onPlaceOrder, notify }) {
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [selectedOfferCode, setSelectedOfferCode] = useState("NONE");
  const [deliverySlot, setDeliverySlot] = useState("ASAP (30-40 mins)");
  const [cart, setCart] = useState([]);

  const restaurants = ["all", ...new Set(menuItems.map((item) => item.restaurant))];

  const filteredMenu =
    restaurantFilter === "all"
      ? menuItems
      : menuItems.filter((item) => item.restaurant === restaurantFilter);

  function addToCart(dish) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === dish.id);
      if (existing) {
        return prev.map((c) => (c.id === dish.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...dish, qty: 1 }];
    });
    notify(`${dish.name} added to cart`);
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const selectedOffer = OFFERS.find((o) => o.code === selectedOfferCode) || OFFERS[0];

  let discount = 0;
  if (selectedOffer.discountPercent > 0) {
    if (!selectedOffer.minAmount || subtotal >= selectedOffer.minAmount) {
      discount = Math.round((subtotal * selectedOffer.discountPercent) / 100);
    }
  }

  const total = Math.max(0, subtotal - discount);

  function handleCheckout() {
    if (cart.length === 0) return;
    onPlaceOrder({
      items: cart,
      total,
      offerUsed: discount > 0 ? selectedOffer.code : "NONE",
      slot: deliverySlot
    });
    setCart([]);
    setSelectedOfferCode("NONE");
  }

  return (
    <section className="dashboard">
      <div className="banner-header">
        <div>
          <h2>User Dashboard</h2>
          <p className="subtitle">Browse dishes, check prices & apply offers</p>
        </div>
        <select
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
        >
          {restaurants.map((res) => (
            <option key={res} value={res}>
              {res === "all" ? "All Restaurants" : res}
            </option>
          ))}
        </select>
      </div>

      <div className="offers-bar">
        {OFFERS.filter((o) => o.discountPercent > 0).map((o) => (
          <div key={o.code} className="offer-pill">
            <strong>{o.code}</strong>: {o.label.split("—")[1]}
          </div>
        ))}
      </div>

      <div className="user-layout">
        <div className="menu-grid">
          {filteredMenu.length === 0 ? (
            <p className="empty-msg">No dishes available.</p>
          ) : (
            filteredMenu.map((item) => (
              <div key={item.id} className="menu-card">
                <img
                  className="food-img"
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                <div className="menu-body">
                  <div>
                    <span className="res-tag">{item.restaurant}</span>
                    <h3>{item.name}</h3>
                    <p className="menu-desc">{item.desc}</p>
                  </div>
                  <div className="menu-footer">
                    <span className="price">₹{item.price}</span>
                    <button className="btn add-btn" onClick={() => addToCart(item)}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="sidebar">
          <div className="card">
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p className="empty-msg cart-items">Your cart is empty.</p>
            ) : (
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-row">
                    <div>
                      <strong>{item.name}</strong> × {item.qty}
                      <br />
                      <small className="subtitle">{item.restaurant}</small>
                    </div>
                    <div>
                      <strong>₹{item.price * item.qty}</strong>{" "}
                      <button
                        className="btn danger-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="field-group">
              <label htmlFor="offer-select">Apply Offer</label>
              <select
                id="offer-select"
                value={selectedOfferCode}
                onChange={(e) => setSelectedOfferCode(e.target.value)}
              >
                {OFFERS.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="delivery-time">Delivery Slot</label>
              <select
                id="delivery-time"
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
              >
                <option value="ASAP (30-40 mins)">ASAP (30-40 mins)</option>
                <option value="Today, 1:00 PM">Today, 1:00 PM</option>
                <option value="Today, 8:00 PM">Today, 8:00 PM</option>
                <option value="Tomorrow, 12:30 PM">Tomorrow, 12:30 PM</option>
              </select>
            </div>

            <div className="price-breakdown">
              <div className="row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="row discount-row">
                <span>Offer Discount</span>
                <span>-₹{discount}</span>
              </div>
              <div className="row total-row">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              className="btn primary-btn"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Place Order
            </button>
          </div>

          <div className="card">
            <h3>My Orders ({currentUser?.name})</h3>
            {orders.length === 0 ? (
              <p className="empty-msg">No orders placed yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((o) => (
                  <div key={o.id} className="order-box">
                    <div className="order-top">
                      <span>{o.id}</span>
                      <span className={`badge st-${o.status.split(" ")[0]}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="menu-desc">
                      {o.items.map((i) => `${i.name} (×${i.qty})`).join(", ")}
                    </p>
                    <div className="cart-row" style={{ border: "none", padding: 0 }}>
                      <span className="subtitle">{o.slot}</span>
                      <strong>₹{o.total}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
