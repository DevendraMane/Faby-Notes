import Notes from "../models/notes-model.js";

export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query cannot be empty",
      });
    }

    // Escape special regex characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const notes = await Notes.find({
      $or: [
        { notesTitle: { $regex: escapedQuery, $options: "i" } },
        { subjectName: { $regex: escapedQuery, $options: "i" } },
      ],
    })
      .sort({ notesTitle: 1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message:
        notes.length > 0
          ? "Notes retrieved successfully"
          : "No notes found matching your search",
      notes,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching notes",
    });
  }
};
