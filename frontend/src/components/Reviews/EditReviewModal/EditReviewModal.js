import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateReviewThunk } from "../../../store/reviews";

function EditReviewModal({ review, setReloadPage }) {
  const [updatedReview, setUpdatedReview] = useState(review.review);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async () => {
    const updatedReviewDetails = {
      ...review,
      review: updatedReview,
    };
    dispatch(updateReviewThunk(review.id, updatedReviewDetails));
    closeModal();
    setReloadPage(true);
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
