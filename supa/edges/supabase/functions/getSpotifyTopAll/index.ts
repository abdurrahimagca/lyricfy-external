import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  console.log("func gonna execeute");

  try {
    const body = await req.json();
    const accessToken = body.accessToken;

    console.log(accessToken);
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify({ spotify_error: error }), {
        status: response.status,
      });
    }

    const data = await response.json();
    console.log(data);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An error occurred" + error }),
      { status: 500 },
    );
  }
});
