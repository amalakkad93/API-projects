import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateReviewThunk } from '../../../store/reviews';

function EditReviewModal({ review, setReloadPage }) {
  const [updatedReview, setUpdatedReview] = useState(review.review);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
      dispatch(updateReviewThunk(review.id, review));
      setReloadPage(true);
    };


  return (
    <div>
      <textarea value={updatedReview} onChange={(e) => setUpdatedReview(e.target.value)} />
      <button onClick={handleSubmit}>Update Review</button>
    </div>
  );
};
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { updateReviewThunk } from '../../../store/reviews';

function EditReviewModal({ review, setReloadPage }) {
  const [updatedReview, setUpdatedReview] = useState(review.review);
  const dispatch = useDispatch();

  // Update local state if the review prop changes
  useEffect(() => {
    setUpdatedReview(review.review);
  }, [review.review]);

  const handleSubmit = async () => {
      // Send only the updated review text, not the entire review object
      dispatch(updateReviewThunk(review.id, { review: updatedReview }));
      setReloadPage(true);
  };

  return (
    <div>
      <textarea value={updatedReview} onChange={(e) => setUpdatedReview(e.target.value)} />
      <button onClick={handleSubmit}>Update Review</button>
    </div>
  );
}

export default EditReviewModal;





// import { useParams } from "react-router-dom";
// import ReviewForm from './ReviewForm';
// import { getAllReviewsThunk, createReviewThunk, updateReviewThunk } from "../../../store/reviews";

// export default function  EditReviewForm() {

//   const { reviewId } = useParams();
//   return (
//     <>
//     <ReviewForm
//       formType="Edit"
//       reviewId={reviewId}
//     />
//     </>
//     );
// }



// import ReviewForm from './ReviewForm';

// import { useSelector } from 'react-redux';
// import { getReview, editReview } from "../../../store/reviews";

// const EditReviewForm = ({ reviewId, closeForm }) => {
//   const review = useSelector(getReview(reviewId));

//   return (
//     <ReviewForm
//       review={review}
//       formType="Update Review"
//       onSubmit={editReview}
//       closeForm={closeForm}
//     />
//   );
// }

// export default EditReviewForm;
