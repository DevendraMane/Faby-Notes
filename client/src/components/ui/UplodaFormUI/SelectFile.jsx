const SelectFile = ({ formData, handleChange }) => {
  return (
    <div className="upload-form-field">
      <label htmlFor="upload-form-file-input" className="upload-form-label">
        Select PDF File *
      </label>
      <input
        id="upload-form-file-input"
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="upload-form-file-input"
      />
      {formData.file && (
        <div className="upload-form-file-selected">
          ✓ Selected: {formData.file.name}
        </div>
      )}
    </div>
  );
};

export default SelectFile;
