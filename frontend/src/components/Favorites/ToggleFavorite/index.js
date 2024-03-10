import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../../store/favorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const ToggleFavorite = ({ spotId, isFavorited, favoriteId }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const handleToggleFavorite = (event) => {
    event.stopPropagation();
    if (!sessionUser) {
      alert("You must be logged in to toggle favorites.");
      return;
    }

    if (isFavorited) {
      dispatch(removeFavorite(favoriteId));
    } else {
      dispatch(addFavorite(sessionUser.id, spotId));
    }
  };



  return (
    <div onClick={handleToggleFavorite} style={{ display: "inline-block" }}>
      <FontAwesomeIcon
        icon={faHeart}
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: isFavorited ? "red" : "rgba(0, 0, 0, 0.5)",
          fontSize: "24px",
          filter: isFavorited ? "none" : "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
        }}
      />
    </div>
    // <div
    //   onClick={handleToggleFavorite}
    //   style={{ cursor: "pointer", display: "inline-block" }}
    // >
    //   <svg
    //     width="24px"
    //     height="24px"
    //     viewBox="0 0 24 24"
    //     fill={isFavorited ? "red" : "rgba(0,0,0,0.5)"}
    //     stroke={isFavorited ? "red" : "white"}
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //     style={{
    //       transition: "all 0.3s ease",

    //       filter: isFavorited ? "none" : "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
    //     }}
    //   >
    //     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    //   </svg>
    // </div>
  );
};

export default ToggleFavorite;
