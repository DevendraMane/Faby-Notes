import logo from "/public/images/faby-logo.png"; // adjust path if needed

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <img src={logo} alt="Loading..." className="loader-logo" />
    </div>
  );
};

export default Loader;
