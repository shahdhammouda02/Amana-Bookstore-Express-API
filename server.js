const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const {books} = require('./data/books.json');
const {reviews} = require('./data/reviews.json');

app.use(express.json());

//All Books Endpoint
app.get('/api/books', (req, res) => {
    res.json(books);
});

//Single Book Endpoint
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

//Date Published Range Endpoint
app.get('/books/datePublished', (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: 'Please provide both start_date and end_date query parameters in YYYY-MM-DD format.' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const filteredBooks = books.filter(book => {
        const bookDate = new Date(book.datePublished);
        return bookDate >= startDate && bookDate <= endDate;
    });

    res.json(filteredBooks);
});

//All Reviews Endpoint
app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

//Single Review Endpoint
app.get('/api/reviews/:id', (req, res) => {
  const review = reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
