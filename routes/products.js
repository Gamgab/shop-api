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
      // on save seulement l'url parmi tout ce que retourne cloudinary uploader
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

// GET ALL PRODUCTS

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// FIND ONE PRODUCT

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// DELETE ONE PRODUCT

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Produit non trouvé ...");

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).send(deletedProduct);

    /* SPPRIMER IMAGE DE CLOUDINARY AVEC UN PUBLIC_ID
    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );
      if (destroyResponse) {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedProduct);
      }
    } else {
      console.log("Action stoppée. Impossible de supprimer l'image...")
    }
    */
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
