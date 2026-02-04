import * as caseModel from "../models/cases.js";

// Get all cases
export async function getAllCases(req, res) {
  try {
    const cases = await caseModel.Case.getAllCases();
    res.json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get case by ID
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;
    const caseData = await caseModel.Case.getCaseById(id);

    if (!caseData) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }

    res.json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Create new case
export async function createCase(req, res) {
  try {
    const { officer_id, entity_id, input_name, match_score, priority } =
      req.body;

    // Simple validation
    if (!officer_id || !entity_id || !input_name) {
      return res
        .status(400)
        .json({
          success: false,
          error: "officer_id, entity_id, and input_name are required",
        });
    }

    const newCase = await caseModel.Case.create({
      officer_id,
      entity_id,
      input_name,
      match_score: match_score || 0,
      priority: priority || "medium",
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Update case
export async function updateCase(req, res) {
  try {
    const { id } = req.params;
    const { input_name, match_score, priority, officer_id } = req.body;

    const updatedCase = await caseModel.Case.updateCase(id, {
      input_name,
      match_score,
      priority,
      officer_id,
    });

    res.json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Delete case
export async function deleteCase(req, res) {
  try {
    const { id } = req.params;
    await caseModel.Case.deleteCase(id);
    res.json({ success: true, message: "Case deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Assign case to officer (admin/manager only)
export async function assignCaseToOfficer(req, res) {
  try {
    const { caseId } = req.params;
    const { officerId } = req.body;

    if (!officerId) {
      return res
        .status(400)
        .json({ success: false, error: "Officer ID required" });
    }

    const result = await caseModel.Case.assignCaseToOfficer(caseId, officerId);
    res.json({
      success: true,
      message: `Case assigned to officer ${officerId}`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Add sanctioned entity to case
export async function addEntityToCase(req, res) {
  try {
    const { caseId } = req.params;
    const { entityId } = req.body;

    if (!entityId) {
      return res
        .status(400)
        .json({ success: false, error: "Entity ID required" });
    }

    const result = await caseModel.Case.addEntityToCase(caseId, entityId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
