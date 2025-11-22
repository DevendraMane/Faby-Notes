import Subject from "../models/subjects-model.js";
import Branch from "../models/branch-model.js";

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
    console.log(error);
    res.status(500).json({
      message: "Failed to get all subject",
      error: error.message,
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { _id } = req.params;
    // console.log(`✅` + _id);
    const { subjectName, subjectCode } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      _id,
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

export const addSubject = async (req, res) => {
  try {
    const { slug, semesterNumber } = req.params;
    const { subjectName, subjectCode } = req.body;

    // Find branch for extra data
    const branch = await Branch.findOne({ slug });
    // console.log(`⭐?This is Branch` + branch);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Prevent duplicate subject codes for same branch & semester
    const existingSubject = await Subject.findOne({
      subjectCode: subjectCode.toUpperCase(),
      slug,
      semesterNumber,
    });
    if (existingSubject) {
      return res.status(400).json({
        message: "Subject already exists for this semester and branch",
      });
    }

    // Create and save
    const newSubject = new Subject({
      subjectName,
      subjectCode: subjectCode.toUpperCase(),
      slug,
      streamName: branch.streamName,
      branchName: branch.branchName,
      semesterNumber,
      availableDocs: 0,
    });

    await newSubject.save();

    res.status(201).json({
      message: "Subject added successfully ✅",
      subject: newSubject,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({
      message: "Failed to add subject ❌",
      error: error.message,
    });
  }
};

export default { getAllSubjectsData, updateSubject, addSubject };
