import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

const notesType = ["Notes", "PYQ", "MCQ", "Assignment", "Books"];

export const NotesType = () => {
  const navigate = useNavigate();
  const { slug, semesterNumber, subjectCode } = useParams();
  const { fetchBranchWithSlug } = useAuth();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("NotesType params:", { slug, semesterNumber, subjectCode });

  // Fetch branch details
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        if (slug) {
          const branchData = await fetchBranchWithSlug(slug);
          setBranch(branchData);
        }
      } catch (err) {
        console.error("Error fetching branch details:", err);
        setError(`Failed to load branch details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [slug, fetchBranchWithSlug]);

  const handleNotesTypeClick = (selectedNotesType) => {
    // Navigate to Notes page with the selected notes type
    navigate(
      `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}/${selectedNotesType}`
    );
    console.log(
      "Navigating to:",
      `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}/${selectedNotesType}`
    );
  };

  const handleBackClick = () => {
    navigate(`/branch/${slug}/semester/${semesterNumber}`);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="semesters-container">
      <div className="subjects-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Subjects
        </button>
        <h1 className="semesters-title">
          What type of content do you want for {subjectCode}?
        </h1>
      </div>
      <div className="semesters-grid">
        {notesType.map((type, index) => (
          <div
            key={index}
            className="semester-card"
            onClick={() => handleNotesTypeClick(type)}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesType;
