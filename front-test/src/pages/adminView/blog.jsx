import BlogCard from "@/components/blog/blogCard";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/helpers/blog/communicator";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        setBlogs(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogDelete = (deletedId) => {
    setBlogs(blogs.filter((blog) => blog._id !== deletedId));
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="flex-col flex-1 h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p>This is the list of the Blogs </p>
        <Button>
          <Link to="new">Ajouter Blog</Link>
        </Button>
      </div>
      <div className="space-y-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} onDelete={handleBlogDelete} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
