import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./clientApp";
import { updateAlbumImageReference } from "./albumFirestore";

export async function updateAlbumImage(albumId, image) {
  const imageUrl = await uploadImage(albumId, image);
  await updateAlbumImageReference(albumId, imageUrl);
  return imageUrl;
}

async function uploadImage(albumId, image) {
  const storageRef = ref(storage, `albums/${albumId}/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress can be tracked here if needed
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
