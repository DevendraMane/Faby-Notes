const FormNotesType = ({ onChange, value }) => {
  return (
    <div className="upload-form-field">
      <label className="upload-form-label">Notes Type *</label>
      <select value={value} onChange={onChange} className="upload-form-select">
        <option value="">Select notes type</option>
        <option value="Notes">Notes</option>
        <option value="PYQ">PYQ (Previous Year Questions)</option>
        <option value="MCQ">MCQ (Multiple Choice Questions)</option>
        <option value="Assignment">Assignment</option>
        <option value="Books">Books</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default FormNotesType;
