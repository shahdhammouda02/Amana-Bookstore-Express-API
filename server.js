const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const {books} = require('./data/books.json');
const {reviews} = require('./data/reviews.json');

app.use(express.json());

app.get('/api/books', (req, res) => {
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

app.get('/api/reviews/:id', (req, res) => {
  const review = reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
