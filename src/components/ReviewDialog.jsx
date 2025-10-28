"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import RatingPicker from "@/src/components/RatingPicker.jsx";
import { handleReviewFormSubmission } from "@/src/app/actions.js";

const ReviewDialog = ({
  isOpen,
  handleClose,
  review,
  onChange,
  userId,
  id,
}) => {
  const dialog = useRef();

  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen, dialog]);

  const handleClick = (e) => {
    if (e.target === dialog.current) {
      handleClose();
    }
  };

  return (
    <dialog ref={dialog} onMouseDown={handleClick}>
      <form
        action={handleReviewFormSubmission}
        onSubmit={() => {
          handleClose();
        }}
      >
        <header>
          <h3>Review this Album</h3>
        </header>
        <article>
          <RatingPicker />

          <p>
            <input
              type="text"
              name="text"
              id="review"
              placeholder="Share your thoughts about this album..."
              required
              value={review.text}
              onChange={(e) => onChange(e.target.value, "text")}
            />
          </p>

          <input type="hidden" name="albumId" value={id} />
          <input type="hidden" name="userId" value={userId} />
        </article>
        <footer>
          <menu>
            <button
              autoFocus
              type="reset"
              onClick={handleClose}
              className="button--cancel"
            >
              Cancel
            </button>
            <button type="submit" value="confirm" className="button--confirm">
              Submit Review
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default ReviewDialog;
