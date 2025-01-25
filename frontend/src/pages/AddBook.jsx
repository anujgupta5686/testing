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

const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  author: z.string().min(2, "Author must be at least 2 characters long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
});

const AddBook = ({ book = null, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

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

  useEffect(() => {
    if (book) {
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("description", book.description);
      if (book.bookImage) {
        setImage(book.bookImage);
      }
    }
  }, [book, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const onHandleSubmit = async (formData) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("description", formData.description);
      if (image && typeof image !== "string") {
        formDataToSend.append("bookImage", image);
      }

      let response;
      if (book) {
        response = await apiConnector(
          "PUT",
          `${bookEndpoints.UPDATE_BOOK.replace(":id", book._id)}`,
          formDataToSend,
          {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        );
      } else {
        response = await apiConnector(
          "POST",
          bookEndpoints.CREATE_BOOK,
          formDataToSend,
          {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        );
      }

      if (response?.data?.success) {
        toast.success(response.data.message || "Book saved successfully.");
        onRefresh();
        onClose();
      } else {
        toast.error(response?.data?.message || "Failed to save book data.");
      }
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error("An error occurred while saving book data.");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add Book"}</DialogTitle>
          <DialogDescription>
            {book
              ? "Update the details of the book."
              : "Add a new book to the list."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-4">
          <Label>Title</Label>
          <Input
            type="text"
            {...register("title")}
            placeholder="Enter book title"
            className="w-full"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Label>Author</Label>
          <Input
            type="text"
            {...register("author")}
            placeholder="Enter book author"
            className="w-full"
          />
          {errors.author && (
            <p className="text-red-500">{errors.author.message}</p>
          )}

          <Label>Description</Label>
          <Textarea
            {...register("description")}
            placeholder="Enter book description"
            className="w-full"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <Label>Book Image</Label>
          {image && typeof image === "string" ? (
            <div className="flex items-center space-x-4">
              <img src={image} alt="Book" className="w-24 h-24 rounded-md" />
              <Button onClick={() => setImage(null)} variant="outline">
                Change
              </Button>
            </div>
          ) : (
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBook;
