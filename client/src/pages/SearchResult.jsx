import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SearchResult = ({ results, searchQuery, isLoading, setSearchQuery }) => {
  const navigate = useNavigate();

  // Highlight matching text in search results
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text
      .split(regex)
      .map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
      );
  };

  if (isLoading) {
    return (
      <div className="search-results-loading">
        <div className="search-spinner"></div>
        <p>Searching...</p>
      </div>
    );
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="search-results-empty">
        <p>
          No notes found matching "<strong>{searchQuery}</strong>"
        </p>
      </div>
    );
  }

  const handleViewNote = (note) => {
    navigate(
      `/branch/${note.branchName.toLowerCase().replace(/\s+/g, "-")}/semester/${
        note.semesterNumber
      }/subject/${note.subjectCode}/${note.notesType}/note/${note._id}`
    );
    setSearchQuery("");
  };

  const handleAskAIBtn = (note) => {
    navigate(`/ai-assistant?note=${note._id}`);
    setSearchQuery("");
  };

  return (
    <div className="search-results">
      {results.map((note) => (
        <div key={note._id} className="search-result-item">
          <h3 className="result-title">
            {highlightMatch(note.notesTitle, searchQuery)}
          </h3>
          <div className="result-meta">
            <span className="result-type">{note.notesType}</span>
            <span className="result-subject">
              {note.subjectName} ({note.subjectCode})
            </span>
            <span className="result-branch">
              {note.branchName} • Sem {note.semesterNumber}
            </span>
          </div>
          <div className="result-actions">
            <button
              onClick={() => handleViewNote(note)}
              className="view-button"
            >
              View Note
            </button>
            <button
              onClick={handleAskAIBtn}
              className="ask-ai-button"
              state={{ noteTitle: note.notesTitle }}
            >
              Ask AI About This
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

SearchResult.propTypes = {
  results: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default SearchResult;
