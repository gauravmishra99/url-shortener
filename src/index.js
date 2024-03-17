const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const shortURLRoute = require("./routes/short-url");

const pool = require("./db");

pool.connect((err, client, done) => {
    if (err) throw new Error(err.message);
    console.log("Connected to DB");
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/shorten", shortURLRoute);
app.get("/:id", async (req, res) => {
    const id = req.params.id;
    
    const client = await pool.connect();
    
    const sql = `Select longurl from shortenurls where shorturl = $1;`
    const value = [id];
    const response = await client.query(sql, value);
    if(response.length == 0) res.sendStatus(404);
    
    const longURL = response.rows[0].longurl;
    client.release();

    res.redirect(longURL);
})
app.get("/", (req, res) => {
    res.render("index");
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Application is running on port : ${port}`);
});
