"use client";
import React, { useEffect, useState } from "react";
import { getAllBlogs } from "@/services/blog";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarDaysIcon, ArrowUpRightIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="text-[42px] text-center text-black3 uppercase font-bold rubik mb-12">
        Notre Blogs
      </h1>

      {blogs.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-xl">No blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogs.map((blog) => (
            <BlogCard key={blog._id || blog.slug} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

const BlogCard = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="h-full">
      <div className="flex flex-col h-full overflow-hidden transition-shadow duration-300 rounded-lg shadow-md hover:shadow-xl">
        <div className="relative w-full h-52">
          {blog.cover?.url ? (
            <Image
              src={blog.cover.url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow p-5">
          <h2 className="mb-3 text-xl font-semibold line-clamp-2">
            {blog.title}
          </h2>
          {blog.content && (
            <p className="mb-4 text-gray-600 line-clamp-3">
              {blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </p>
          )}
          <div className="mt-auto">
            <div className="flex items-center mb-2 text-gray-500">
              <CalendarDaysIcon size={16} className="mr-2" />
              <span className="text-sm">
                {format(new Date(blog.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center text-primary">
              <span>Read more</span>
              <ArrowUpRightIcon size={16} className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
