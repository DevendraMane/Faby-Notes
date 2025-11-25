import Notes from "../models/notes-model.js";
import Subject from "../models/subjects-model.js";

export const getNotes = async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const { semesterNumber, page = 1, limit = 6 } = req.query;

    console.log("Fetching notes with:", {
      subjectCode,
      semesterNumber,
      page,
      limit,
    });

    const skip = (page - 1) * limit;

    const notes = await Notes.find({ subjectCode })
      .populate("uploadedBy", "username role")
      .sort({ uploadedAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const totalNotes = await Notes.countDocuments({ subjectCode });
    const totalPages = Math.ceil(totalNotes / limit);

    console.log(
      `Found ${notes.length} notes for page ${page} of ${totalPages}`
    );

    res.status(200).json({
      msg: "📚 Paginated Notes Fetched Successfully",
      notes,
      currentPage: Number(page),
      totalPages,
      totalNotes,
    });
  } catch (error) {
    console.error("Error Fetching Notes📚:", error);
    res.status(500).json({
      msg: "Error fetching notes",
      error: error.message,
    });
  }
};

export default { getNotes };
