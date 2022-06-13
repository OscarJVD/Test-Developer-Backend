const router = require("express").Router();
const auth = require("../middleware/auth"); // Middleware
const crudCtrl = require("../controllers/crudCtrl");
const multer = require("multer");
const fs = require("fs");
// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer setup
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage });

router.post("/createField", auth, upload.any(), crudCtrl.createField);
router.post("/getDataField", auth, crudCtrl.getDataField);
router.put("/editRow/:id", auth, crudCtrl.editRow);
router.put("/softDeleteRow/:id", auth, crudCtrl.softDeleteRow);

module.exports = router;
