const express = require("express");
const route = express.Router();
const {
  addBook,
  getBookById,
  getAllBooks,
  updateBook,
  deleteBook,
} = require("../components/book");
const auth = require("../middlewares/authMiddleware");
route.post("/book", auth, addBook);
route.get("/book/:id", auth, getBookById);
route.get("/books", getAllBooks);
route.put("/book/:id", auth, updateBook);
route.delete("/book/:id", auth, deleteBook);

module.exports = route;
