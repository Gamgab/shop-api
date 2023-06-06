const express = require("express");
const { User } = require("../models/user");
const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

// GET USERS
router.get("/", isAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(4)
      : await User.find().sort({ _id: -1 });

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ONE USER
/*
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.user._id !== user.userId || !req.user.isAdmin)
      return res.status(403).send("Accès interdit. Non autorisé ...");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
*/

// EDIT USER
/*
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
module.exports = router;
