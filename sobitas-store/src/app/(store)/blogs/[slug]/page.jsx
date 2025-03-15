"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogBySlug, getAllBlogs } from "@/services/blog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BlogContent from "@/components/blogs/blogContent";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogAndRelated = async () => {
      try {
        setLoading(true);
        // Fetch the current blog
        const blogResponse = await getBlogBySlug(slug);
        setBlog(blogResponse.data);

        // Fetch all blogs to get related ones
        const allBlogsResponse = await getAllBlogs();

        // Filter out the current blog and limit to 4 related blogs
        const filteredBlogs = allBlogsResponse.data
          .filter((b) => b.slug !== slug)
          .slice(0, 4);

        setRelatedBlogs(filteredBlogs);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogAndRelated();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="mb-4 text-3xl font-bold">Blog Not Found</h1>
        <p className="mb-8">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center px-6 py-3 text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Calculate estimated reading time
  const wordsPerMinute = 200;
  const textContent = blog.content.replace(/<[^>]*>/g, "");
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return (
    <div className="container px-4 py-12 mx-auto">
      <Link
        href="/blogs"
        className="inline-flex items-center mb-8 text-gray-600 transition-colors hover:text-primary"
      >
        <ArrowLeftIcon size={16} className="mr-2" />
        Back to All Blogs
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="w-full lg:w-2/3">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{blog.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
            <div className="flex items-center">
              <CalendarDaysIcon size={18} className="mr-2" />
              <span>{format(new Date(blog.createdAt), "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon size={18} className="mr-2" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {blog.cover?.url && (
            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.cover.url}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          {/* <BlogContent content={blog.content} key={blog.slug} /> */}
        </div>

        {/* Sidebar with related blogs */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <h3 className="mb-6 text-xl font-bold">Related Articles</h3>

            {relatedBlogs.length === 0 ? (
              <p className="text-gray-500">No related articles found.</p>
            ) : (
              <div className="space-y-6">
                {relatedBlogs.map((relatedBlog) => (
                  <RelatedBlogCard
                    key={relatedBlog._id || relatedBlog.slug}
                    blog={relatedBlog}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const RelatedBlogCard = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group">
      <div className="flex gap-4">
        <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
          {blog.cover?.url ? (
            <Image
              src={blog.cover.url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h4 className="font-medium transition-colors line-clamp-2 group-hover:text-primary">
            {blog.title}
          </h4>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <CalendarDaysIcon size={14} className="mr-1" />
            <span>{format(new Date(blog.createdAt), "MMM dd, yyyy")}</span>
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
    </Link>
  );
};
