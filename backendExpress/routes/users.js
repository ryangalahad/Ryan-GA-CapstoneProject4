import express from "express";
import * as userController from "../controllers/userController.js";
import { checkAuth, checkManager } from "../middleware/auth.js";
import { validateUser } from "../middleware/validation.js";

const router = express.Router();

// GET all users (requires manager)
router.get("/", checkAuth, checkManager, userController.getAllUsers);

// GET user by ID
router.get("/:id", checkAuth, userController.getUserById);

// CREATE new user (requires manager)
router.post(
  "/",
  checkAuth,
  checkManager,
  validateUser,
  userController.createUser,
);

// UPDATE user (requires manager)
router.put(
  "/:id",
  checkAuth,
  checkManager,
  validateUser,
  userController.updateUser,
);

// DELETE user (requires manager)
router.delete("/:id", checkAuth, checkManager, userController.deleteUser);

export default router;
