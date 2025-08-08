import "../styles/loading.css";

const uploadLoading = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
      <p className="loading-text">Uploading....</p>
      <p className="loading-text">Please do not leave the page till upload is done.</p>
    </div>
  );
};

export default uploadLoading;
