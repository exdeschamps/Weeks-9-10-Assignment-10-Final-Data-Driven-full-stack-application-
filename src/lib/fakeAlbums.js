import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomAlbumData } from "@/src/lib/randomAlbumData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeAlbumsAndReviews() {
  const albumsToAdd = 5;
  const data = [];

  for (let i = 0; i < albumsToAdd; i++) {
    const albumTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this album
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(albumTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomAlbumData.albumReviews[
            randomNumberBetween(0, randomAlbumData.albumReviews.length - 1)
          ].rating,
        text: randomAlbumData.albumReviews[
          randomNumberBetween(0, randomAlbumData.albumReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    const albumData = {
      genre:
        randomAlbumData.genres[
          randomNumberBetween(0, randomAlbumData.genres.length - 1)
        ],
      name: randomAlbumData.albumNames[
        randomNumberBetween(0, randomAlbumData.albumNames.length - 1)
      ],
      artist: randomAlbumData.artists[
        randomNumberBetween(0, randomAlbumData.artists.length - 1)
      ],
      avgRating,
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      releaseYear: randomNumberBetween(1960, 2025),
      photo: `https://picsum.photos/seed/${randomNumberBetween(1, 1000)}/300/300`,
      timestamp: albumTimestamp,
    };

    data.push({
      albumData,
      ratingsData,
    });
  }
  return data;
}