import "../styles/Contact.css";
import contactBg from "../assets/home-let-green.png";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-details-map">
        <div className="contact-details">
        <div className="contactImg">
          <img src={contactBg} alt="" />
        </div>
          <h2>Our Contact Information</h2>
          <p>
            <strong>Email:</strong> support@homelet.com
          </p>
          <p>
            <strong>Phone:</strong> +234 812 345 6789
          </p>
          <p>
            <strong>Location:</strong> 123 HomeLet Avenue, Owerri, Imo State,
            Nigeria
          </p>
        </div>
        <div className="map-container">
          <h2>Our Location</h2>
          <iframe
            title="Owerri Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1980.7636032730145!2d7.0390325!3d5.4851914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10425879d1d1b03f%3A0x576bee78df5d0b5d!2sOwerri%20Municipal%20Imo%20State!5e0!3m2!1sen!2sng!4v1697020202090!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
