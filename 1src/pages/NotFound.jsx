import "../styles/loading.css";

const NotFound = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
      <p className="loading-text">
        This link does not exist or you do not have enough  access.</p>
    </div>
  );
};

export default NotFound;
