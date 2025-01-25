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
import { useNavigate } from "react-router-dom";

const ShowBooks = ({ item, onEdit, onRefresh }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = async () => {
    const token = Cookies.get("token");
    if (!bookIdToDelete) return;
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
        onRefresh();
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

  const openDeleteDialog = (id) => {
    setBookIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleShowMore = () => {
    navigate(`/book/${item._id}`);
  };

  return (
    <tr className="bg-white shadow-sm rounded-lg hover:shadow-lg transition-all duration-300">
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <img
            className="w-full max-w-[112px] h-auto rounded-lg object-cover border border-gray-300 shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
            src={
              item.bookImage
                ? item.bookImage
                : "https://media.flaticon.com/dist/min/img/collections/collection-tour.svg"
            }
            alt="Book Image"
            loading="lazy"
          />
        </div>
      </td>
      <td className="px-4 py-4 text-center text-gray-600">{item?.title}</td>
      <td className="px-4 py-4 text-center text-gray-600">{item?.author}</td>
      <td className="px-4 py-4 text-center text-gray-600 truncate max-w-xs">
        {item?.description}
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex justify-center gap-4">
          <button
            onClick={handleEdit}
            className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            title="Edit Book"
          >
            <CiEdit className="text-2xl" />
          </button>

          <button
            onClick={() => openDeleteDialog(item._id)}
            className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            title="Delete Book"
          >
            <MdOutlineDeleteOutline className="text-2xl" />
          </button>

          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md font-semibold hover:bg-teal-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            title="Show More"
          >
            Show More
          </button>
        </div>
      </td>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-full max-w-sm rounded-xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-800">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mb-4">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white rounded-md hover:bg-red-700 ml-4"
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
