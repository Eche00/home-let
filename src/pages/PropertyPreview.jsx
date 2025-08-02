import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import "../styles/PropertyPreview.css";
import RelatedProperties from "../components/RelatedProperties";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHomeLgAlt,
  faMapMarkerAlt,
  faRestroom,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import useFormData, { handleMakeInspection } from "../lib/inspectionLogic";

// Skeleton Component
const Skeleton = () => {
  return (
    <div className="skeleton">
      <div className="skeleton-img"></div>
      <div className="skeleton-details">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, closeModal, property }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open
  // get current date && time
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTime = now.toISOString().split("T")[1].substring(0, 5);
  const [timeMin, setTimeMin] = useState(currentTime);

  const navigate = useNavigate();
  const {
    formData,
    error,
    formattedDate,
    formattedTime,
    handleChange,
    setFormData,
    setError,
    setLoading,
    loading,
  } = useFormData(property, auth);

  // Update the time when the day changes
  useEffect(() => {
    if (formData?.date === today) {
      // If today's date, set time min to current time
      setTimeMin(currentTime);
    } else if (formData?.date > today) {
      // If future date, allow any time
      setTimeMin("00:00");
    }
  }, [formData.date]);

  // handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(false);
    try {
      handleMakeInspection(formData);
      navigate("/inspection");
      setFormData({ time: "", date: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="formModalContainer">
        <div className="  formModalSubContainer">
          <img
            src={property?.imageUrls[0]}
            className=" formModalImage"
            alt="Home Let INC"
          />

          <div className=" modalContainer">
            <section className="previewPropertyInspectButtonS">
              <button
                onClick={closeModal}
                className="previewPropertyInspectButton">
                X
              </button>
            </section>
            <h2 className="previewPropertyTitle">{property.title}</h2>
            <p className="previewPropertyAddress">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> <b>Address: </b>
              {property.address}, {property.city}, {property.state} State
            </p>
            <p className="previewPropertyAddress">Physical Inspection</p>
            <form onSubmit={handleSubmit} className=" containerForm">
              {/* inputs  */}

              <section className=" eachModalInputSection">
                <p className="inputModalText">calendar</p>
                <input
                  className="eachModalInput"
                  type="date"
                  id="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                {formattedDate && <p>Date: {formattedDate}</p>}
              </section>
              <section className=" eachModalInputSection">
                <p className="inputModalText">Time</p>
                <input
                  className="eachModalInput"
                  type="time"
                  id="time"
                  name="time"
                  min={timeMin}
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
                {formattedTime && <p>Time: {formattedTime}</p>}
              </section>

              <section className="modalButtonContainer">
                <button
                  disabled={loading}
                  className="  modalButton"
                  type="submit">
                  {loading ? "Loading.." : "Submit"}
                </button>
              </section>
              <section className="formStatusSection">
                {error && (
                  <p className="formError">
                    Form Submission failed, Please try again later.
                  </p>
                )}
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function PropertyPreview() {
  // getting propertyId
  const { propertyId } = useParams();
  const [property, setProperty] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // state for modal

  useEffect(() => {
    // getting the properties from the db
    const propertyDataRef = collection(db, "propertyData");
    getDocs(propertyDataRef)
      .then((querySnap) => {
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));
        // filtering the db to check for the id which matches the propertyId
        const selectedProperty = propertyData.find(
          (prop) => prop.id === propertyId
        );
        setProperty(selectedProperty);
        setIsLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
        setIsLoading(false); // In case of an error, stop loading
      });
  }, [propertyId]);

  // Function to handle modal open
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div key={property.id} className="previewPropertyContainer">
      {isLoading ? (
        <>
          {/*  Display Skeleton while loading */}
          <Skeleton />
          {/* Related Properties Component */}
          <RelatedProperties currentProperty={property} />
        </>
      ) : (
        <>
          {/* Image Section */}
          {property.imageUrls && property.imageUrls.length > 0 && (
            <div className="previewPropertyImgContainer">
              <img
                key={property.imageUrls[0]}
                className="previewPropertyImgLarge"
                src={property.imageUrls[0]}
                alt="Property"
                onClick={() => window.open(property.imageUrls[0], "_blank")}
              />
              <div className="previewPropertyImgSideContainer">
                {property.imageUrls.slice(1, 3).map((url) => (
                  <img
                    key={url}
                    className="previewPropertyImg"
                    src={url}
                    alt="Property"
                    onClick={() => window.open(url, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Property Title and Details */}
          <div className="previewDetails">
            <div className="flex-container">
              <div className="flex-left">
                <h2 className="previewPropertyTitle">
                  {property.title} ({property.houseType})
                </h2>
                <p className="previewPropertyAddress">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> <b>Address: </b>
                  {property.address}, {property.city}, {property.state} State
                  <p>&#8358; {Number(property?.price).toLocaleString()}</p>
                  <p className="previewPropertyAddress">
                    <b>VendorName:</b> <span>{property?.creatorName}</span>
                  </p>
                </p>
              </div>
              <div className="flex-right">
                {/* video section */}
                {property.video?.url && property.video.url !== "" && (
                  <div className="previewPropertyVideoContainer">
                    <a
                      href={property.video.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      <button className="previewPropertyVideoButton">
                        Request Virtual Tour
                      </button>
                    </a>
                  </div>
                )}
                {/* To Open the agent's profile url */}
                <button
                  className="previewPropertyInspectButton"
                  onClick={openModal} // open the modal on click
                >
                  Physical Inspection
                </button>
              </div>
            </div>

            {/* Property Description */}
            <div className="previewPropertyDescription">
              {property.description} with {property.amenities}
              {/* Room Details */}
              <div className="previewPropertyRoomSection">
                <p>For {property.type}</p>
                <p>
                  <FontAwesomeIcon icon={faRestroom} /> {property.bathrooms}{" "}
                  Bathrooms
                </p>
                <p>
                  <FontAwesomeIcon icon={faHomeLgAlt} /> {property.bedrooms}{" "}
                  Bedrooms
                </p>
              </div>
              <div>
                A physical tour of the building attracts an inspection fee of
                ₦4000. Once requested, an inspection date will be set to
                physically inspect the {property.houseType}.
              </div>
            </div>
          </div>

          {/* Related Properties Component */}
          <RelatedProperties currentProperty={property} />

          {/* Modal Component */}
          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            property={property}
          />
        </>
      )}
    </div>
  );
}

export default PropertyPreview;
