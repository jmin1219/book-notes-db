import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "CP5-BookNotes",
  password: "PGDtthtp!1",
  port: 5432,
});

db.connect();

app.get("/", (req, res) => {
  res.render("library.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
