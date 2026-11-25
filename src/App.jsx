import React, { useEffect, useState } from "react";
import { DEFAULT_MENU, DEFAULT_USERS, FALLBACK_IMG } from "./data";
import User from "./User";
import Manager from "./Manager";

const ORDER_FLOW = [
  "Pending",
  "Accepted",
  "Preparing",
  "Out for Delivery",
  "Delivered"
];

export default function App() {
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("foody_users")) || DEFAULT_USERS;
  });
  const [menuItems, setMenuItems] = useState(() => {
    return JSON.parse(localStorage.getItem("foody_menu")) || DEFAULT_MENU;
  });
  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("foody_orders")) || [];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("foody_current_user")) || null;
  });

  const [authMode, setAuthMode] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("user");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("foody_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("foody_menu", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("foody_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("foody_current_user", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("foody_current_user");
    }
  }, [currentUser]);

  function notify(msg) {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? "" : prev));
    }, 2500);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const cleanUser = loginUsername.trim().toLowerCase();
    const match = users.find(
      (u) => u.username.toLowerCase() === cleanUser && u.password === loginPassword
    );
    if (!match) {
      setLoginError("Invalid username or password. Sign up if you don't have an account.");
      return;
    }
    setLoginError("");
    setSignupSuccess("");
    setLoginUsername("");
    setLoginPassword("");
    setCurrentUser(match);
    notify(`Welcome, ${match.name}!`);
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    const cleanName = signupName.trim();
    const cleanUser = signupUsername.trim().toLowerCase();
    const exists = users.some((u) => u.username.toLowerCase() === cleanUser);

    if (exists) {
      setSignupSuccess("");
      setSignupError("Account already exists.");
      return;
    }

    const created = {
      name: cleanName,
      username: cleanUser,
      password: signupPassword,
      role: signupRole
    };

    setUsers((prev) => [...prev, created]);
    setSignupError("");
    setSignupName("");
    setSignupUsername("");
    setSignupPassword("");
    setSignupRole("user");
    setAuthMode("login");
    setLoginUsername(cleanUser);
    setSignupSuccess("Account created! Please login now.");
    notify("Account created! Please login.");
  }

  function handleLogout() {
    setCurrentUser(null);
    setAuthMode("login");
  }

  function handlePlaceOrder({ items, total, offerUsed, slot }) {
    const newOrder = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      customer: currentUser?.name || "Customer",
      items,
      total,
      offerUsed,
      slot,
      status: "Pending",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setOrders((prev) => [newOrder, ...prev]);
    notify(`Order ${newOrder.id} placed!`);
  }

  function handleAddDish({ name, restaurant, price, image, desc }) {
    setMenuItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        restaurant,
        price,
        image: image || FALLBACK_IMG,
        desc
      }
    ]);
    notify(`Added "${name}"`);
  }

  function handleRemoveDish(id) {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    notify("Dish removed");
  }

  function handleAdvanceOrder(orderId) {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const idx = ORDER_FLOW.indexOf(order.status);
        const nextStatus =
          idx !== -1 && idx < ORDER_FLOW.length - 1
            ? ORDER_FLOW[idx + 1]
            : order.status;
        notify(`${orderId} → ${nextStatus}`);
        return { ...order, status: nextStatus };
      })
    );
  }

  function handleRemoveOrder(orderId) {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    notify(`Order ${orderId} removed`);
  }

  return (
    <>
      {!currentUser ? (
        <section className="login-wrapper">
          <div className="login-card">
            <div className="logo login-logo">
              🍔 Food<span>y</span>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${authMode === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("login");
                  setLoginError("");
                  setSignupError("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-tab ${authMode === "signup" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("signup");
                  setLoginError("");
                  setSignupError("");
                  setSignupSuccess("");
                }}
              >
                Sign Up
              </button>
            </div>

            {authMode === "login" ? (
              <form className="form-group" onSubmit={handleLoginSubmit}>
                <p className="login-subtitle">Enter your username and password to login</p>

                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />

                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />

                {loginError && <p className="error-msg">{loginError}</p>}
                {signupSuccess && <p className="success-msg">{signupSuccess}</p>}

                <button type="submit" className="btn primary-btn">
                  Login
                </button>
              </form>
            ) : (
              <form className="form-group" onSubmit={handleSignupSubmit}>
                <p className="login-subtitle">Create a new account to login</p>

                <label htmlFor="signup-name">Name</label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />

                <label htmlFor="signup-username">Username</label>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="Choose a username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />

                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />

                <label htmlFor="signup-role">Role</label>
                <select
                  id="signup-role"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>

                {signupError && <p className="error-msg">{signupError}</p>}

                <button type="submit" className="btn primary-btn">
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </section>
      ) : (
        <div id="app-shell">
          <header className="navbar">
            <div className="logo">
              🍔 Food<span>y</span>
            </div>
            <div className="nav-right">
              <span className="user-badge">
                {currentUser.name} ({currentUser.role.toUpperCase()})
              </span>
              <button className="btn outline-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <main className="container">
            <div className="account-bar">
              <span>
                <strong>Name:</strong> {currentUser.name}
              </span>
              <span>
                <strong>User:</strong> {currentUser.username}
              </span>
              <span>
                <strong>Password:</strong> {currentUser.password}
              </span>
            </div>

            {currentUser.role === "user" ? (
              <User
                menuItems={menuItems}
                orders={orders}
                currentUser={currentUser}
                onPlaceOrder={handlePlaceOrder}
                notify={notify}
              />
            ) : (
              <Manager
                role={currentUser.role}
                menuItems={menuItems}
                orders={orders}
                onAddDish={handleAddDish}
                onRemoveDish={handleRemoveDish}
                onAdvanceOrder={handleAdvanceOrder}
                onRemoveOrder={handleRemoveOrder}
              />
            )}
          </main>
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </>
  );
}
