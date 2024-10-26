import React from "react";
import "../styles/Inspection.css";

function Inspection() {
  return (
    <div className="inpectionContainer">
      <h3 className="inpectionH">Inspection (dummy)</h3>
      <div className="inpectionsubContainer">
        {/* schedule section  */}
        <section className="inspectorPropertySchedule">
          <div className="inspectionPropertyAddressContainer">
            <p className="place">DATE</p>
            <p className="scheduleDetail">25th, August 2024</p>
            <p className="place">TIME</p>
            <p className="scheduleDetail">09:00 WAT</p>
          </div>
        </section>

        {/* schedule section  */}
        <section className="inspectorPropertySchedule">
          <span>i</span>
          <div className="inspectionPropertyAddressContainer">
            <p className="place">PLACE</p>
            <p className="placeB">22 university market road, Nsukka, Enugu</p>
            <p className="placeC">
              please note that no harmful substance should be rought in this
              inpection.
            </p>
          </div>
        </section>

        {/* property section  */}
        <section className="inspectorPropertyDetails">
          <img className="inspectorPropertyImage" src="" alt="" />
          <p className="inspectorPropertyTitle">2 bedroom flat</p>
        </section>
      </div>
    </div>
  );
}

export default Inspection;
