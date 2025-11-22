"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Loader from "./Loader";
import { useAuth } from "../store/Auth";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [bookmarks, setBookMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDropdown, setShowDropdown] = useState(null);
  const notesPerPage = 6;

  const { API, token } = useAuth();
  const { subjectCode, semesterNumber, slug, notesType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API}/api/bookmark/user-bookmarks?page=${currentPage}&limit=${notesPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setBookMarks(data.bookmarks || []);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error(
            `Failed to fetch bookmarks: ${res.status} ${res.statusText}`
          );
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError(`Failed to load bookmarks: ${err.message}`);
        setBookMarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API, token, currentPage]);

  // const indexOfLastNote = currentPage * notesPerPage;
  // const indexOfFirstNote = indexOfLastNote - notesPerPage;
  // const bookmarks = bookmarks.slice(indexOfFirstNote, indexOfLastNote);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotes(new Set());
    } else {
      const allNoteIds = new Set(bookmarks.map((note) => note._id)); // 🔥 select all notes, not just current page
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
    setSelectAll(newSelected.size === bookmarks.length);
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
      setSelectAll(newSelected.size === bookmarks.length);

      console.log("[v0] Ctrl+Right-click selection:", noteId);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedNotes.size === 0) {
      alert("Please select notes to download");
      return;
    }

    const selectedBookmarks = bookmarks.filter((note) =>
      selectedNotes.has(note._id)
    );

    for (const note of selectedBookmarks) {
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

  const handleRemoveBookmark = async (noteId, event) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to remove this bookmark?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/api/bookmark/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove bookmark");

      setBookMarks((prev) => prev.filter((note) => note._id !== noteId));
      setSelectedNotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
      setShowDropdown(null);
    } catch (error) {
      console.error("Error removing bookmark:", error);
      alert("Failed to remove bookmark");
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedNotes.size === 0) {
      alert("Please select notes to remove");
      return;
    }

    if (
      !window.confirm("Are you sure you want to remove selected bookmarks?")
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API}/api/bookmark/user-bookmarks/remove-selected`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ noteIds: Array.from(selectedNotes) }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to remove bookmarks");

      setBookMarks(data.bookmarks || []);
      setSelectedNotes(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error("Error removing bookmarks:", err);
      alert("Failed to remove bookmarks");
    }
  };

  const handleBackClick = () => {
    if (navigate) {
      navigate(
        `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}`
      );
    } else {
      window.history.back();
    }
  };

  const handleNoteClick = (note) => {
    if (navigate) {
      navigate(
        `/branch/${note.slug}/semester/${note.semesterNumber}/subject/${note.subjectCode}/${note.notesType}/note/${note._id}`
      );
    } else {
      console.log("Navigate to note:", note);
    }
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
        <h2 className="notes-detail-title">Your Bookmarks</h2>

        <div className="bookmark-controls">
          <div className="select-control">
            <input
              type="checkbox"
              id="selectAll"
              checked={
                selectedNotes.size === bookmarks.length && bookmarks.length > 0
              }
              onChange={handleSelectAll}
            />
            <label htmlFor="selectAll">Select All</label>
          </div>
          <button
            className="remove-button"
            onClick={handleRemoveSelected}
            disabled={selectedNotes.size === 0}
          >
            Remove ({selectedNotes.size})
          </button>

          <button
            className="download-button"
            onClick={handleDownloadSelected}
            disabled={selectedNotes.size === 0}
          >
            Download ({selectedNotes.size})
          </button>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <>
          <div className="notes-grid-container">
            {bookmarks.map((note) => (
              <div
                key={note._id}
                className={`note-card-drive ${
                  selectedNotes.has(note._id) ? "selected" : ""
                }`}
                onClick={() => handleNoteClick(note)}
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
                          className="dropdown-item remove"
                          onClick={(e) => handleRemoveBookmark(note._id, e)}
                        >
                          Remove from bookmarks
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
                    <span className="upload-info">
                      Upload By •{note.uploadedBy?.username || "Unknown"}
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
                "Total bookmarks:",
                bookmarks.length
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
          <p>Sorry🥲, No bookmarks available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
