import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { bookEndpoints } from "@/services/apis";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // For navigation

const ShowBooks = ({ item, onEdit, onRefresh }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const navigate = useNavigate(); // For navigation

  // Handle Edit Button
  const handleEdit = () => {
    onEdit(item); // Passing item to parent to handle edit
  };

  // Handle Delete Button
  const handleDelete = async () => {
    const token = Cookies.get("token");
    if (!bookIdToDelete) return; // Ensure we have the ID to delete
    try {
      const response = await apiConnector(
        "DELETE",
        `${bookEndpoints.DELETE_BOOK.replace(":id", bookIdToDelete)}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.data.success) {
        toast.success("Book deleted successfully.");
        onRefresh(); // Refresh the list of books after deletion
      } else {
        toast.error("Failed to delete the book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Error deleting the book.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Open the delete confirmation dialog and set the book ID to delete
  const openDeleteDialog = (id) => {
    setBookIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle Show More Button Click (Navigate to another page with full data)
  const handleShowMore = () => {
    navigate(`/book/${item._id}`); // Navigate to the full details page
  };

  return (
    <tr className="bg-white hover:bg-gray-100 rounded-lg shadow-md transition duration-300 ease-in-out">
      <td className="px-4 py-3 text-sm font-medium text-gray-800">
        {item?.title}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-600">
        {item?.author}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[300px]">
        {item?.description}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex justify-center space-x-4">
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
            title="Edit Book"
          >
            <CiEdit className="text-xl" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => openDeleteDialog(item._id)}
            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
            title="Delete Book"
          >
            <MdOutlineDeleteOutline className="text-xl" />
          </button>

          {/* Show More Button */}
          <button
            onClick={handleShowMore}
            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300 transform hover:scale-110"
            title="Show More"
          >
            <span className="font-semibold">SHOW MORE</span>
          </button>
        </div>
      </td>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-full max-w-[400px] rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mb-4">
              Do you really want to delete this book? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </tr>
  );
};

export default ShowBooks;
