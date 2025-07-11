import "../styles/About.css";
import missionImg from "../assets/mission.jpg";
import WhatWeOffer from "../assets/image5.jpg";
import WhyChooseUs from "../assets/Aboutbg.jpg";
import AboutBg from "../assets/Aboutbg2.jpg";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-welcome">
        <div className="about-content">
          <h1 className="about-title">Welcome to HomeLet</h1>
          <p className="about-description">
            Your one-stop platform for exceptional real estate listings and
            Airbnb-style accommodations. At HomeLet, we bridge the gap between
            property owners and seekers, creating a seamless experience for
            everyone involved.
          </p>
        </div>
        <div className="about-image">
          <img src={AboutBg} alt="Welcome to HomeLet" />
        </div>
      </div>
      <div className="section-container">
        <div className="about-section">
          <h2 className="about-subtitle">Our Mission</h2>
          <p className="about-text">
            To make real estate and short-term stays more accessible,
            transparent, and convenient. Whether you’re looking for your dream
            home, a rental property, or a cozy Airbnb stay, we’re here to guide
            you every step of the way.
          </p>
          <div className="missionImg textImg">
            <img src={missionImg} alt="" />
          </div>
        </div>

        <div className="about-section">
          <h2 className="about-subtitle">What We Offer</h2>
          <ul className="about-list">
            <li>
              Curated real estate listings for buying, selling, or renting.
            </li>
            <li>
              A wide range of Airbnb-style accommodations for short stays.
            </li>
            <li>
              Advanced filtering options to find properties that match your
              needs.
            </li>
            <li>
              Secure payment systems and verified listings to ensure trust and
              safety.
            </li>
          </ul>
          <div className="missionImg textImg">
            <img src={WhatWeOffer} alt="" />
          </div>
        </div>

        <div className="about-section">
          <h2 className="about-subtitle">Why Choose Us?</h2>
          <p className="about-text">
            At HomeLet, we prioritize customer satisfaction and innovation. We
            understand the challenges of finding the perfect property or
            temporary home, and our platform is designed to simplify this
            process. With a dedicated support team and user-friendly tools,
            we’re redefining how real estate and Airbnb experiences should be.
          </p>
          <div className="missionImg textImg">
            <img src={WhyChooseUs} alt="" />
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default About;
