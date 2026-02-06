import express from "express";
import * as controller from "../controllers/nameEntityController.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", checkAuth, controller.searchEntity);
router.get("/countries", controller.getCountries);

export default router;
