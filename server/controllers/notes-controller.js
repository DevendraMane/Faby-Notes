import Notes from "../models/notes-model.js";

export const getNotes = async (req, res) => {
  try {
    const { subjectCode } = req.params; // Get from URL parameter
    const { semesterNumber } = req.query; // Get from query parameter

    console.log("Searching for notes with:", { subjectCode, semesterNumber });

    // Build query object
    const query = { subjectCode };

    // Add semesterNumber to query if provided
    if (semesterNumber) {
      query.semesterNumber = Number.parseInt(semesterNumber); // Convert to number
    }

    console.log("Final query:", query);

    const notes = await Notes.find(query);

    console.log(`Found ${notes.length} notes`);

    res.status(200).json({
      msg: "➡️Result of Notes",
      notes,
      query: query, // Include query in response for debugging
    });
  } catch (error) {
    console.error("Error Fetching Notes📚", error);
    res.status(500).json({
      msg: "Error fetching notes",
      error: error.message,
    });
  }
};

export default { getNotes };
