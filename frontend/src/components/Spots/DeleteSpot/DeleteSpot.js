import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import {deleteSpotThunk } from "../../../store/spots";
import { getOwnerAllSpotsThunk } from "../../../store/spots";
import './DeleteSpot.css'



export default function DeleteSpot({spotId}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();


  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    try {
      await dispatch(deleteSpotThunk(spotId));
      await dispatch(getOwnerAllSpotsThunk());
      closeModal();
      navigate('/owner/spots');
    } catch (error) {
      console.error("Failed to delete spot:", error);
    }
};


  return (
    <>
      <div className='tile-parent-delete-spot'>
        <div className="delete-spot-h1-p-tag">
          <h1 className="delete-spot-h1-tag">Confirm Delete</h1>
          <p className="delete-spot-p-tag">Are you sure you want to delete this spot from the listings?</p>
        </div>
        <div className="delete-keep-spot-btn1">
          <button id="delete-spot-btn" onClick={handleDelete}>Yes (Delete Spot)</button>
          <button id="cancle-spot-btn" onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </div>
    </>
  );
}
