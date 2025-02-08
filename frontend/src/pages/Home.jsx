import React, { useState, useEffect } from "react";
import AddBook from "./AddBook";
import ShowBooks from "./ShowBooks";
import { apiConnector } from "@/services/apiConnector";
import { bookEndpoints } from "@/services/apis";

const Home = () => {
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  console.log("DATA::", data);
  useEffect(() => {
    refreshBooks();
  }, []);

  const refreshBooks = async () => {
    try {
      const response = await apiConnector("GET", bookEndpoints?.GET_ALL_BOOKS);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleAddClick = () => {
    setSelectedBook(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  return (
    <div className="px-2">
      <div className="flex justify-end my-4">
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Book
        </button>
      </div>

      {/* Books Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Author
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <ShowBooks
                key={item._id}
                item={item}
                onEdit={() => handleEditClick(item)}
                onRefresh={refreshBooks}
              />
            ))}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <AddBook
          book={selectedBook}
          onClose={() => setIsDialogOpen(false)}
          onRefresh={refreshBooks}
        />
      )}
    </div>
  );
};

export default Home;
