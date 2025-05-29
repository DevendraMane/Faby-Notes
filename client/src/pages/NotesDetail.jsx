"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

const NotesDetail = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchNotesWithSubjectCode } = useAuth();
  const { subjectCode, semesterNumber, slug, notesType } = useParams();
  const navigate = useNavigate();

  console.log("Notes params:", {
    subjectCode,
    semesterNumber,
    slug,
    notesType,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const notesData = await fetchNotesWithSubjectCode(subjectCode);

        // Filter notes by type if needed
        const filteredNotes =
          notesData?.filter(
            (note) => note.notesType?.toLowerCase() === notesType?.toLowerCase()
          ) || [];

        setNotes(filteredNotes);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(`Failed to load notes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (subjectCode) {
      fetchData();
    }
  }, [subjectCode, notesType, fetchNotesWithSubjectCode]);

  const handleBackClick = () => {
    navigate(
      `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}`
    );
  };

  const handleNoteClick = (noteId) => {
    navigate(
      `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}/${notesType}/note/${noteId}`
    );
  };

  const getFileIcon = (fileName, fileType) => {
    const extension =
      fileName?.split(".").pop()?.toLowerCase() || fileType?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📘";
      case "ppt":
      case "pptx":
        return "📊";
      case "xls":
      case "xlsx":
        return "📗";
      default:
        return "📄";
    }
  };

  const getFileTypeColor = (fileName, fileType) => {
    const extension =
      fileName?.split(".").pop()?.toLowerCase() || fileType?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "#ea4335";
      case "doc":
      case "docx":
        return "#4285f4";
      case "ppt":
      case "pptx":
        return "#ff6d01";
      case "xls":
      case "xlsx":
        return "#0f9d58";
      default:
        return "#4285f4";
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="notes-detail-container">
      <div className="notes-detail-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Notes Type
        </button>
        <h2 className="notes-detail-title">
          {subjectCode} - {notesType}
        </h2>
      </div>

      {notes.length > 0 ? (
        <div className="notes-grid-container">
          {notes.map((note) => (
            <div
              key={note._id}
              className="note-card-drive"
              onClick={() => handleNoteClick(note._id)}
            >
              <div className="note-card-header">
                <div className="note-title-section">
                  <span className="file-icon">
                    {getFileIcon(note.notesTitle, note.fileType)}
                  </span>
                  <span className="note-title-text">{note.notesTitle}</span>
                </div>
                <button className="note-menu-button">⋮</button>
              </div>

              <div className="note-preview-section">
                <div
                  className="file-type-icon"
                  style={{
                    backgroundColor: getFileTypeColor(
                      note.notesTitle,
                      note.fileType
                    ),
                  }}
                >
                  {getFileIcon(note.notesTitle, note.fileType)}
                </div>
              </div>

              <div className="note-metadata-section">
                <div className="user-info">
                  <span className="upload-info">
                    Upload Date •{" "}
                    {new Date(note.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notes-section">
          <p>
            Sorry🥲, No {notesType} available for {subjectCode} yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesDetail;
