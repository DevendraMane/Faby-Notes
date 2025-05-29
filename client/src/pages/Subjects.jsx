import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

export const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [branch, setBranch] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug, semesterNumber } = useParams();
  const { fetchBranchWithSlug, fetchSubjectsData } = useAuth();
  const navigate = useNavigate();

  console.log("👋🏽", slug, semesterNumber);

  useEffect(() => {
    if (!semesterNumber || isNaN(semesterNumber)) {
      console.error("Invalid semester:", semesterNumber);
      navigate("/error", { state: { message: "Invalid semester number" } });
    }
  }, [semesterNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First, fetch the branch data and wait for it
        const branchData = await fetchBranchWithSlug(slug);
        if (!branchData) {
          throw new Error("Branch not found");
        }
        setBranch(branchData);

        // Then fetch subjects data using the branch information
        const subjectsData = await fetchSubjectsData(
          semesterNumber,
          branchData.streamName,
          branchData.slug
        );

        if (!subjectsData) {
          throw new Error("No subjects data found");
        }

        console.log("Subjects data:", subjectsData);
        setSubjects(subjectsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug && semesterNumber) {
      fetchData();
    }
  }, [slug, semesterNumber, fetchBranchWithSlug, fetchSubjectsData]);

  const handleBackClick = () => {
    navigate(`/branch/${slug}`);
  };

  // Fixed navigation to include subjectCode in the URL
  const handleSubjectClick = (subjectCode) => {
    navigate(
      `/branch/${slug}/semester/${semesterNumber}/subject/${subjectCode}`
    );
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="subject-container">
      <div className="subjects-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Semesters
        </button>
        <h2 className="subject-title">
          {branch.name && `${branch.name} - `}Semester {semesterNumber}
        </h2>
        <div className="subject-list">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <div
                key={subject._id || index}
                className="subject-row"
                onClick={() => handleSubjectClick(subject.subjectCode)}
              >
                <div className="subject-serial">{index + 1}</div>
                <div className="subject-info">
                  <div className="subject-name">{subject.subjectName}</div>
                  <div className="subject-details">
                    • Subject Code: {subject.subjectCode}
                  </div>
                  <div className="subject-details">
                    • Available Docs: {subject.availableDocs}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No subjects found for this semester.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
