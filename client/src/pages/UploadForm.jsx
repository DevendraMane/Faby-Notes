import { useState, useEffect } from "react";
import { useAuth } from "../store/Auth";
import SelectFile from "../components/ui/UplodaFormUI/SelectFile";
import FormNotesType from "../components/ui/UplodaFormUI/FormNotesType";
import FormStreams from "../components/ui/UplodaFormUI/FormStreams";
import FormBranchName from "../components/ui/UplodaFormUI/FormBranchName";
import FormSemesterNumber from "../components/ui/UplodaFormUI/FormSemesterNumber";
import FormSubjectName from "../components/ui/UplodaFormUI/FormSubjectName";
import FormSubjectCode from "../components/ui/UplodaFormUI/FormSubjectCode";
import FormSubmitButton from "../components/ui/UplodaFormUI/FormSubmitButton";
import FormNotesTitle from "../components/ui/UplodaFormUI/FormNotesTitle";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    notesType: "",
    subjectName: "",
    subjectCode: "",
    branchName: "",
    streamName: "",
    semesterNumber: "",
    file: null,
    notesTitle: "",
  });
  const [subjects, setSubjects] = useState([]);

  const [dropdownOptions, setDropdownOptions] = useState({
    subjects: [],
    branches: [],
    streams: [],
  });

  const [loading, setLoading] = useState(false);
  const { API, token, streamData, branchData, fetchSubjectsData } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [customInputs, setCustomInputs] = useState({
    subjectName: false,
    subjectCode: false,
    branchName: false,
    streamName: false,
    notesTitle: false,
  });

  useEffect(() => {
    fetchDropdownOptions();
  }, [branchData, streamData]);

  useEffect(() => {
    if (formData.semesterNumber && formData.branchName && formData.streamName) {
      const selectedBranch = dropdownOptions.branches.find(
        (branch) => branch.branchName === formData.branchName
      );

      if (selectedBranch) {
        fetchSubjects(
          formData.semesterNumber,
          formData.streamName,
          selectedBranch.slug
        );
      }
    } else {
      setDropdownOptions((prev) => ({
        ...prev,
        subjects: [],
      }));
      setFormData((prev) => ({
        ...prev,
        subjectName: "",
        subjectCode: "",
      }));
    }
  }, [
    formData.semesterNumber,
    formData.branchName,
    formData.streamName,
    dropdownOptions.branches,
  ]);

  const fetchDropdownOptions = async () => {
    try {
      setLoading(true);
      setDropdownOptions({
        subjects: [],
        branches: branchData || [],
        streams: streamData || [],
      });
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      setMessage({ type: "error", text: "Failed to load dropdown options" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (semesterNumber, streamName, branchSlug) => {
    try {
      console.log("Fetching subjects with:", {
        semesterNumber,
        streamName,
        branchSlug,
      });

      const subjectsData = await fetchSubjectsData(
        semesterNumber,
        streamName,
        branchSlug
      );

      console.log("Fetched subjects data:", subjectsData);

      setDropdownOptions((prev) => ({
        ...prev,
        subjects: subjectsData || [],
      }));
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setMessage({ type: "error", text: "Failed to load subjects" });
      setDropdownOptions((prev) => ({
        ...prev,
        subjects: [],
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "branchName") {
        const selectedBranch = dropdownOptions.branches.find(
          (branch) => branch.branchName === value
        );

        if (selectedBranch) {
          updated.streamName = selectedBranch.streamName;
        } else {
          updated.streamName = "";
        }

        updated.subjectName = "";
        updated.subjectCode = "";
      }

      if (field === "semesterNumber") {
        updated.subjectName = "";
        updated.subjectCode = "";
      }

      if (field === "subjectName") {
        const selectedSubject = dropdownOptions.subjects.find(
          (subject) => subject.subjectName === value
        );
        if (selectedSubject) {
          updated.subjectCode = selectedSubject.subjectCode;
        }
      }

      if (field === "subjectCode") {
        const selectedSubject = dropdownOptions.subjects.find(
          (subject) => subject.subjectCode === value
        );
        if (selectedSubject) {
          updated.subjectName = selectedSubject.subjectName;
        }
      }

      return updated;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setMessage({ type: "error", text: "Please select a PDF file only" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File size should be less than 10MB",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.file) {
      setMessage({ type: "error", text: "Please select a file to upload" });
      return;
    }

    if (
      !formData.notesType ||
      !formData.subjectCode ||
      !formData.subjectName ||
      !formData.branchName ||
      !formData.streamName ||
      !formData.semesterNumber
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    try {
      setUploading(true);
      setMessage({ type: "info", text: "Uploading file..." });

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.file);
      uploadFormData.append("notesTitle", formData.notesTitle);
      uploadFormData.append("notesType", formData.notesType);
      uploadFormData.append("subjectName", formData.subjectName);
      uploadFormData.append("subjectCode", formData.subjectCode);
      uploadFormData.append("branchName", formData.branchName);
      uploadFormData.append("streamName", formData.streamName);
      uploadFormData.append("semesterNumber", formData.semesterNumber);

      console.log("Sending form data:", {
        notesType: formData.notesType,
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        branchName: formData.branchName,
        streamName: formData.streamName,
        semesterNumber: formData.semesterNumber,
        notesTitle: formData.notesType,
        file: formData.file.name,
      });

      const response = await fetch(`${API}/api/upload/form`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload file");
      }

      setMessage({ type: "success", text: "File uploaded successfully!" });

      setFormData({
        notesType: "",
        subjectName: "",
        subjectCode: "",
        branchName: "",
        streamName: "",
        semesterNumber: "",
        file: null,
        notesTitle: "",
      });

      setCustomInputs({
        subjectName: false,
        subjectCode: false,
        branchName: false,
        streamName: false,
        notesTitle: false,
      });

      const fileInput = document.getElementById("upload-form-file-input");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to upload file",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="upload-form-container">
        <div className="upload-form-loading">Loading form options...</div>
      </div>
    );
  }

  return (
    <div className="upload-form-container">
      <div className="upload-form-card">
        <h2 className="upload-form-title">📚 Upload Notes</h2>

        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`upload-form-alert ${message.type}`}>
              {message.text}
            </div>
          )}

          <SelectFile formData={formData} handleChange={handleFileChange} />

          <FormNotesType
            onChange={(e) => handleInputChange("notesType", e.target.value)}
            value={formData.notesType}
          />

          <FormNotesTitle
            value={formData.notesTitle}
            onChange={(value) => handleInputChange("notesTitle", value)}
          />

          <FormStreams
            onclick={() => handleCustomToggle("streamName")}
            customInput={customInputs.streamName}
            value={formData.streamName}
            onChange={(e) => handleInputChange("streamName", e.target.value)}
            options={dropdownOptions}
          />

          <FormBranchName
            value={formData.branchName}
            onChange={(value) => handleInputChange("branchName", value)}
            options={dropdownOptions}
            customInput={customInputs.branchName}
            onToggleCustom={() => handleCustomToggle("branchName")}
          />

          <FormSemesterNumber
            value={formData.semesterNumber}
            onChange={(value) => handleInputChange("semesterNumber", value)}
          />

          <FormSubjectName
            value={formData.subjectName}
            onChange={(value) => handleInputChange("subjectName", value)}
            options={dropdownOptions}
            disabled={
              !formData.semesterNumber ||
              !formData.branchName ||
              !formData.streamName
            }
          />

          <FormSubjectCode
            value={formData.subjectCode}
            onChange={(value) => handleInputChange("subjectCode", value)}
            options={dropdownOptions}
            disabled={
              !formData.semesterNumber ||
              !formData.branchName ||
              !formData.streamName
            }
          />

          <FormSubmitButton uploading={uploading} onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
