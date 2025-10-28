"use client";

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getAlbumsSnapshot } from "@/src/lib/firebase/albumFirestore.js";
import Filters from "@/src/components/Filters.jsx";

const AlbumItem = ({ album }) => (
  <li key={album.id}>
    <Link href={`/album/${album.id}`}>
      <ActiveAlbum album={album} />
    </Link>
  </li>
);

const ActiveAlbum = ({ album }) => (
  <div>
    <ImageCover photo={album.photo} name={album.name} />
    <AlbumDetails album={album} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo} alt={name} />
  </div>
);

const AlbumDetails = ({ album }) => (
  <div className="album__details">
    <h2>{album.name}</h2>
    <h3>{album.artist}</h3>
    <AlbumRating album={album} />
    <AlbumMetadata album={album} />
  </div>
);

const AlbumRating = ({ album }) => (
  <div className="album__rating">
    <ul>{renderStars(album.avgRating)}</ul>
    <span>({album.numRatings})</span>
  </div>
);

const AlbumMetadata = ({ album }) => (
  <div className="album__meta">
    <p>{album.genre} | {album.releaseYear}</p>
  </div>
);

export default function AlbumListings({
  initialAlbums,
  searchParams,
}) {
  const router = useRouter();

  const initialFilters = {
    genre: searchParams.genre || "",
    releaseYear: searchParams.releaseYear || "",
    sort: searchParams.sort || "",
  };

  const [albums, setAlbums] = useState(initialAlbums);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getAlbumsSnapshot((data) => {
      setAlbums(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="albums">
        {albums.map((album) => (
          <AlbumItem key={album.id} album={album} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}