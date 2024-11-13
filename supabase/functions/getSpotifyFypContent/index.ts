// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");
type SpotifyResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Array<{
    album: {
      album_type: string;
      total_tracks: number;
      available_markets: string[];
      href: string;
      id: string;
      images: Array<
        { url: string; height: number | null; width: number | null }
      >;
      name: string;
      release_date: string;
      release_date_precision: string;
      type: string;
      uri: string;
      artists: Array<{
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>;
    };
    artists: Array<{
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    href: string;
    id: string;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
    external_ids: { isrc: string };
  }>;
};
// TrackItem interface

Deno.serve(async (req) => {
  const accessToken = await req.json().then((data) => {
    return data.accessToken;
  });
  const spotifyResponse = await fetch(
    "https://api.spotify.com/v1/me/top/tracks",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!spotifyResponse.ok) {
    const error = await spotifyResponse.json();
    return new Response(JSON.stringify({ err_Spotify_Content: error }), {
      status: spotifyResponse.status,
    });
  }
  const tops: SpotifyResponse = await spotifyResponse.json();

  const names: string[] = tops.items.map((item) => item.name);
  const artists: string[] = tops.items.map((item) => item.artists[0].name);
  const images: string[] = tops.items.map((item) => item.album.images[0].url);
  const albumNames: string[] = tops.items.map((item) => item.album.name);
  const isrc = tops.items.map((item) => item.external_ids.isrc);
  const combinedArray = names.map((name, index) => ({
    name: name,
    artist: artists[index],
    image: images[index],
    albumName: albumNames[index],
    isrc: isrc[index],
  }));

  return new Response(JSON.stringify(combinedArray), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
