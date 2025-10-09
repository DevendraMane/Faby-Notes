import User from "../models/user-model.js";

const saveBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicates
    if (!user.bookmarks.includes(req.params.noteId)) {
      user.bookmarks.push(req.params.noteId);
      await user.save();
    }

    res.json({ message: "Note bookmarked", bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("bookmarks");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicates
    // if (!user.bookmarks.includes(req.params.noteId)) {
    //   user.bookmarks.push(req.params.noteId);
    //   await user.save();
    // }

    res.json({ message: "Users Bookmarks", bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBookmarks = async (req, res) => {
  try {
    const userId = req.userId;
    const { noteIds } = req.body; // Expect array of noteIds

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ message: "No noteIds provided" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: { $in: noteIds } } },
      { new: true }
    ).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Bookmarks removed successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Error removing bookmarks:", error);
    res.status(500).json({ message: "Failed to remove bookmarks" });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const userId = req.userId;
    const { noteId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: noteId } },
      { new: true }
    ).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: "Failed to remove bookmark" });
  }
};

export default { saveBookmark, getBookmarks, deleteBookmarks, deleteBookmark };
