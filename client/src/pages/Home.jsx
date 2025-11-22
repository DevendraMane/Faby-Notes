// import { MainContent } from "../components/layout/MainContent";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/Auth";
// import Loader from "../Loader";

export const Home = () => {
  const [viewMode, setViewMode] = useState("grid");
  const { streamData, branchData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCardClick = (branchSlug) => {
    navigate(`/branch/${branchSlug}`);
  };

  // Helper function to get image path based on branch shortform
  const getImagePath = (branch) => {
    const shortform = branch.shortform
      .toLowerCase()
      .replace("/", "")
      .replace("&", "")
      .replace(".", "");

    // Map of shortforms to image filenames
    const imageMap = {
      cse: "cse-card2.png",
      aids: "aids-card.png",
      ee: "elec-card.png",
      entc: "entc-card.png",
      me: "mech-card.png",
      ce: "civil-card.png",
      dce: "cse-card2.png", // Diploma Computer Engineering
      dee: "elec-card.png", // Diploma Electrical Engineering
      dme: "mech-card.png", // Diploma Mechanical Engineering
      bpharma: "bpharm-card.png",
      dpharma: "dpharm-card.png",
      mech: "mech-card.png",
      civil: "civil-card.png",
      elect: "elec-card.png",
    };

    // Get the image filename from the map or use a default
    const imageFile = imageMap[shortform] || "default-card.png";

    return `/images/${imageFile}`;
  };

  // Helper function to get branches for a specific stream based on streamName
  const getBranchesForStream = (streamSlug) => {
    // Convert stream slug to streamName format
    let streamName = streamSlug;

    // Handle special cases
    if (streamSlug.includes("eng")) {
      streamName = "Engineering";
    } else if (streamSlug.includes("diploma")) {
      streamName = "Diploma";
    } else if (streamSlug.includes("pharma")) {
      streamName = "Pharmacy";
    }

    // Filter branches by streamName
    return branchData.filter((branch) => branch.streamName === streamName);
  };

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  // If no streams data is available, show a message
  if (!streamData || streamData.length === 0) {
    return (
      <div className="no-data">
        No streams available. Please add some streams to get started.
      </div>
    );
  }

  if (!branchData.length || !streamData.length) {
    return (
      <div className="loader-container">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-section">
            <div className="skeleton-title"></div>
            <div className="skeleton-cards">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If streams data is available, render dynamic content
  return (
    <div className="maincontent">
      {streamData.map((stream) => {
        // Get branches for this stream based on stream slug or name
        const streamBranches = getBranchesForStream(stream.slug);

        return (
          <div className="maincontent-section" key={stream._id}>
            <div className="maincontent-header">
              <h2 className="maincontent-title">• For {stream.name} :</h2>
              <div className="maincontent-controls">
                {/* <div className="maincontent-view-toggle">
                      <button
                        className={`view-btn ${
                          viewMode === "list" ? "active" : ""
                        }`}
                        onClick={() => setViewMode("list")}
                        aria-label="List view"
                      >
                        <span className="view-icon">☰</span>
                      </button>
                      <button
                        className={`view-btn ${
                          viewMode === "grid" ? "active" : ""
                        }`}
                        onClick={() => setViewMode("grid")}
                        aria-label="Grid view"
                      >
                        <span className="view-icon">▤</span>
                      </button>
                    </div> */}
              </div>
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
                      <div>
                        <img
                          className="img-card"
                          src={getImagePath(branch) || "/placeholder.svg"}
                          alt={`${branch.shortform} Card`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default-card.png";
                          }}
                        />
                        <h3>{branch.shortform}</h3>
                      </div>
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
  // return <MainContent />;
};
