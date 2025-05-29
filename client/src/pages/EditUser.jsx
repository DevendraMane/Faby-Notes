import React, { useState } from "react";
import "./EditUser.css";

const EditUser = () => {
  const [stream, setStream] = useState("");
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [profilePic, setProfilePic] = useState("/images/user-image.png");

  const handleStreamChange = (e) => {
    const selectedStream = e.target.value;
    setStream(selectedStream);

    if (selectedStream === "Engineering") {
      setBranches([
        "Computer Science and Engineering",
        "Artificial Intelligence and Data Science",
        "Civil Engineering",
        "Electrical Engineering",
        "Electronics and Telecommunication",
        "Mechanical Engineering",
      ]);
    } else if (selectedStream === "Diploma") {
      setBranches([
        "Computer Science and Engineering",
        "Artificial Intelligence and Data Science",
        "Civil Engineering",
        "Electrical Engineering",
        "Electronics and Telecommunication",
        "Mechanical Engineering",
      ]);
    } else if (selectedStream === "Pharmacy") {
      setBranches(["B.Pharma", "D.Pharma"]);
    } else {
      setBranches([]);
    }
    setBranch("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ profilePic, stream, branch });
    // Submit logic here
  };

  return (
    <div className="edit-user-container">
      <div className="edit-user-header">
        <div className="profile-pic-container">
          <img src={profilePic} alt="Profile" className="profile-pic" />
          <label className="profile-pic-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Change Photo
          </label>
        </div>
        <h1 className="edit-user-name">Devendra Mane</h1>
        <p className="edit-user-title">Student</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="edit-user-section">
          <h2 className="edit-user-section-title">Stream</h2>
          <div className="edit-user-form-group">
            <select
              className="edit-user-select"
              value={stream}
              onChange={handleStreamChange}
              required
            >
              <option value="">Select Stream</option>
              <option value="Engineering">Engineering</option>
              <option value="Diploma">Diploma</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
          </div>

          {stream && (
            <div className="edit-user-form-group">
              <label className="edit-user-label">Branch</label>
              <select
                className="edit-user-select"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branchOption, index) => (
                  <option key={index} value={branchOption}>
                    {branchOption}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="edit-user-divider"></div>

        <button type="submit" className="edit-user-save-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
