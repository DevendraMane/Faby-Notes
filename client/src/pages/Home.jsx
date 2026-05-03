import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/Auth";
import { SkeletonGrid } from "../components/SkeletonCard";
import "./Home.css";

export const Home = () => {
  const [viewMode] = React.useState("grid");
  const { streamData, branchData, isLoading, loadProgress, loadingErrors } =
    useAuth();
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

  // Show skeleton loaders while data is still loading
  if (isLoading || streamData.length === 0) {
    return (
      <div className="maincontent">
        <div className="maincontent-section">
          <div className="maincontent-header">
            <h2 className="maincontent-title">• Loading branches...</h2>
          </div>
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  // Show error if API calls failed
  if (loadingErrors.length > 0) {
    return (
      <div className="maincontent">
        <div className="error-container">
          <h2>Unable to load content</h2>
          <p>Please refresh the page to try again.</p>
          <ul>
            {loadingErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

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
                        loading="lazy"
                        decoding="async"
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
