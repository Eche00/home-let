import "../styles/loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;
