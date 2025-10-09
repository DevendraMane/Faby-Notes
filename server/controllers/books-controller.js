import Notes from "../models/notes-model.js";

export const getBooks = async (req, res) => {
  try {
    const { streamName } = req.params; // Get from URL parameter

    // Add validation
    if (!streamName) {
      return res.status(400).json({ msg: "Stream name is required" });
    }

    const books = await Notes.find({
      streamName: streamName,
      notesType: "Books",
    });

    res.status(200).json({
      msg: "➡️Result of Books",
      books,
    });
  } catch (error) {
    console.error("Error Fetching Books📚", error);
    res.status(500).json({
      msg: "Error fetching books",
      error: error.message,
    });
  }
};

export default { getBooks };
