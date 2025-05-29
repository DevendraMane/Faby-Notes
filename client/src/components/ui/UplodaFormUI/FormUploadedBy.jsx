"use client";

const FormUploadedBy = ({ value, onChange }) => {
  return (
    <div className="upload-form-field">
      <label className="upload-form-label">Uploaded By *</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name"
        className="upload-form-input"
        required
      />
      <small className="upload-form-hint">
        This name will be associated with the uploaded document
      </small>
    </div>
  );
};

export default FormUploadedBy;
