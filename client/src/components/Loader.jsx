import logo from "/public/images/faby-logo.png"; // adjust path if needed
import { useEffect, useState } from "react";

const Loader = ({ percentage = 0 }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // When percentage reaches 100%, trigger completion animation
    if (percentage === 100) {
      setIsCompleting(true);
    }
  }, [percentage]);

  return (
    <div className={`loader-wrapper ${isCompleting ? "loader-complete" : ""}`}>
      <img src={logo} alt="Loading..." className="loader-logo" />
      <div className="loader-percentage">
        <div className="percentage-text">{Math.round(percentage)}%</div>
      </div>
      {percentage > 0 && (
        <div
          className="loader-progress-bar"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        ></div>
      )}
    </div>
  );
};

export default Loader;
