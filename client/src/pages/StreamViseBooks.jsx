"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

const StreamViseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchStreamViseBooks } = useAuth();
  const { streamName } = useParams();
  const navigate = useNavigate();

  // console.log("Notes params:", {
  //   subjectCode,
  //   semesterNumber,
  //   slug,
  //   notesType,
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const books = await fetchStreamViseBooks(streamName);

        console.log("Fetched books:", books); // 🔍 Debug log
        setBooks(books || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(`Failed to load notes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // ✅ Call it here
  }, [streamName, fetchStreamViseBooks]);

  // const handleBackClick = () => {
  //   navigate(
  //     `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}`
  //   );
  // };

  const handleBookClicked = (streamName, notesTitle) => {
    navigate(`/books/${streamName}/${notesTitle}`);
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
    <>
      <div className="notes-detail-container">
        <div className="subjects-header">
          {/* <button className="back-button" onClick={handleBackClick}>
          ← Back to Subjects
        </button> */}
          <h1 className="books-title">Books Available for {streamName}</h1>
        </div>
        {books.length > 0 ? (
          <div className="notes-grid-container">
            {books.map((book) => (
              <div
                key={book._id}
                className="note-card-drive"
                onClick={() =>
                  handleBookClicked(book.streamName, book.notesTitle)
                }
              >
                <div className="note-card-header">
                  <div className="note-title-section">
                    <span className="file-icon">
                      {getFileIcon(book.notesTitle, book.fileType)}
                    </span>
                    <span className="note-title-text">{book.notesTitle}</span>
                  </div>
                  <button className="note-menu-button">⋮</button>
                </div>

                <div className="note-preview-section">
                  <div
                    className="file-type-icon"
                    style={{
                      backgroundColor: getFileTypeColor(
                        book.notesTitle,
                        book.fileType
                      ),
                    }}
                  >
                    {getFileIcon(book.notesTitle, book.fileType)}
                  </div>
                </div>

                <div className="note-metadata-section">
                  <div className="user-info">
                    <span className="upload-info">
                      Upload Date •{" "}
                      {new Date(book.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notes-section">
            <p>Sorry🥲, No Books yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default StreamViseBooks;
