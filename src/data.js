export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220">
      <rect width="400" height="220" fill="#ffeae0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ff5200" font-size="22" font-family="Arial, sans-serif" font-weight="bold">Foody Dish</text>
    </svg>
  `);

export const DEFAULT_USERS = [
  { name: "Rohan", username: "user", password: "user123", role: "user" },
  { name: "Kavya", username: "manager", password: "manager123", role: "manager" },
  { name: "Vikram", username: "admin", password: "admin123", role: "admin" }
];

export const DEFAULT_MENU = [
  {
    id: 1,
    name: "Hyderabadi Chicken Biryani",
    restaurant: "Spice Garden",
    price: 280,
    desc: "Aromatic basmati rice layered with spiced chicken and saffron.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    restaurant: "Spice Garden",
    price: 240,
    desc: "Soft paneer cubes in a rich, creamy tomato gravy.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 3,
    name: "Classic Cheeseburger",
    restaurant: "Burger Hub",
    price: 199,
    desc: "Grilled patty with melted cheese, lettuce, and house sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 4,
    name: "Peri-Peri Fries",
    restaurant: "Burger Hub",
    price: 110,
    desc: "Crispy golden fries tossed with spicy peri-peri seasoning.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 5,
    name: "Margherita Pizza",
    restaurant: "Italiano Pizza",
    price: 320,
    desc: "Wood-fired crust topped with mozzarella, tomato sauce, and basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=70"
  }
];

export const OFFERS = [
  { code: "NONE", label: "No Offer Applied", discountPercent: 0 },
  { code: "BITE10", label: "BITE10 — 10% Off on your order", discountPercent: 10 },
  { code: "FEAST20", label: "FEAST20 — 20% Off above ₹400", discountPercent: 20, minAmount: 400 }
];
