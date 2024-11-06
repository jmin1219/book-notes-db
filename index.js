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

// GET RECENT POSTS LIST (like D Sivers website)
app.get("/posts-list", (req, res) => {});

// GET CREATE POST FORM
app.get("/new-post", (req, res) => {
  res.render("create-form.ejs");
});

// GET BOOK POST
app.get("/post/:id", (req, res) => {});

// EDIT BOOK POST
app.post("/edit-post/:id", (req, res) => {});

// SUBMIT BOOK POST
app.post("/submit-post", (req, res) => {});

// DELETE BOOK POST
app.post("/delete-post/:id", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
