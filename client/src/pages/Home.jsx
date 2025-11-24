import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/Auth";
import Loader from "../components/Loader";

export const Home = () => {
  const [viewMode, setViewMode] = useState("grid");
  const { streamData, branchData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCardClick = (branchSlug) => {
    navigate(`/branch/${branchSlug}`);
  };

  // Helper function to get image based on shortform
  const getImagePath = (branch) => {
    const shortform = branch.shortform
      .toLowerCase()
      .replace("/", "")
      .replace("&", "")
      .replace(".", "");

    const imageMap = {
      cse: "cse-card2.png",
      aids: "aids-card.png",
      ee: "elec-card.png",
      entc: "entc-card.png",
      me: "mech-card.png",
      ce: "civil-card.png",
      dce: "cse-card2.png",
      dee: "elec-card.png",
      dme: "mech-card.png",
      bpharma: "bpharm-card.png",
      dpharma: "dpharm-card.png",
      mech: "mech-card.png",
      civil: "civil-card.png",
      elect: "elec-card.png",
    };

    return `/images/${imageMap[shortform] || "default-card.png"}`;
  };

  // Map streamSlug → correct streamName
  const getBranchesForStream = (streamSlug) => {
    let streamName = streamSlug;

    if (streamSlug.includes("eng")) streamName = "Engineering";
    else if (streamSlug.includes("diploma")) streamName = "Diploma";
    else if (streamSlug.includes("pharma")) streamName = "Pharmacy";

    return branchData.filter((branch) => branch.streamName === streamName);
  };

  // Simulate same loading behavior as Semesters.jsx
  useEffect(() => {
    try {
      setLoading(true);

      // Wait until branchData and streamData load
      if (streamData.length && branchData.length) {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load homepage data");
      setLoading(false);
    }
  }, [streamData, branchData]);

  if (loading) return <Loader />;
  if (error) return <div className="error">{error}</div>;

  if (!streamData || streamData.length === 0) {
    return (
      <div className="no-data">
        No streams available. Please add some streams to get started.
      </div>
    );
  }

  return (
    <div className="maincontent">
      {streamData.map((stream) => {
        const streamBranches = getBranchesForStream(stream.slug);

        return (
          <div className="maincontent-section" key={stream._id}>
            <div className="maincontent-header">
              <h2 className="maincontent-title">• For {stream.name} :</h2>
            </div>

            <div className={`maincontent-cards ${viewMode}`}>
              {streamBranches.length > 0 ? (
                streamBranches.map((branch) => (
                  <div
                    className="maincontent-card"
                    key={branch._id || branch.slug}
                    onClick={() => handleCardClick(branch.slug)}
                  >
                    <div className="card-content">
                      <img
                        className="img-card"
                        src={getImagePath(branch)}
                        alt={`${branch.shortform} Card`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-card.png";
                        }}
                      />
                      <h3>{branch.shortform}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-branches">
                  No branches available for this stream.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
