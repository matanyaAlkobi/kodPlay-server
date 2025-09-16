import 'dotenv/config'
const clientId =process.env.Client_ID;
const clientSecret = process.env.Client_secret;
const redirectUri = "https://39144c13d311.ngrok-free.app/spotify/callback";

export async function getlinkSpotify(req, res) {
  try {
    const scope = "playlist-read-private";

    const spotifyAuthUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}`;

    res.redirect(spotifyAuthUrl);
  } catch (error) {
    console.error("Error in getlinkSpotify:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function token(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Missing code" });
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    console.log("Spotify token response:", data);

    res.send(`
    <script>
    window.opener.postMessage(
      {
        access_token: "${data.access_token}",
        refresh_token: "${data.refresh_token}",
        expires_in: ${data.expires_in}
      },
      "*"
    );
    window.close();
  </script>
`);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getfromSpotify(req, res) {
  try {
    const type = req.params.type; 
    const query = req.params.query;

     const authHeader= req.headers.authorization;
    const token = authHeader.replace("Bearer", "").trim();
    
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }
   const spotifyRes = await fetch(
  `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=5`,
  { headers: {
     Authorization: `Bearer ${token}` } });

    const data = await spotifyRes.json();
    res.json(data[`${type}s`].items); 
  } catch (error) {
    console.error("Error fetching from Spotify:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
