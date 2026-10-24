const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, frontend JS)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint — proxies the request to OpenWeather
// This keeps the API key hidden on the server
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.API_KEY}&units=metric`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(response.status).json({ error: "City not found" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Weather API error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.listen(PORT, () => {
    console.log(`🌤️  Weather app running at http://localhost:${PORT}`);
});
