const Book = require("../models/book.js");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler.js");
const { uploadImageToCloudinary } = require("../utils/imageUploader.js");
require("dotenv").config();
// Add Book
const addBook = async (req, res, next) => {
  try {
    const { title, author, description } = req.body;
    const bookImage = req.files.bookImage;
    console.log("Received bookImage:", bookImage);

    if (!title || !author || !description || !bookImage) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    const bookImageDisplay = await uploadImageToCloudinary(
      bookImage,
      process.env.CLOUDINARY_FOLDER_NAME
    );
    console.log("Data::", bookImageDisplay);
    const book = new Book({
      title,
      author,
      description,
      bookImage: bookImageDisplay.secure_url,
    });
    const savedBook = await book.save();

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: savedBook,
    });
  } catch (e) {
    next(new ErrorHandler(e.message || "Error in adding book", 500));
  }
};

// Get Single Book
const getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.isValidObjectId(bookId)) {
      return next(new ErrorHandler("Invalid Book ID", 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Book found successfully",
      data: book,
    });
  } catch (e) {
    next(new ErrorHandler(e.message || "Error in getting book", 500));
  }
};

// Get All Books
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find({});

    if (!books || books.length === 0) {
      return next(new ErrorHandler("No books found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "All books retrieved successfully",
      data: books,
    });
  } catch (e) {
    next(new ErrorHandler(e.message || "Error in getting all books", 500));
  }
};

// Update Book
const updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const { title, author, description } = req.body;
    const bookImage = req.files.bookImage;

    if (!mongoose.isValidObjectId(bookId)) {
      return next(new ErrorHandler("Invalid Book ID", 400));
    }
    if (!title || !author || !description || !bookImage) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }
    const bookImageDisplay = await uploadImageToCloudinary(
      bookImage,
      process.env.CLOUDINARY_FOLDER_NAME
    );
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, description, bookImage: bookImageDisplay.secure_url },
      { new: true }
    );

    if (!updatedBook) {
      return next(new ErrorHandler("Failed to update book", 400));
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (e) {
    next(new ErrorHandler(e.message || "Error in updating book", 500));
  }
};

// Delete Book
const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.isValidObjectId(bookId)) {
      return next(new ErrorHandler("Invalid Book ID", 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    await Book.findByIdAndDelete(bookId);

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (e) {
    next(new ErrorHandler(e.message || "Error in deleting book", 500));
  }
};
module.exports = { addBook, getBookById, getAllBooks, updateBook, deleteBook };
