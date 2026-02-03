import * as nameEntityModel from "../models/nameEntity.js";

export async function searchEntity(req, res) {
  try {
    const { name, country } = req.query;
    
    let results;
    if (name) {
      results = await nameEntityModel.searchByName(name);
    } else if (country) {
      results = await nameEntityModel.searchByCountry(country);
    } else {
      return res.status(400).json({ error: "Provide name or country" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}