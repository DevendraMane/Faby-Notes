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

export default { getAllSubjectsData };
