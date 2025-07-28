const express = require("express")
const multer = require("multer")
const auth = require("../middleware/auth")
const ProfileController = require("../controllers/ProfileController")

const router = express.Router()

// Configure multer for avatar upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Validation rules
const settingsValidation = [
  body("notifications").optional().isObject().withMessage("Paramètres de notifications invalides"),
  body("security").optional().isObject().withMessage("Paramètres de sécurité invalides"),
  body("privacy").optional().isObject().withMessage("Paramètres de confidentialité invalides"),
  body("preferences").optional().isObject().withMessage("Préférences invalides"),
]

// Routes
router.get("/stats", auth, ProfileController.getProfileStats)
router.get("/settings", auth, ProfileController.getUserSettings)
router.put("/settings", auth, settingsValidation, ProfileController.updateUserSettings)
router.post("/avatar", auth, upload.single("avatar"), ProfileController.uploadAvatar)
router.post("/export", auth, ProfileController.exportUserData)
router.delete("/account", auth, ProfileController.deleteUserAccount)
router.get("/login-history", auth, ProfileController.getLoginHistory)

module.exports = router
