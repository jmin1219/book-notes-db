# Book Notes Database

This is a web application for managing book notes and reviews. Users can create, edit, and delete book posts, each containing details such as title, subtitle, authors, status, rating, and personal notes.

## Features

- View a library of books with details and ratings
- Add new book posts with title, subtitle, authors, status, rating, and notes
- Edit existing book posts
- Delete book posts

![Uploading image.png…]()


## Project Structure

.
├── .env
├── .gitignore
├── index.js
├── package.json
├── README.md
├── views/
│ ├── partials/
│ │ ├── footer.ejs
│ │ └── header.ejs
│ ├── create-form.ejs
│ ├── edit-form.ejs
│ ├── library.ejs
│ └── post.ejs

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/book-notes-db.git
cd book-notes-db
```

2. Install dependencies

```sh
npm install
```

3. Set up the environment variables: Create a `.env` file in the root directory and add the following variables:

```
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
```

4. Start the application:

```sh
npm start
```

## Usage

- Navigate to http://localhost:3000 to view the library of books.
  Click on "Add New Book" to create a new book post.
  Click on a book title to view its details and notes.
  Use the "Edit" button to modify a book post.
  Use the "Delete" button to remove a book post.

## File Descriptions

index.js: Main server file that sets up routes and handles database interactions.
views/: Directory containing EJS templates for rendering the web pages.
create-form.ejs: Form for creating a new book post.
edit-form.ejs: Form for editing an existing book post.
library.ejs: Main library view displaying all books.
partials/: Directory containing partial templates.
footer.ejs: Footer partial template.
header.ejs: Header partial template.
post.ejs: Detailed view of a single book post.

## Dependencies

axios: ^1.7.7
body-parser: ^1.20.3
dotenv: ^16.4.5
ejs: ^3.1.10
express: ^4.21.1
pg: ^8.13.1
