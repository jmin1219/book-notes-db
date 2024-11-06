import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// POSTGRESQL DATABASE
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "CP5-BookNotes",
  password: "PGDtthtp!1",
  port: 5432,
});
db.connect();

// BOOK COVER API ACCESS
const API_KEY = "";
const API_URL = "";

// GET HOMEPAGE ie. LIBRARY CARD-VIEW
app.get("/", (req, res) => {
  res.render("library.ejs");
});

// GET CREATE POST FORM
app.get("/new-post", (req, res) => {
  res.render("create-form.ejs");
});

// GET RECENT POSTS LIST (like D Sivers website)
app.get("/posts-list", (req, res) => {});

// GET BOOK POST
app.get("/post/:id", (req, res) => {});

// EDIT BOOK POST
app.post("/edit-post/:id", (req, res) => {});

// SUBMIT BOOK POST
app.post("/submit-post", async (req, res) => {
  // Add book info to book database
  try {
    const book_result = await db.query(
      "INSERT INTO books (title, subtitle, authors, status, rating, isbn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        req.body.title,
        req.body.subtitle,
        req.body.authors,
        req.body.status,
        req.body.rating,
        req.body.isbn,
      ]
    );
    console.log(book_result.rows[0].id);
    const created_date = new Date().toJSON().slice(0, 10);
    const post_result = await db.query(
      "INSERT INTO posts (content, created, book_id) VALUES ($1, $2, $3)",
      [req.body.content, created_date, book_result.rows[0].id]
    );

    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// DELETE BOOK POST
app.post("/delete-post/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
