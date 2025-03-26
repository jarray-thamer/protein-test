"use client";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";
import { getLandingPageBlogs } from "@/services/blog";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { ArrowUpRightIcon, CalendarDaysIcon } from "lucide-react";

const BlogCard = ({ blog }) => (
  <Link href={`/blogs/${blog.slug}`}>
    <div className="p-1 transition-all duration-200 ease-in rounded-md group group-hover:shadow-xl h-[330px] hover:scale-105">
      <div className="flex flex-col h-full">
        <Image
          src={blog.cover.url}
          alt={blog.title}
          width={1080}
          height={1080}
          className="object-fill w-full rounded-md h-44"
        />
        <div className="flex flex-col flex-1 p-2 overflow-hidden">
          <h3 className="mt-2 text-lg font-medium line-clamp-2">
            {blog.title}
          </h3>
          <p className="flex items-center mt-auto space-x-1 text-sm text-gray-600">
            <CalendarDaysIcon size={18} />
            <span>{format(new Date(blog.createdAt), "MMM dd, yyyy")}</span>
          </p>
          <Separator className="my-2" />
          <div className="flex items-center space-x-2 transition-all duration-150 ease-out hover:underline underline-offset-2 hover:text-primary">
            <span>Voir plus</span> <ArrowUpRightIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getLandingPageBlogs();
        setBlogs(data.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  if (blogs.length === 0) return null;

  return (
    <div className="mt-20">
      <h3 className="text-[34px] text-center text-black3 uppercase font-bold rubik">
        Blogs
      </h3>

      {/* Desktop Carousel */}
      <div className="hidden md:block">
        <Carousel
          plugins={[plugin.current]}
          className="w-[77%] md:w-[80%] lg:w-[90%] mx-auto max-w-screen-2xl my-8"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {blogs.map((blog) => (
              <CarouselItem
                className="my-auto basis-1/2 sm:basis-1/4 xl:basis-1/6"
                key={blog.id || blog.createdAt}
              >
                <BlogCard blog={blog} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Mobile Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 my-8 md:hidden">
        {blogs.map((blog) => (
          <div key={blog.id || blog.createdAt} className="w-full">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
