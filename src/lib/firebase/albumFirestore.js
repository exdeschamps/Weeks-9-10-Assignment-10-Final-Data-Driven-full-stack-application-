import { generateFakeAlbumsAndReviews } from "@/src/lib/fakeAlbums.js";

import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";

export async function updateAlbumImageReference(albumId, publicImageUrl) {
  const albumRef = doc(collection(db, "albums"), albumId);
  if (albumRef) {
    await updateDoc(albumRef, { photo: publicImageUrl });
  }
}

const updateWithRating = async (transaction, docRef, newRatingDocument) => {
  const albumSnap = await transaction.get(docRef);
  if (!albumSnap.exists()) {
    return;
  }

  const albumData = albumSnap.data();
  const currentNumRatings = Number(albumData.numRatings || 0);
  const currentAvg = Number(albumData.avgRating || 0);
  const newRating = Number(newRatingDocument.rating || 0);

  const newNumRatings = currentNumRatings + 1;
  const newAvg =
    newNumRatings === 0
      ? 0
      : (currentAvg * currentNumRatings + newRating) / newNumRatings;

  transaction.update(docRef, {
    numRatings: newNumRatings,
    avgRating: newAvg,
  });
};

export async function addReviewToAlbum(firestoreDb = db, albumId, review) {
  if (!albumId) {
    throw new Error("Invalid albumId");
  }
  if (!review || typeof review.rating !== "number") {
    throw new Error("Review must include a numeric rating field");
  }

  const ratingsColRef = collection(firestoreDb, "albums", albumId, "ratings");
  const albumDocRef = doc(collection(firestoreDb, "albums"), albumId);

  await runTransaction(firestoreDb, async (transaction) => {
    const newRatingRef = doc(ratingsColRef);

    const ratingToWrite = {
      ...review,
      rating: Number(review.rating),
      timestamp: Timestamp.now(),
    };

    transaction.set(newRatingRef, ratingToWrite);
    await updateWithRating(transaction, albumDocRef, ratingToWrite);
  });
}

function applyQueryFilters(q, { genre, releaseYear, sort }) {
  if (genre) {
    q = query(q, where("genre", "==", genre));
  }
  if (releaseYear) {
    q = query(q, where("releaseYear", "==", releaseYear));
  }
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  } else if (sort === "Year") {
    q = query(q, orderBy("releaseYear", "desc"));
  }
  return q;
}

export async function getAlbums(db = db, filters = {}) {
  let q = query(collection(db, "albums"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  }));
}

export function getAlbumsSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "albums"));
  q = applyQueryFilters(q, filters);

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));

    cb(results);
  });
}

export async function getAlbumById(db, albumId) {
  if (!albumId) {
    console.log("Error: Invalid ID received: ", albumId);
    return;
  }
  const docRef = doc(db, "albums", albumId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

export function getAlbumSnapshotById(albumId, cb) {
  if (!albumId) {
    console.log("Error: Invalid albumId received: ", albumId);
    return;
  }

  const albumRef = doc(db, "albums", albumId);
  return onSnapshot(albumRef, (docSnap) => {
    if (!docSnap.exists()) {
      cb(null);
      return;
    }
    const data = {
      id: docSnap.id,
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp.toDate(),
    };
    cb(data);
  });
}

export async function getReviewsByAlbumId(db, albumId) {
  if (!albumId) {
    console.log("Error: Invalid albumId received: ", albumId);
    return;
  }

  const q = query(
    collection(db, "albums", albumId, "ratings"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  }));
}

export function getReviewsSnapshotByAlbumId(albumId, cb) {
  if (!albumId) {
    console.log("Error: Invalid albumId received: ", albumId);
    return;
  }

  const q = query(
    collection(db, "albums", albumId, "ratings"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));
    cb(results);
  });
}

export async function addFakeAlbumsAndReviews() {
  const data = await generateFakeAlbumsAndReviews();
  for (const { albumData, ratingsData } of data) {
    try {
      const docRef = await addDoc(collection(db, "albums"), albumData);

      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "albums", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      console.log("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}