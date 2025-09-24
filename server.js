const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const { books } = require("./data/books.json");
const { reviews } = require("./data/reviews.json");

app.use(express.json());

//Get Routes
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

//POST Routes
//Add New Book Endpoint
app.post('/api/books', (req, res) => {
  const {
    title,
    author,
    description,
    price,
    isbn,
    genre,
    tags,
    datePublished,
    pages,
    language,
    publisher,
    rating,
    reviewCount,
    inStock,
    featured
  } = req.body;

  // validation
  if (!title || !author || !price) {
    return res.status(400).json({ error: "Title, author, and price are required" });
  }

  // Generate new ID (string)
  const newId = (books.length + 1).toString();

  const newBook = {
    id: newId,
    title,
    author,
    description: description || "",
    price,
    isbn: isbn || "",
    genre: genre || [],
    tags: tags || [],
    datePublished: datePublished || new Date().toISOString().split('T')[0],
    pages: pages || 0,
    language: language || "English",
    publisher: publisher || "",
    rating: rating || 0,
    reviewCount: reviewCount || 0,
    inStock: inStock !== undefined ? inStock : true,
    featured: featured || false
  };

  // Add to array
  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook
  });
});

//Add New Review Endpoint
app.post('/api/reviews', (req, res) => {
  const { bookId, author, rating, title, comment, verified } = req.body;

  // validation
  if (!bookId || !author || !rating || !title || !comment) {
    return res.status(400).json({ 
      error: "bookId, author, rating, title, and comment are required" 
    });
  }

  // Check if the book exists
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Generate new review ID
  const newId = `review-${reviews.length + 1}`;

  const newReview = {
    id: newId,
    bookId,
    author,
    rating,
    title,
    comment,
    timestamp: new Date().toISOString(),
    verified: verified || false
  };

  // Add review to the array
  reviews.push(newReview);

  //update book's review count (in memory)
  book.reviewCount = (book.reviewCount || 0) + 1;

  res.status(201).json({
    message: "Review added successfully",
    review: newReview
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
