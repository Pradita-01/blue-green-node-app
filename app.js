const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || "1.0";

app.get("/", (req, res) => {
    res.send(`
        <h1>Blue-Green Deployment Demo</h1>
        <h2>Application Version: ${VERSION}</h2>
        <p>Node.js application is running successfully.</p>
    `);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        version: VERSION
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application running on port ${PORT}`);
});