import express from "express";
import * as controller from "../controllers/nameEntityController.js";

const router = express.Router();

router.get("/search", controller.searchEntity);

export default router;