import { Button } from "@/components/ui/button";
import { apiConnector } from "@/services/apiConnector";
import { bookEndpoints } from "@/services/apis";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BookDetailPage = () => {
  const [details, setDetails] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const newParams = params.id;

  useEffect(() => {
    refreshBooks();
  }, [newParams]);

  const refreshBooks = async () => {
    const token = Cookies.get("token");
    console.log("TOKEN::", token);
    try {
      const response = await apiConnector(
        "GET",
        `${bookEndpoints.GET_SINGLE_BOOK.replace(":id", newParams)}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setDetails(response?.data?.data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">📚 Book Details</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Image */}
            <div className="relative overflow-hidden group">
              <img
                src="https://repository-images.githubusercontent.com/181327815/cba87a00-62f0-11e9-9842-5336945a96f6" // Dummy Image
                alt="Book Cover"
                className="w-full h-96 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Book Details */}
            <div className="p-6">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                {details?.title || "Book Title"}
              </h2>
              <h3 className="text-lg text-gray-600 mb-2">
                <span className="font-semibold">Author:</span>{" "}
                {details?.author || "Unknown Author"}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {details?.description ||
                  "No description available for this book."}
              </p>

              {/* Additional Information */}
              <div className="mt-6 space-y-2">
                <p className="text-gray-500">
                  <span className="font-semibold">Published Date:</span>{" "}
                  {details?.createdAt
                    ? new Date(details.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Updated:</span>{" "}
                  {details?.createdAt
                    ? new Date(details.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>

        {/* About the Book */}
        <div className="mt-10 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            📖 About the Book
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Dive into the world of this fascinating book. Explore its themes,
            characters, and gripping plot that will keep you engaged till the
            very end.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 mt-10">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} BookStore. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default BookDetailPage;
