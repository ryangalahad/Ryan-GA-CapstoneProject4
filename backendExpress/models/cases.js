import { query } from "../database/db.js";

export const Case = {
  // Create a new investigation
  create: async (caseData) => {
    const { officer_id, entity_id, input_name, match_score, priority } = caseData;
    const sql = `
      INSERT INTO cases (officer_id, entity_id, input_name, match_score, priority, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *;
    `;
    const result = await query(sql, [officer_id, entity_id, input_name, match_score, priority,]);
    return result.rows[0];
  },

  // Get all cases
  getAllCases: async () => {
    const sql = `
      SELECT c.*, ne.name as entity_name, u.name as officer_name
      FROM cases c
      LEFT JOIN name_entities ne ON c.entity_id = ne.id
      LEFT JOIN users u ON c.officer_id = u.id
      ORDER BY c.created_at DESC;
    `;
    const result = await query(sql);
    return result.rows;
  },

  // Get case by ID
  getCaseById: async (id) => {
    const sql = `
      SELECT c.*, ne.name as entity_name, u.name as officer_name
      FROM cases c
      LEFT JOIN name_entities ne ON c.entity_id = ne.id
      LEFT JOIN users u ON c.officer_id = u.id
      WHERE c.id = $1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  // Get all active cases for the dashboard
  getPending: async () => {
    const sql = `
      SELECT c.*, ne.name as entity_name, u.name as officer_name
      FROM cases c
      LEFT JOIN name_entities ne ON c.entity_id = ne.id
      LEFT JOIN users u ON c.officer_id = u.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC;
    `;
    const result = await query(sql);
    return result.rows;
  },

  // Update case
  updateCase: async (id, caseData) => {
    const { input_name, match_score, priority, officer_id } = caseData;
    const sql = `
      UPDATE cases
      SET input_name = $1, match_score = $2, priority = $3, officer_id = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const result = await query(sql, [
      input_name,
      match_score,
      priority,
      officer_id,
      id,
    ]);
    return result.rows[0];
  },

  // Delete case
  deleteCase: async (id) => {
    const sql = `DELETE FROM cases WHERE id = $1;`;
    await query(sql, [id]);
  },

  // Assign case to officer
  assignCaseToOfficer: async (caseId, officerId) => {
    const sql = `
      UPDATE cases
      SET officer_id = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await query(sql, [officerId, caseId]);
    return result.rows[0];
  },

  // Add sanctioned entity to case
  addEntityToCase: async (caseId, entityId) => {
    const sql = `
      UPDATE cases
      SET entity_id = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await query(sql, [entityId, caseId]);
    return result.rows[0];
  },

  // Update status (Clear/Flag)
  updateStatus: async (id, status, notes) => {
    const sql = `
      UPDATE cases 
      SET status = $1, officer_notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const result = await query(sql, [status, notes, id]);
    return result.rows[0];
  },
};
