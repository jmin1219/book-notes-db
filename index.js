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

async function getBooksData() {
  const result = await db.query(
    "SELECT * FROM books JOIN posts ON posts.book_id = books.id ORDER BY books.id ASC"
  );
  return result;
}

// GET HOMEPAGE ie. LIBRARY CARD-VIEW
app.get("/", async (req, res) => {
  try {
    const data = await getBooksData();
    res.render("library.ejs", { books: data.rows });
  } catch (error) {
    console.error(`Failed to get books data: ${error}`);
  }
});

// GET CREATE POST FORM
app.get("/new-post", (req, res) => {
  res.render("create-form.ejs");
});

// GET BOOK POST
app.get("/post/:id", async (req, res) => {
  try {
    const postId = req.params.id.toString();
    const data = await getBooksData();
    const post = data.rows.find((post) => post.id.toString() === postId);
    res.render("post.ejs", { post: post });
  } catch (error) {
    console.error(`Failed to get book post data: ${error}`);
  }
});

// TODO EDIT BOOK POST (same as create post page but with info filled)
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
    await db.query(
      "INSERT INTO posts (content, created, book_id) VALUES ($1, $2, $3)",
      [req.body.content, created_date, book_result.rows[0].id]
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// TODO DELETE BOOK POST
app.post("/delete-post/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
