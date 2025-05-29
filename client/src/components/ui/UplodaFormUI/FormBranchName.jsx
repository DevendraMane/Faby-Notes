const FormBranchName = ({
  value,
  onChange,
  options,
  customInput,
  onToggleCustom,
}) => {
  return (
    <div className="upload-form-field">
      <div className="upload-form-field-header">
        <label className="upload-form-label">Branch Name *</label>
        <button
          type="button"
          onClick={onToggleCustom}
          className="upload-form-toggle-btn"
        >
          {customInput ? "Use Dropdown" : "Custom Input"}
        </button>
      </div>
      {customInput ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter custom branch name"
          className="upload-form-input"
        />
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="upload-form-select"
        >
          <option value="">Select branch</option>
          {options.branches.map((branch) => (
            <option key={branch._id} value={branch.branchName}>
              {branch.branchName} ({branch.shortform})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FormBranchName;
