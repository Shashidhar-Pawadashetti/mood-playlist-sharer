const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = 5000;
app.use(cors({
    origin: 'https://charming-blancmange-51ebdd.netlify.app'
}));


app.use(express.json());

// Get Spotify access token
async function getAccessToken() {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

    const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data.access_token;
}

// Get playlists by mood
app.get("/playlists", async (req, res) => {
    try {
        const mood = req.query.mood || "happy";
        // console.log("Received mood:", mood); // ADD THIS

        const token = await getAccessToken();
        // console.log("Got token:", token ? "Yes" : "No"); // ADD THIS

        const result = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: mood, type: "playlist", limit: 8 }
        });

        const playlists = result.data.playlists.items
        .filter(pl => pl && pl.name && pl.external_urls && pl.images) // skip broken entries
        .map((pl) => ({
        name: pl.name,
        url: pl.external_urls.spotify,
        image: pl.images[0]?.url || "", // fallback to empty string if no image
    }));

        res.json(playlists);
    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message || err);
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

