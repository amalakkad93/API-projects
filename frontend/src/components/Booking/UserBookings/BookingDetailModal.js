import React, { useState } from "react";
import "./BookingDetailModal.css";

const BookingDetailModal = ({ booking, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = booking.Spot.SpotImages.map((image) => image.url);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>{booking.Spot.name}</h2>
        <div className="image-container">
          <img src={images[currentIndex]} alt="Spot" className="modal-image" />
          <button
            id="prevBtn"
            className="slide-btn"
            onClick={() => {
              setCurrentIndex((prevIndex) =>
              prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
            }}
          >
            &#10094;
          </button>
          <button
            id="nextBtn"
            className="slide-btn"
            onClick={() => {
              setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
              );
            }}
          >
            &#10095;
          </button>
        </div>
        <div className="modal-info">
          <p>
            <strong>Location:</strong> {booking.Spot.city}, {booking.Spot.state}
          </p>
          <p>
            <strong>Check-in:</strong> {booking.startDate}
          </p>
          <p>
            <strong>Check-out:</strong> {booking.endDate}
          </p>
        </div>
        <button onClick={onClose} className="modal-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingDetailModal;
