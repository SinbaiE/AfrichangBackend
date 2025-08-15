const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kyccontroller"); // attention à la casse
const {auth} = require('../midalwaire/auth.middalwaire')

router.post("/submit",auth, kycController.createKYC);
router.get("/:userId",auth, kycController.getUserKYC);
router.patch("/:id/status",auth, kycController.updateKYCStatus);
router.get("/",auth, kycController.getAllKYCs);

module.exports = router;
