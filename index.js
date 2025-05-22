const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let books = [];

const validateBook = (book) => {
  const { book_id, title, author, genre, year, copies } = book;
  if (
    !book_id || typeof title !== 'string' || typeof author !== 'string' ||
    typeof genre !== 'string' || typeof year !== 'number' || typeof copies !== 'number'
  ) {
    return false;
  }
  return true;
};

app.post('/books', (req, res) => {
  const book = req.body;
  if (!validateBook(book)) {
    return res.status(400).json({ error: 'Invalid input. Make sure all fields are correctly filled.' });
  }
  if (books.find(b => b.book_id === book.book_id)) {
    return res.status(409).json({ error: 'Book with this ID already exists.' });
  }
  books.push(book);
  res.status(201).json(book);
});

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.book_id == req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }
  res.json(book);
});

app.put('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.book_id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }
  const updates = req.body;
  const allowedFields = ['title', 'author', 'genre', 'year', 'copies'];
  for (let key of Object.keys(updates)) {
    if (!allowedFields.includes(key)) {
      return res.status(400).json({ error: `Invalid field: ${key}` });
    }
  }
  books[index] = { ...books[index], ...updates };
  res.json(books[index]);
});

app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.book_id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }
  const deleted = books.splice(index, 1);
  res.json({ message: 'Book deleted successfully.', book: deleted[0] });
});

app.listen(port, () => {
  console.log(`Library Management API running at http://localhost:${port}`);
});
