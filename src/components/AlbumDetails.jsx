import React from "react";
import renderStars from "@/src/components/Stars.jsx";

const AlbumDetails = ({
  album,
  userId,
  handleAlbumImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="img__section">
      <img src={album.photo} alt={album.name} />

      <div className="actions">
        {userId && (
          <img
            alt="review"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleAlbumImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{album.name}</h2>
          <h3>{album.artist}</h3>

          <div className="album__rating">
            <ul>{renderStars(album.avgRating)}</ul>
            <span>({album.numRatings})</span>
          </div>

          <p>{album.genre} | {album.releaseYear}</p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default AlbumDetails;