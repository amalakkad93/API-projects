import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateReviewThunk,  getAllReviewsThunk} from "../../../store/reviews";
import "./EditReviewModal.css";

function EditReviewModal({ review, setReloadPage, spot }) {
  const [updatedReview, setUpdatedReview] = useState(review.review);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async () => {
    console.log('--EditReviewModal - Submitting update', { reviewId: review.id });
    const updatedReviewDetails = {
      ...review,
      review: updatedReview,
    };
    dispatch(updateReviewThunk(review.id, updatedReviewDetails));
    console.log('--EditReviewModal - Update submitted');
    // dispatch(getAllReviewsThunk(spot.id));
    // setReloadPage(true);
    setReloadPage(prev => !prev);
    closeModal();
  };

  return (
    <div className="edit-review-modal-container">
    <textarea
      className="edit-review-textarea"
      value={updatedReview}
      onChange={(e) => setUpdatedReview(e.target.value)}
    />
    <div className="edit-review-modal-actions">
      <button className="edit-review-cancel-btn" onClick={closeModal}>Cancel</button>
      <button className="edit-review-submit-btn" onClick={handleSubmit}>Update Review</button>
    </div>
  </div>
  );
}

export default EditReviewModal;
