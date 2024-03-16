const express = require("express");
const pool = require("../db");
const { nanoid, customAlphabet, urlAlphabet } = require("nanoid");

const router = express.Router();

router.post("/", async (req, res) => {
    const client = await pool.connect();
    const originalURL = req.body.url;
    console.log(originalURL);

    // create short URL
    const oop = nanoid(10);
    const shortURL = req.headers.host + "/" + oop;
    console.log(shortURL);

    const sql = `Insert into shortenurls (shorturl, longurl) VALUES ($1, $2)`;
    const values = [oop, originalURL];

    await client.query(sql, values);

    client.release();
    res.send({ shortenedUrl: shortURL });
});

module.exports = router;
