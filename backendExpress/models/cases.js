import { query } from '../database/db.js';

export const Case = {
  // Create a new investigation
  create: async (caseData) => {
    const { officer_id, entity_id, input_name, match_score, priority } = caseData;
    const sql = `
      INSERT INTO cases (officer_id, entity_id, input_name, match_score, priority, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *;
    `;
    const result = await query(sql, [officer_id, entity_id, input_name, match_score, priority]);
    return result.rows[0];
  },

  // Get all active cases for the dashboard
  getPending: async () => {
    const sql = `
      SELECT c.*, w.name as entity_name, u.name as officer_name
      FROM cases c
      JOIN watchlist_entities w ON c.entity_id = w.id
      JOIN users u ON c.officer_id = u.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC;
    `;
    const result = await query(sql);
    return result.rows;
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
  }
};