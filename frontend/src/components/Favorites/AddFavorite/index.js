import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../../../store/favorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const AddFavorite = ({ userId, spotId, isFavorited }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const handleAddFavorite = (event) => {
    event.stopPropagation();
    if (sessionUser) {
      dispatch(addFavorite(sessionUser.id, spotId));
    } else {
      alert("You must be logged in to add favorites.");
    }
  };

  return (
    <div onClick={handleAddFavorite}>
      <FontAwesomeIcon
        icon={isFavorited ? solidHeart : regularHeart}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default AddFavorite;
