import express from "express";
import * as caseController from "../controllers/caseController.js";
import { checkAuth } from "../middleware/auth.js";
import { validateCase } from "../middleware/validation.js";
import { requireAssignPermission } from "../middleware/roleAuth.js";

const router = express.Router();

// GET all cases (all authenticated users - officers and managers)
router.get("/", checkAuth, caseController.getAllCases);

// GET case by ID (all authenticated users)
router.get("/:id", checkAuth, caseController.getCaseById);

// CREATE new case (officers and managers)
router.post("/", checkAuth, validateCase, caseController.createCase);

// UPDATE case (officers and managers)
router.put("/:id", checkAuth, validateCase, caseController.updateCase);

// DELETE case (officers and managers)
router.delete("/:id", checkAuth, caseController.deleteCase);

// ASSIGN case to officer (manager only)
router.post(
  "/:caseId/assign",
  checkAuth,
  requireAssignPermission,
  caseController.assignCaseToOfficer,
);

// ADD sanctioned entity to case (officers and managers)
router.post(
  "/:caseId/entities",
  checkAuth,
  caseController.addEntityToCase,
);

export default router;
