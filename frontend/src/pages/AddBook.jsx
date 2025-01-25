import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiConnector } from "@/services/apiConnector";
import { bookEndpoints } from "@/services/apis";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// ✅ Zod Schema for Text Validation (without file validation)
const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  author: z.string().min(2, "Author must be at least 2 characters long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
});

const AddBook = ({ book = null, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
    },
  });

  // ✅ Populate the form if `book` exists (Edit Mode)
  useEffect(() => {
    if (book) {
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("description", book.description);
    }
  }, [book, setValue]);

  // ✅ Handle Submit for Add or Update
  const onHandleSubmit = async (formData) => {
    const token = Cookies.get("token"); // Ensure token exists
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      // API Call Logic
      let response;
      if (book) {
        // Update Mode
        response = await apiConnector(
          "PUT",
          `${bookEndpoints.UPDATE_BOOK.replace(":id", book._id)}`,
          formData, // Send the updated data
          {
            Authorization: `Bearer ${token}`,
          }
        );
      } else {
        // Add Mode
        response = await apiConnector(
          "POST",
          bookEndpoints.CREATE_BOOK,
          formData, // Send the new book data
          {
            Authorization: `Bearer ${token}`,
          }
        );
      }

      // Handle API Response
      if (response?.data?.success) {
        toast.success(response.data.message || "Book saved successfully.");
        onRefresh(); // Refresh book list
        onClose(); // Close dialog
      } else {
        toast.error(response?.data?.message || "Failed to save book data.");
      }
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error("An error occurred while saving book data.");
    } finally {
      setLoading(false);
      reset(); // Reset form fields
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90%] md:max-w-[600px] rounded-xl shadow-xl p-6">
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            {book ? "Edit Book" : "Add a New Book"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mb-4">
            {book
              ? "Update the details of the selected book."
              : "Fill in the details below to add a new book to your collection."}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register("author")} />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author.message}</p>
            )}
          </div>

          {/* Book Image */}
          <div>
            <Label htmlFor="bookImage">Book Image</Label>
            <Input id="bookImage" type="file" accept="image/*" />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : book ? (
                "Update Book"
              ) : (
                "Add Book"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBook;
