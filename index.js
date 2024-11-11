import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import pg from "pg";

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// POSTGRESQL DATABASE
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

// BOOK COVER API ACCESS
const API_URL = "https://covers.openlibrary.org/b/isbn/";

async function getBooksData() {
  const result = await db.query(
    "SELECT * FROM books JOIN posts ON posts.book_id = books.id ORDER BY books.rating DESC"
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

// EDIT BOOK POST (same as create post page but with info filled)
app.get("/edit-post/:id", async (req, res) => {
  try {
    const postId = req.params.id.toString();
    const data = await getBooksData();
    const post = data.rows.find((post) => post.id.toString() === postId);
    res.render("edit-form.ejs", { post: post });
  } catch (error) {
    console.error(`Failed to get post data: ${error}`);
  }
});

// SUBMIT BOOK POST
app.post("/submit-post", async (req, res) => {
  try {
    const coverUrl = API_URL + req.body.isbn + "-L.jpg";
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

// SUBMIT POST EDITS
app.post("/submit-edit/:id", async (req, res) => {
  try {
    const postId = req.params.id.toString();
    const data = await getBooksData();
    const udpatedDate = new Date().toJSON().slice(0, 10);
    const edited_book = await db.query(
      `
      UPDATE books 
      SET title = $1, subtitle = $2, authors = $3, status = $4, rating = $5
      ${
        req.body.isbn
          ? ", coverurl = '" + API_URL + req.body.isbn + "-L.jpg'"
          : ""
      }
      WHERE id = $6;
      `,
      [
        req.body.title,
        req.body.subtitle,
        req.body.authors,
        req.body.status,
        req.body.rating,
        postId,
      ]
    );
    const edited_post = await db.query(
      "UPDATE posts SET content = $1, updated = $2 WHERE book_id = $3",
      [req.body.content, udpatedDate, postId]
    );
    res.redirect("/");
  } catch (error) {
    console.error(`Failed to save edits: ${error}`);
  }
});

// DELETE BOOK POST
app.post("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id.toString();
    const result_posts = await db.query(
      "DELETE FROM posts WHERE book_id = $1",
      [postId]
    );
    const result_books = await db.query("DELETE FROM books WHERE id = $1", [
      postId,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(`Error deleting book and post: ${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
