import React from "react";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader and CardTitle
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { deleteBlog } from "@/helpers/blog/communicator";

// Helper function to strip HTML tags from content
const stripHtml = (html) => html.replace(/<[^>]*>/g, "");

const BlogCard = ({ blog, onDelete }) => {
  const handleDelete = async () => {
    try {
      await deleteBlog(blog._id);
      toast.success("Blog deleted successfully");
      onDelete(blog._id); // Notify parent to update the blog list
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-start ">
          {/* Image Section */}
          {blog.cover && blog.cover.url && (
            <div className="mb-4 mr-6">
              <img
                src={blog.cover.url}
                alt={blog.title}
                className="object-fill w-48 rounded-lg "
              />
            </div>
          )}
          {/* Content Section */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between mt-4">
              <h2 className="text-2xl font-bold">{blog.title}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link to={`/blogs/view/${blog._id}`}>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                  </Link>
                  <Link to={`/blogs/edit/${blog._id}`}>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Update
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div
              className="mt-2 text-gray-600"
              dangerouslySetInnerHTML={{ __html: blog?.content.slice(0, 520) }}
            />
            ...
            <p className="mt-2 text-sm text-gray-500">
              Created At: {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
