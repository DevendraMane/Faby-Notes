import Subject from "../models/subjects-model.js";

export const getAllSubjectsData = async (req, res) => {
  try {
    const { semesterNumber, streamName, slug } = req.query; // Use query params
    const subjectsData = await Subject.find({
      semesterNumber: semesterNumber,
      streamName: streamName, // Add stream filter
      slug: slug, // Add branch filter
    });

    res.status(200).json({
      message: "Subjects fetched successfully 📚",
      subjectsData,
    });
  } catch (error) {
    // ... error handling
    console.log(error);
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName, subjectCode } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { subjectName, subjectCode },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject updated successfully ✅",
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

export default { getAllSubjectsData, updateSubject };
