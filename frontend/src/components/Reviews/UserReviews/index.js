import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsOfCurrentUserThunk } from "../../../store/reviews";
import EditReviewModal from "../EditReviewModal/EditReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import { useModal } from "../../../context/Modal";
import "./UserReviews.css";

const UserReviews = () => {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const [reloadPage, setReloadPage] = useState(false);

  const userReviews = useSelector((state) => state.reviews.reviews.user ?? {});
  console.log("--User Reviews:", userReviews);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    dispatch(getAllReviewsOfCurrentUserThunk());
  }, [dispatch, reloadPage]);

  const openEditModal = (review) => {
    setModalContent(
      <EditReviewModal
        review={review}
        setReloadPage={() => {
          setReloadPage(prev => !prev);
        }}
      />
    );
  };

  const openDeleteModal = (reviewId, spotId) => {
    setModalContent(
      <DeleteReviewModal
        reviewId={reviewId}
        spotId={spotId}
        setReloadPage={() => {}}
      />
    );
  };

  return (
    <div className="user-reviews-container">
      <h2>My Reviews</h2>
      {Object.values(userReviews).length > 0 ? (
        Object.values(userReviews).map((review) => (
          <div key={review.id} className="review-item">
            <h3>{review.Spot.name}</h3>
            <div className="review-header">
              <span className="review-date">
                {formatDate(review.createdAt)}
              </span>
              <span className="review-rating">{"★".repeat(review.stars)}</span>
            </div>
            <p>{review.review}</p>
            <div className="review-actions">
              <button onClick={() => openEditModal(review)}>Edit Review</button>
              <button onClick={() => openDeleteModal(review.id, review.spotId)}>
                Delete Review
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>You haven't reviewed any spots yet.</p>
      )}
    </div>
  );
};

export default UserReviews;
