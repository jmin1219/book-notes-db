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
const API_URL = "https://covers.openlibrary.org/b/isbn/";

async function getBooks() {
  const result = db.query();
}

// GET HOMEPAGE ie. LIBRARY CARD-VIEW
app.get("/", async (req, res) => {
  const data = await db.query(
    "SELECT * FROM books JOIN posts ON posts.book_id = books.id"
  );
  res.render("library.ejs", { books: data.rows });
});

// GET CREATE POST FORM
app.get("/new-post", (req, res) => {
  res.render("create-form.ejs");
});

// GET BOOK POST
app.get("/post/:id", (req, res) => {});

// EDIT BOOK POST
app.post("/edit-post/:id", (req, res) => {});

// SUBMIT BOOK POST
app.post("/submit-post", async (req, res) => {
  try {
    const coverUrl = API_URL + req.body.isbn + "-M.jpg";
    const book_result = await db.query(
      "INSERT INTO books (title, subtitle, authors, status, rating, coverurl) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        req.body.title,
        req.body.subtitle,
        req.body.authors,
        req.body.status,
        req.body.rating,
        coverUrl,
      ]
    );
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
