import React, { useEffect, useState } from "react";
import "../styles/Inspection.css";
import { auth } from "../lib/firebase";
import {
  handleStatusChange,
  useInspectionsData,
} from "../lib/inspectionDisplayLogic";
import Loading from "../components/loading";

function Inspection() {
  const currentUser = auth.currentUser;
  const { matchedData, vendor, client } = useInspectionsData(currentUser);

  const InspectionCard = ({ inspect }) => (
    <div className="inpectionContainer">
      <div className="inpectionsubContainer">
        {/* Schedule Section */}
        <section className="inspectorPropertySchedule">
          <div className="inspectionPropertyAddressContainer">
            <p className="place">DATE</p>
            <p className="scheduleDetail">
              {inspect.date || "No date available"}
            </p>
            <p className="place">TIME</p>
            <p className="scheduleDetail">
              {inspect.time || "No time available"}
            </p>
          </div>
        </section>

        {/* Place Section */}
        <section className="inspectorPropertySchedule">
          <div className="inspectionPropertyAddressContainer">
            <p className="place">PLACE</p>
            <p className="placeB">
              {inspect.property?.address || "Address not provided"}
            </p>
            <p className="placeC">
              Please note that no harmful substance should be brought to this
              inspection.
            </p>

            {/* Action buttons for Vendor or Client */}
            {vendor && inspect.status === "Pending" ? (
              <div className="vButtonContainer">
                <button
                  className="accept"
                  onClick={() =>
                    handleStatusChange(
                      inspect.id,
                      inspect.submittedAt,
                      "Accepted"
                    )
                  }>
                  Accept
                </button>
                <button
                  className="reject"
                  onClick={() =>
                    handleStatusChange(
                      inspect.id,
                      inspect.submittedAt,
                      "Rejected"
                    )
                  }>
                  Reject
                </button>
              </div>
            ) : (
              vendor && (
                <div className="vButtonContainer">
                  <p
                    className={` ${
                      (inspect.status === "Pending" && "") ||
                      (inspect.status === "Rejected" && "reject") ||
                      (inspect.status === "Accepted" && "accept")
                    } 
                 
                `}>
                    You {inspect.status} this request.
                  </p>
                </div>
              )
            )}
            {!vendor && (
              <div className="vButtonContainer">
                <p
                  className={` ${
                    (inspect.status === "Pending" && "pending") ||
                    (inspect.status === "Rejected" && "reject") ||
                    (inspect.status === "Accepted" && "accept")
                  } 
                       
                      `}>
                  {inspect.status}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Property Section */}
        <section className="inspectorPropertyDetails">
          <img
            className="inspectorPropertyImage"
            src={inspect.property?.imageUrls[0] || "/default-image.png"}
            alt="Property"
          />
          <p className="inspectorPropertyTitle">
            {inspect.property?.title || "Property title unavailable"}
          </p>
        </section>
      </div>
    </div>
  );

  return (
    <div className="inspectionC">
      <h3 className="inspectionH">Property Inspections</h3>

      {matchedData.length ? (
        matchedData
          .filter(
            (inspect) =>
              (vendor && inspect.id.endsWith(currentUser.uid)) ||
              (client && inspect.userReqId === currentUser.uid)
          )
          .map((inspect, index) => (
            <InspectionCard key={index} inspect={inspect} />
          ))
      ) : (
        <div><Loading /></div>
      )}
    </div>
  );
}

export default Inspection;
