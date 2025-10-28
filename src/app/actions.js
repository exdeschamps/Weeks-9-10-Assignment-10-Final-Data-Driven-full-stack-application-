"use server";

import { addReviewToAlbum } from "@/src/lib/firebase/albumFirestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

export async function handleReviewFormSubmission(data) {
  const { albumId, rating, text, user } = data;
  const userApp = await getAuthenticatedAppForUser();
  const db = getFirestore(userApp);

  await addReviewToAlbum(db, albumId, {
    rating: Number(rating),
    text,
    user,
  });
}
