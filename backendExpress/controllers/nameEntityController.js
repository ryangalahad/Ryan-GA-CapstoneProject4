import * as nameEntityModel from "../models/nameEntities.js";
import { getAllCountries, searchCountries } from "../utils/countryMapping.js";

export async function searchEntity(req, res) {
  try {
    const { name, nationality } = req.query;

    let results;
    if (name && nationality) {
      // Combined search: name AND nationality
      const nameResults = await nameEntityModel.searchByName(name);
      const nationalityResults =
        await nameEntityModel.searchByNationality(nationality);

      // Filter name results to only include those with matching nationality
      results = nameResults.filter((person) =>
        nationalityResults.some((nResult) => nResult.id === person.id),
      );
    } else if (name) {
      results = await nameEntityModel.searchByName(name);
    } else if (nationality) {
      results = await nameEntityModel.searchByNationality(nationality);
    } else {
      return res.status(400).json({
        success: false,
        error: "Provide name and/or nationality",
      });
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getCountries(req, res) {
  try {
    const { search } = req.query;

    let countries;
    if (search) {
      countries = searchCountries(search);
    } else {
      countries = getAllCountries();
    }

    res.json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
