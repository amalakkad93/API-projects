import React from "react";
import Masonry from "react-masonry-css";
import "./PhotoGalleryModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PhotoGalleryModal = ({ isOpen, images, closeModal }) => {
  if (!isOpen) {
    return null;
  }

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    740: 1,
    700: 1,
    500: 1,
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close-button" onClick={closeModal}>
        <FontAwesomeIcon icon={faTimes} style={{ color: 'black' }} />
        </button>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={`Spot Image ${index + 1}`}
                className="masonry-image"
              />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
