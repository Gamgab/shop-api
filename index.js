const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const productsRoute = require("./routes/products");
const order = require("./routes/order");

const products = require("./products");

require("dotenv").config();

const app = express();

app.use(express.json());

let corsOptions = {
  origin: "http://127.0.0.1:3000",
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Accept",
    "x-auth-token",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/products", productsRoute);
app.use("/api/order", orderRoute);

app.get("/", (req, res) => {
  res.send("Welcome our to online shop API...");
});

app.get("/products", (req, res) => {
  res.send(products);
});

const uri =
  "mongodb+srv://gamgab:shinpoko78@cluster0.fkcfpkx.mongodb.net/e-commerce?retryWrites=true&w=majority";
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
