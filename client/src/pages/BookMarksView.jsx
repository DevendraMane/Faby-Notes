import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";

export const BookMarksView = () => {
  const [bookmark, setBookMarks] = useState(null);
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
        const bookmarksData = await fetch(`${API}/api/bookmark/user-bookmarks`);

        setBookMarks(bookmarksData.bookmarks);
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
      toast.error("Please log in to submit feedback");
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

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!note) return <div className="error-message">Note not found</div>;

  return (
    <div className="notes-viewer-container">
      <div className="notes-viewer-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Notes
        </button>
        <h2 className="viewer-title">{note.notesTitle}</h2>
      </div>

      <div className="pdf-viewer-toolbar">
        <button className="download-btn" onClick={handleDownload}>
          <span className="download-icon">⬇</span>
          Download
        </button>

        <div className="viewer-tools">
          <button className="tool-btn">
            <span>✨</span>
            AI Tools
          </button>
          <button className="tool-btn like-btn">
            <span>👍</span>0
          </button>

          <button
            className="tool-btn save-btn"
            onClick={() => handleBookmark()}
          >
            <span>🔖</span>
            Save
          </button>
          <button className="tool-btn share-btn">
            <span>↗</span>
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

export default BookMarksView;
