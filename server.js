const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const { books } = require("./data/books.json");
const { reviews } = require("./data/reviews.json");

app.use(express.json());

//All Books Endpoint
app.get("/api/books", (req, res) => {
  res.json(books);
});

//Single Book Endpoint
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

//Date Published Range Endpoint
app.get("/books/datePublished", (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res
      .status(400)
      .json({
        error:
          "Please provide both start_date and end_date query parameters in YYYY-MM-DD format.",
      });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  const filteredBooks = books.filter((book) => {
    const bookDate = new Date(book.datePublished);
    return bookDate >= startDate && bookDate <= endDate;
  });

  res.json(filteredBooks);
});

//Top rated Books Endpoint
app.get("/books/top-rated", (req, res) => {
  if (!books || books.length === 0) {
    return res.status(404).json({ error: "No books available" });
  }

  const topBooks = books
    .map((book) => ({
      ...book,
      score: book.rating * book.reviewsCount,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json(topBooks);
});

//Featured Books Endpoint
app.get("/books/featured", (req, res) => {
  if (!books || books.length === 0) {
    return res.status(404).json({ error: "No books available" });
  }

  const featuredBooks = books.filter((book) => book.featured === true);

  if (featuredBooks.length === 0) {
    return res.status(404).json({ message: "No featured books found" });
  }

  res.json(featuredBooks);
});

//Book Reviews Endpoint
app.get("/api/books/:id/reviews", (req, res) => {
  const bookId = req.params.id; // your book IDs in JSON are strings
  const book = books.find((b) => b.id === bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });

  const bookReviews = reviews.filter((r) => r.bookId === bookId);
  if (bookReviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  res.json({
    book: book.title,
    reviews: bookReviews,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
