// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Tops } from "../spotifyTopsModel.ts";

console.log("Hello from Functions!");

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
const res: Tops = await spotifyResponse.json();

  // Transform fonksiyonu ile yanıtı sadeleştiriyoruz
  const transformTopsResponse = (res: Tops): Array<{
    isrc: string;
    name: string;
    artist: string;
    albumName: string;
    image: string;
  }> => {
    return res.items.map((item) => {
      const albumName = item.album.name;
      const artist = item.artists[0].name; 
      const name = item.name;
      const image = item.album.images.length > 0 ? item.album.images[0].url : ""; // İlk resmi almak
      const isrc = item.external_ids.isrc;

      return { isrc, name, artist, albumName, image };
    });
  };

  return new Response(JSON.stringify(transformTopsResponse(res)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
