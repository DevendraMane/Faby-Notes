"use client";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
// import Loader from "../components/Loader";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [branch, setBranch] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subjectName: "",
    subjectCode: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubjectData, setNewSubjectData] = useState({
    subjectName: "",
    subjectCode: "",
  });
  const { slug, semesterNumber } = useParams();
  const { fetchBranchWithSlug, fetchSubjectsData, API } = useAuth();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
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

  const handleEditClick = (e, subject) => {
    e.stopPropagation(); // Prevent subject click navigation
    setEditingSubject(subject);
    setEditFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
    setEditFormData({ subjectName: "", subjectCode: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API}/api/subjects/${editingSubject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (response.ok) {
        const updatedSubject = await response.json();
        // Update the subjects list with the updated subject
        setSubjects((prev) =>
          prev.map((subject) =>
            subject._id === editingSubject._id
              ? { ...subject, ...editFormData }
              : subject
          )
        );
        closeEditModal();
      } else {
        console.error("Failed to update subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const handleAddSubjectBtnClick = () => {
    setIsAddModalOpen(true);
  };
  const handleAddSubjectBtnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API}/api/subjects/${slug}/${semesterNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newSubjectData,
            semesterNumber,
            slug: slug,
          }),
        }
      );
      if (response.ok) {
        const createdSubject = await response.json();
        setSubjects((prev) => [...prev, createdSubject]);
        setIsAddModalOpen(false);
        setNewSubjectData({ subjectName: "", subjectCode: "" });
        toast.success(`Subject Added ✅`);
      }
    } catch (err) {
      console.error("Error adding subject:", err);
    }
  };

  // if (loading) return <Loader />;
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

        {isLoggedIn && isTeacher && (
          <button
            className="add-button flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={(e) => handleAddSubjectBtnClick(e)}
          >
            <Plus size={16} /> Add Subject
          </button>
        )}
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
                {isLoggedIn && isTeacher && (
                  <button
                    className="edit-button"
                    onClick={(e) => handleEditClick(e, subject)}
                    title="Edit Subject"
                  >
                    <Pencil
                      size={16}
                      strokeWidth={2}
                      className="text-gray-700"
                    />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No subjects found for this semester.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className="edit-modal"
        overlayClassName="modal-overlay"
        contentLabel="Edit Subject"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Subject</h2>
            <button className="close-button" onClick={closeEditModal}>
              ×
            </button>
          </div>
          <form onSubmit={handleUpdateSubject} className="edit-form">
            <div className="form-group">
              <label htmlFor="subjectName">Subject Name:</label>
              <input
                type="text"
                id="subjectName"
                name="subjectName"
                value={editFormData.subjectName}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="subjectCode">Subject Code:</label>
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                value={editFormData.subjectCode}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={closeEditModal}
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="edit-modal"
        overlayClassName="modal-overlay"
        contentLabel="Add Subject"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add Subject</h2>
            <button
              className="close-button"
              onClick={() => setIsAddModalOpen(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleAddSubjectBtnSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="newSubjectName">Subject Name:</label>
              <input
                type="text"
                id="newSubjectName"
                name="subjectName"
                value={newSubjectData.subjectName}
                onChange={(e) =>
                  setNewSubjectData({
                    ...newSubjectData,
                    subjectName: e.target.value,
                  })
                }
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newSubjectCode">Subject Code:</label>
              <input
                type="text"
                id="newSubjectCode"
                name="subjectCode"
                value={newSubjectData.subjectCode}
                onChange={(e) =>
                  setNewSubjectData({
                    ...newSubjectData,
                    subjectCode: e.target.value,
                  })
                }
                required
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="save-button">
                Add Subject
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Subjects;
