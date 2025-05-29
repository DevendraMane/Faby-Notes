const FormSemesterNumber = ({ value, onChange }) => {
  return (
    <div className="upload-form-field">
      <label className="upload-form-label">Semester Number *</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="upload-form-select"
      >
        <option value="">Select semester</option>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <option key={sem} value={sem.toString()}>
            Semester {sem}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSemesterNumber;
