const FormNotesTitle = ({
  value,
  onChange,
  placeholder = "Enter notes title ",
}) => {
  return (
    <div className="upload-form-field">
      <div className="upload-form-field-header">
        <label className="upload-form-label">Notes Title *</label>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="upload-form-input"
      />
    </div>
  );
};

export default FormNotesTitle;
