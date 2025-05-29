import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const Semesters = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { fetchBranchWithSlug } = useAuth();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch branch details
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        if (slug) {
          const branchData = await fetchBranchWithSlug(slug);
          setBranch(branchData);
        }
      } catch (error) {
        setError("Failed to fetch branch data");
        console.error("Error fetching branch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [slug, fetchBranchWithSlug]);

  const handleSemClick = (semester) => {
    // Extract semester number safely
    const semesterNumber = semester.match(/\d+/)?.[0] || "1";

    // Encode branch name for URL safety
    const encodedBranch = encodeURIComponent(slug);

    navigate(`/branch/${encodedBranch}/semester/${semesterNumber}`);
    console.log(
      "Final URL:",
      `/branch/${encodedBranch}/semester/${semesterNumber}`
    );
  };

  const handleBackClick = () => {
    navigate(`/home`);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="semesters-container">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Notes
      </button>
      <h1 className="semesters-title">
        {branch
          ? `${branch.shortform} - Choose Your Semester`
          : "Choose Your Semester"}
      </h1>
      <div className="semesters-grid">
        {semesters.map((semester, index) => (
          <div
            key={index}
            className="semester-card"
            onClick={() => handleSemClick(semester)}
          >
            {semester}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Semesters;
