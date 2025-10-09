import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";

const streams = ["Engineering", "Diploma", "Pharmacy"];

export const Books = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStreamClick = (streamName) => {
    navigate(`/books/${streamName}`);
  };

  const handleBackClick = () => {
    navigate(`/`);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="semesters-container">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Notes
      </button>
      <h1 className="semesters-title">Choose the Stream</h1>
      <div className="semesters-grid">
        {streams.map((streamName, index) => (
          <div
            key={index}
            className="semester-card"
            onClick={() => handleStreamClick(streamName)}
          >
            {streamName}
          </div>
        ))}
      </div>
    </div>
  );
};
