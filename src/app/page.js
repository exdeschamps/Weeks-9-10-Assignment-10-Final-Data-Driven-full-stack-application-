import AlbumListings from "@/src/components/AlbumListings.jsx";
import { getAlbums } from "@/src/lib/firebase/albumFirestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const albums = await getAlbums(
    getFirestore(firebaseServerApp),
    searchParams
  );
  return (
    <main className="main__home">
      <AlbumListings
        initialAlbums={albums}
        searchParams={searchParams}
      />
    </main>
  );
}
