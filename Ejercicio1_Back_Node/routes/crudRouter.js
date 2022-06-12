const router = require("express").Router();
const auth = require("../middleware/auth"); // Middleware
const crudCtrl = require("../controllers/crudCtrl");

router.post("/createField", auth, crudCtrl.createField);
router.post("/getDataField", auth, crudCtrl.getDataField);
router.put("/editRow/:id", auth, crudCtrl.editRow);
router.put("/softDeleteRow/:id", auth, crudCtrl.softDeleteRow);

module.exports = router;
