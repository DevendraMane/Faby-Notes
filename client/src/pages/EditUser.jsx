import React, { useState } from "react";
import "./EditUser.css";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";
import { useEffect } from "react";

const EditUser = () => {
  const [stream, setStream] = useState("");
  const { API, token, user, isLoggedIn } = useAuth();
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [profilePic, setProfilePic] = useState("/images/user-image.png");

  const canEdit =
    isLoggedIn && (user?.role === "teacher" || user?.role === "student");

  const handleStreamChange = (e, isInit = false) => {
    const selectedStream = e.target.value;
    setStream(selectedStream);

    let updatedBranches = [];
    if (selectedStream === "Engineering" || selectedStream === "Diploma") {
      updatedBranches = [
        "Computer Science and Engineering",
        "Artificial Intelligence and Data Science",
        "Civil Engineering",
        "Electrical Engineering",
        "Electronics and Telecommunication",
        "Mechanical Engineering",
      ];
    } else if (selectedStream === "Pharmacy") {
      updatedBranches = ["B.Pharma", "D.Pharma"];
    }
    setBranches(updatedBranches);

    // Don't reset branch when loading from saved data
    if (!isInit) setBranch("");
  };

  useEffect(() => {
    if (user?.streamName) {
      setStream(user.streamName);
      if (user.branchName) setBranch(user.branchName);
      handleStreamChange({ target: { value: user.streamName } }, true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Login required to edit profile");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ streamName: stream, branchName: branch }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully ✅");
        console.log("Updated user:", data.user);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="edit-user-container">
      <div className="edit-user-header">
        <div className="profile-pic-container">
          <img
            className="profile-pic"
            src={user?.profileImage || "/images/user-image.png"}
            alt="User avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/user-image.png";
            }}
          />
        </div>

        <h1 className="edit-user-name">{user?.username || "Guest User"}</h1>
        <p className="edit-user-title">{isLoggedIn ? user?.role : "Unknown"}</p>
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
              disabled={!canEdit}
            >
              <option value="">Select Stream</option>
              <option value="Engineering">Engineering</option>
              <option value="Diploma">Diploma</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
          </div>

          <div className="edit-user-form-group">
            <label className="edit-user-label">Branch</label>
            <select
              className="edit-user-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              disabled={!canEdit}
            >
              <option value="">Select Branch</option>
              {branches.map((branchOption, index) => (
                <option key={index} value={branchOption}>
                  {branchOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="edit-user-divider"></div>

        <button
          type="submit"
          className={`edit-user-save-button ${!canEdit ? "disabled" : ""}`}
          disabled={!canEdit}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
