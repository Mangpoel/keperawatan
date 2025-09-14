const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// register & login (public)
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUser);
// Route untuk Edit User (UPDATE)
router.put('/:id', userController.updateUser);

// Route untuk Soft Delete User
router.delete('/:id', userController.deleteUser);


// // get all users (khusus Admin role = 1)
// router.get("/", auth(1), userController.getAllUsers);

// // update status user (aktif/nonaktif) → hanya admin
// router.put("/:id/status", auth(1), userController.updateStatus);

// // update role user → hanya admin
// router.put("/:id/role", auth(1), userController.updateRole);

module.exports = router;
