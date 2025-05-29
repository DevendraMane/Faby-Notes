const FormStreams = ({ onclick, customInput, value, onChange, options }) => {
  return (
    <div className="upload-form-field">
      <div className="upload-form-field-header">
        <label className="upload-form-label">Stream Name *</label>
        <button
          type="button"
          onClick={onclick}
          className="upload-form-toggle-btn"
        >
          {customInput ? "Use Dropdown" : "Custom Input"}
        </button>
      </div>
      {customInput ? (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter custom stream name"
          className="upload-form-input"
        />
      ) : (
        <select
          value={value}
          onChange={onChange}
          className="upload-form-select"
        >
          <option value="">Select stream</option>
          {options.streams.map((stream) => (
            <option key={stream._id} value={stream.name}>
              {stream.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FormStreams;
