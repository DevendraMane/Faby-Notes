"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";

export const NotesView = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const { fetchNotesWithSubjectCode, isLoggedIn, API, token } = useAuth();
  const { subjectCode, semesterNumber, slug, notesType, noteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: fetch all notes for this subject code
        const notesData = await fetchNotesWithSubjectCode(subjectCode);

        // Step 2: find the exact note by noteId (convert _id to string)
        const specificNote = notesData?.find(
          (n) => n._id.toString() === noteId
        );

        if (!specificNote) {
          throw new Error("Note not found");
        }

        // Step 3: set that note
        setNote(specificNote);
      } catch (err) {
        console.error("Error fetching note:", err);
        setError(`Failed to load note: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (subjectCode && noteId) {
      fetchData();
    }
  }, [subjectCode, noteId, fetchNotesWithSubjectCode]);

  const handleBackClick = () => {
    navigate(
      `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}/${notesType}`
    );
  };

  const handleDownload = () => {
    // Opens in new tab
    window.open(note.cloudinaryUrl, "_blank");
  };

  const handleLikeClick = () => {};

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in first");
      openLogInModal();
      return;
    } else {
      try {
        const res = await fetch(`${API}/api/bookmark/${note._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to bookmark note");

        const data = await res.json();
        toast.success("Note saved! 🔖");
        console.log("Bookmarks:", data.bookmarks);
      } catch (err) {
        console.error("Bookmark error:", err);
        toast.error("Could not save note");
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = note.notesTitle || "Check out this note!";
    const shareText = `Hey! Check out "${note.notesTitle}" uploaded on Faby Notes.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        // toast.success("Shared successfully 🚀");
      } catch (err) {
        console.error("Error sharing:", err);
        toast.error("Share canceled or failed");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard 📋");
      } catch (err) {
        console.error("Clipboard error:", err);
        toast.error("Failed to copy link");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!note) return <div className="error-message">Note not found</div>;

  return (
    <div className="notes-viewer-container">
      <div className="pdf-viewer-toolbar">
        {/* <button className="download-btn" onClick={handleDownload}>
          <span className="download-icon">⬇</span>
          Uploader
        </button> */}
        <div className="note-title-section">
          <h2 className="viewer-title">{note.notesTitle}</h2>
          <p className="uploaded-by">uploaded by {note.uploadedBy.username}</p>
        </div>
        <div className="viewer-tools">
          {/* <button className="tool-btn">
            <span>✨</span>
            AI Tools
          </button> */}

          <button className="download-btn" onClick={handleDownload}>
            <span className="download-icon">⬇</span>
            Download
          </button>
          {/* <button
            onClick={() => {
              handleLikeClick();
            }}
            className="tool-btn like-btn"
          >
            <span>👍</span>0
          </button> */}
          <button
            className="tool-btn save-btn"
            onClick={() => handleBookmark()}
          >
            <span>🔖</span>
            Save
          </button>
          <button
            className="tool-btn share-btn hover:scale-105 transition"
            onClick={handleShare}
          >
            <span>↗️</span> Share
          </button>
        </div>
      </div>

      <div className="pdf-viewer-content">
        <iframe
          src={`https://docs.google.com/viewer?url=${note.cloudinaryUrl}&embedded=true`}
          className="pdf-iframe"
          title={note.notesTitle}
        />
      </div>
    </div>
  );
};

export default NotesView;
