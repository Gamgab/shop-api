const express = require("express");
const { Product } = require("../models/product");
const cloudinary = require("../utils/cloudinary");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// CREATE PRODUCT
// isAdmin est la fonction middleware pour vérifier l'autentification
router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, image } = req.body;

  try {
    if (image) {
      const { url } = await cloudinary.uploader.upload(image, {
        /*const uploadRes = await cloudinary.uploader.upload(image, {*/
        upload_preset: "onlineShop",
      });
      //console.log(uploadRes);

      if (/*uploadRes*/ url) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          image: url,
        });
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
