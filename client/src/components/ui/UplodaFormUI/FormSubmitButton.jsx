const FormSubmitButton = ({ uploading, onClick }) => {
  return (
    <button
      type="submit"
      disabled={uploading}
      onClick={onClick}
      className={`upload-form-submit-btn ${uploading ? "disabled" : "enabled"}`}
    >
      {uploading ? (
        <>
          <span className="upload-form-loading-spinner"></span>
          Uploading...
        </>
      ) : (
        <>📤 Upload Notes</>
      )}
    </button>
  );
};

export default FormSubmitButton;
