"use client";

import { React, useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { getAlbumSnapshotById } from "@/src/lib/firebase/albumFirestore.js";
import { useUser } from "@/src/lib/getUser";
import AlbumDetails from "@/src/components/AlbumDetails.jsx";
import { updateAlbumImage } from "@/src/lib/firebase/storage.js";

const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

export default function Album({ id, initialAlbum, initialUserId, children }) {
  const [albumDetails, setAlbumDetails] = useState(initialAlbum);
  const [isOpen, setIsOpen] = useState(false);

  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });

  const onChange = (value, name) => {
    setReview({ ...review, [name]: value });
  };

  async function handleAlbumImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateAlbumImage(id, image);
    setAlbumDetails({ ...albumDetails, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };

  useEffect(() => {
    return getAlbumSnapshotById(id, (data) => {
      setAlbumDetails(data);
    });
  }, [id]);

  return (
    <>
      <AlbumDetails
        album={albumDetails}
        userId={userId}
        handleAlbumImage={handleAlbumImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </AlbumDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <ReviewDialog
            isOpen={isOpen}
            handleClose={handleClose}
            review={review}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}