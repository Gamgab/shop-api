const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");

dotenv.config();
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: "dpugojmo8",
  api_key: "315188255656519",
  api_secret: "k9aLVk4qOK9NWZB_gdCU6cDG660",
});

module.exports = cloudinary;
