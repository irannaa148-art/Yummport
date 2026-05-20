require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));

const Restaurant = mongoose.model("Restaurant", new mongoose.Schema({
  name: String, cuisine: String
}));
const MenuItem = mongoose.model("MenuItem", new mongoose.Schema({
  restaurantId: mongoose.Schema.Types.ObjectId, name: String, price: Number, description: String
}));
const Order = mongoose.model("Order", new mongoose.Schema({
  items: Array, total: Number, users: [String], createdAt: { type: Date, default: Date.now }
}));


app.get("/api/restaurants", async (req, res) => res.json(await Restaurant.find()));
app.get("/api/restaurants/:id/menu", async (req, res) => res.json(await MenuItem.find({ restaurantId: req.params.id })));
app.post("/api/orders", async (req, res) => res.json(await Order.create(req.body)));

const groupCarts = {}; // In-memory cart for demo
app.post("/api/group/:groupId/add", (req, res) => {
  const { item } = req.body;
  const { groupId } = req.params;
  if (!groupCarts[groupId]) groupCarts[groupId] = [];
  groupCarts[groupId].push(item);
  res.json({ cart: groupCarts[groupId] });
});
app.get("/api/group/:groupId/cart", (req, res) => {
  res.json({ cart: groupCarts[req.params.groupId] || [] });
});
app.get("/api/ai/recommend/:userId", async (req, res) => {
  const weather = "hot"; // mock
  if (weather === "hot") {
    res.json([{ name: "Cold Coffee", price: 120 }]);
  } else {
    res.json([{ name: "Tomato Soup", price: 80 }]);
  }
});
app.post("/api/payment", (req, res) => {
  const { total } = req.body;
  res.json({ status: "success", message: `Paid ₹${total}` });
});

app.listen(process.env.PORT || 4000, () => console.log("Server running"));
