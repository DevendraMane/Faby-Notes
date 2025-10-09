import Notes from "../models/notes-model.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      // Extract metadata from request body
      const { streamName, branchName, semesterNumber, subjectName } = req.body;

      console.log("Upload params:", {
        streamName,
        branchName,
        semesterNumber,
        subjectName,
      });

      // Format names for folder structure (replace spaces with underscores)
      const branchNameFormatted = branchName?.replace(/\s+/g, "_");
      const subjectNameFormatted = subjectName?.replace(/\s+/g, "_");
      const streamNameFormatted = streamName?.replace(/\s+/g, "_");

      // Create folder path
      const folderPath = `FabyNotes/${streamNameFormatted}/${branchNameFormatted}/semester/${semesterNumber}/${subjectNameFormatted}`;

      console.log("Cloudinary folder path:", folderPath);

      return {
        folder: folderPath,
        allowed_formats: ["pdf"],
        resource_type: "raw", // For non-image files like PDFs
        use_filename: true,
        unique_filename: true,
      };
    } catch (error) {
      console.error("Error in Cloudinary params:", error);
      return {
        folder: "FabyNotes/uploads",
        allowed_formats: ["pdf"],
        resource_type: "raw",
      };
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

export const saveUploads = async (req, res) => {
  try {
    console.log("Upload request body:", req.body);
    console.log("Upload file:", req.file);

    // Check if file was uploaded first
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        message: "No form data received",
      });
    }

    const {
      notesTitle,
      notesType,
      subjectName,
      subjectCode,
      branchName,
      streamName,
      semesterNumber,
    } = req.body;

    // Validate required fields
    if (
      !notesType ||
      !subjectName ||
      !subjectCode ||
      !branchName ||
      !streamName ||
      !semesterNumber
    ) {
      return res.status(400).json({
        message: "All fields are required",
        received: req.body,
        missing: {
          notesType: !notesType,
          subjectName: !subjectName,
          subjectCode: !subjectCode,
          branchName: !branchName,
          streamName: !streamName,
          semesterNumber: !semesterNumber,
        },
      });
    }

    // Get Cloudinary URL from uploaded file
    const cloudinaryUrl = req.file.path;

    // Generate title if not provided
    const finalNotesTitle = `${notesTitle}.pdf`;

    console.log("Creating notes document with:", {
      notesTitle: finalNotesTitle,
      notesType,
      subjectName,
      subjectCode,
      branchName,
      streamName,
      cloudinaryUrl,
      semesterNumber: Number.parseInt(semesterNumber),
    });

    // Create notes document
    const notesUploaded = await Notes.create({
      notesTitle: finalNotesTitle,
      notesType,
      subjectName,
      subjectCode,
      branchName,
      streamName,
      cloudinaryUrl,
      semesterNumber: Number.parseInt(semesterNumber),
      uploadedAt: new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      uploadedBy: req.userId,
    });

    console.log("Notes uploaded successfully:", notesUploaded._id);

    res.status(201).json({
      message: "Notes Uploaded Successfully 📝",
      data: {
        id: notesUploaded._id,
        notesTitle: notesUploaded.notesTitle,
        cloudinaryUrl: notesUploaded.cloudinaryUrl,
      },
    });
  } catch (error) {
    console.error("Error Uploading Notes ➡️🚫📝:", error);

    // Delete uploaded file from Cloudinary if database save fails
    if (req.file && req.file.public_id) {
      try {
        console.log("Deleting file from Cloudinary:", req.file.public_id);
        await cloudinary.uploader.destroy(req.file.public_id, {
          resource_type: "raw",
        });
      } catch (deleteError) {
        console.error("Error deleting file from Cloudinary:", deleteError);
      }
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Export both the upload middleware and the controller
export default { saveUploads, upload };
