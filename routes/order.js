const express = require("express");
const { Order } = require("../models/order");
//const cloudinary = require("../utils/cloudinary");
//const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// SAVE ORDER
// isAdmin est la fonction middleware pour vérifier l'autentification
router.post("/", async (req, res) => {
  const { userId, cartItems, subtotal } = req.body;

  try {
    const order = new Order({
      userId: userId,
      products: cartItems,
      subtotal: subtotal,
    });
    const savedOrder = await order.save();
    console.log("Commande enregistré", savedOrder);
    res.status(200).send(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
/*
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
*/
module.exports = router;
