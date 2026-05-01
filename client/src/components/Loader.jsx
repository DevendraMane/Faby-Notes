import logo from "/public/images/faby-logo.png"; // adjust path if needed

const Loader = ({ percentage = 0 }) => {
  return (
    <div className="loader-wrapper">
      <img src={logo} alt="Loading..." className="loader-logo" />
      <div className="loader-percentage">
        <div className="percentage-text">{Math.round(percentage)}%</div>
      </div>
    </div>
  );
};

export default Loader;
