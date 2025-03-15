import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBlogById } from "@/helpers/blog/communicator";

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data.data);
      } catch (error) {
        toast.error("Failed to fetch blog");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/blogs">
          <Button variant="outline">Back to Blogs</Button>
        </Link>
      </div>
      <h1 className="mb-4 text-3xl font-bold">{blog.title}</h1>
      {blog.cover && blog.cover.url && (
        <img
          src={blog.cover.url}
          alt={blog.title}
          className="object-cover w-full md:w-[10%] mb-4 aspect-square"
        />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="prose"
      />
      <p className="mt-4 text-sm text-gray-500">
        Posted on {new Date(blog.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default BlogView;
