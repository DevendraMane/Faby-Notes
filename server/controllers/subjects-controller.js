import Subject from "../models/subjects-model.js";
import Branch from "../models/branch-model.js";

export const getAllSubjectsData = async (req, res) => {
  try {
    const { semesterNumber, streamName, slug } = req.query;
    const sem = Number(semesterNumber);

    let query = {
      streamName,
      semesterNumber: sem,
    };

    if (sem <= 2) {
      query.isCommon = true;
    } else {
      query.isCommon = false;
      query.slug = slug;
    }

    const subjectsData = await Subject.find(query).sort({ subjectName: 1 });

    res.status(200).json({
      message: "Subjects fetched successfully 📚",
      subjectsData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get subjects",
      error: error.message,
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { _id } = req.params;
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
    const sem = Number(semesterNumber);

    let newSubject = {
      subjectName,
      subjectCode: subjectCode.toUpperCase(),
      semesterNumber: sem,
      availableDocs: 0,
    };

    if (sem <= 2) {
      const branch = await Branch.findOne({ slug });
      newSubject.streamName = branch.streamName;
      newSubject.isCommon = true;
      newSubject.slug = "";
      newSubject.branchName = "";

      const exists = await Subject.findOne({
        subjectCode: newSubject.subjectCode,
        semesterNumber: sem,
        isCommon: true,
        streamName: branch.streamName,
      });

      if (exists) {
        return res.status(400).json({
          message: "Common subject already exists for this semester",
        });
      }
    } else {
      const branch = await Branch.findOne({ slug });
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      newSubject.streamName = branch.streamName;
      newSubject.branchName = branch.branchName;
      newSubject.slug = slug;
      newSubject.isCommon = false;

      const exists = await Subject.findOne({
        subjectCode: newSubject.subjectCode,
        semesterNumber: sem,
        slug,
      });

      if (exists) {
        return res.status(400).json({
          message: "Subject already exists for this branch & semester",
        });
      }
    }

    const created = await Subject.create(newSubject);

    res.status(201).json({
      message: "Subject added successfully ✅",
      subject: created,
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
