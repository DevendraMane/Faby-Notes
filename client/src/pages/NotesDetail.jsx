import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

const NotesDetail = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);
  const notesPerPage = 6;

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

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotes(new Set());
    } else {
      const allNoteIds = new Set(notes.map((note) => note._id));
      setSelectedNotes(allNoteIds);
    }
    setSelectAll(!selectAll);
  };

  const handleNoteSelect = (noteId, event) => {
    event.stopPropagation();
    const newSelected = new Set(selectedNotes);

    if (newSelected.has(noteId)) {
      newSelected.delete(noteId);
    } else {
      newSelected.add(noteId);
    }

    setSelectedNotes(newSelected);
    setSelectAll(newSelected.size === currentNotes.length);
  };

  const handleRightClick = (noteId, event) => {
    if (event.ctrlKey && event.button === 2) {
      event.preventDefault();

      const newSelected = new Set(selectedNotes);

      if (newSelected.has(noteId)) {
        newSelected.delete(noteId);
      } else {
        newSelected.add(noteId);
      }

      setSelectedNotes(newSelected);
      setSelectAll(newSelected.size === currentNotes.length);

      console.log("[v0] Ctrl+Right-click selection:", noteId);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedNotes.size === 0) {
      alert("Please select notes to download");
      return;
    }

    const selectedNotesData = notes.filter((note) =>
      selectedNotes.has(note._id)
    );

    for (const note of selectedNotesData) {
      try {
        const response = await fetch(note.cloudinaryUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = note.notesTitle;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error(`Failed to download ${note.notesTitle}:`, error);
        alert(`Failed to download ${note.notesTitle}`);
      }
    }
  };

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

  // if (loading) return <Loader />;
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

        <div className="bookmark-controls">
          <div className="select-control">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedNotes.size === notes.length && notes.length > 0}
              onChange={handleSelectAll}
            />
            <label htmlFor="selectAll">Select All</label>
          </div>

          <button
            className="download-button"
            onClick={handleDownloadSelected}
            disabled={selectedNotes.size === 0}
          >
            Download ({selectedNotes.size})
          </button>
        </div>
      </div>

      {notes.length > 0 ? (
        <>
          <div className="notes-grid-container">
            {currentNotes.map((note) => (
              <div
                key={note._id}
                className={`note-card-drive ${
                  selectedNotes.has(note._id) ? "selected" : ""
                }`}
                onClick={() => handleNoteClick(note._id)}
                onContextMenu={(e) => handleRightClick(note._id, e)}
              >
                <div className="note-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedNotes.has(note._id)}
                    onChange={(e) => handleNoteSelect(note._id, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="note-card-header">
                  <div className="note-title-section">
                    <span className="file-icon">
                      {getFileIcon(note.notesTitle, note.fileType)}
                    </span>
                    <span className="note-title-text">{note.notesTitle}</span>
                  </div>

                  <div className="note-menu-container">
                    <button
                      className="note-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(
                          showDropdown === note._id ? null : note._id
                        );
                      }}
                    >
                      ⋮
                    </button>
                    {showDropdown === note._id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNoteClick(note._id);
                            setShowDropdown(null);
                          }}
                        >
                          View Note
                        </button>
                      </div>
                    )}
                  </div>
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

          {totalPages > 1 && (
            <div className="pagination-container">
              {console.log(
                "[v0] Pagination - Current page:",
                currentPage,
                "Total pages:",
                totalPages,
                "Total notes:",
                notes.length
              )}

              <button
                className="pagination-arrow"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-number ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="pagination-arrow"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
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
