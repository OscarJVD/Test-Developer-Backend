const router = require("express").Router();
const auth = require("../middleware/auth"); // Middleware
const userCtrl = require("../controllers/userCtrl");
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

router.get("/getUser/:id", auth, userCtrl.getUser);
router.post("/setUserName", auth, userCtrl.setUserName);
router.post("/setStory", auth, userCtrl.setStory);
router.post("/profile-upload-single", auth, upload.single("profile-file"), userCtrl.updateAvatar);

module.exports = router;
