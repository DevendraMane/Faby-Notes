const FormSubjectName = ({ value, onChange, options, disabled }) => {
  return (
    <div className="upload-form-field">
      <div className="upload-form-field-header">
        <label className="upload-form-label">Subject Name *</label>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="upload-form-select"
        disabled={disabled || options.subjects.length === 0}
      >
        <option value="">
          {options.subjects.length === 0
            ? "Select semester and branch first"
            : "Select subject"}
        </option>
        {options.subjects.map((subject) => (
          <option key={subject._id} value={subject.subjectName}>
            {subject.subjectName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSubjectName;
