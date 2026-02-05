import * as nameEntityModel from "../models/nameEntities.js";

export async function searchEntity(req, res) {
  try {
    const { name, nationality, topic } = req.query;

    let results;
    if (name) {
      results = await nameEntityModel.searchByName(name);
    } else if (nationality) {
      results = await nameEntityModel.searchByNationality(nationality);
    } else if (topic) {
      results = await nameEntityModel.searchByTopic(topic);
    } else {
      return res.status(400).json({
        success: false,
        error: "Provide name, nationality, or topic",
      });
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
