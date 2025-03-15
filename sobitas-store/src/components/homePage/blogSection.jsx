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

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  // Autoplay plugin setup
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  // Fetch blogs on mount
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

  if (blogs.length === 0) {
    return "";
  }

  return (
    <div>
      <h3 className="text-[34px] text-center text-black3 uppercase font-bold rubik">
        Blogs
      </h3>

      <Carousel
        plugins={[plugin.current]}
        className="w-[70%] md:w-[80%] lg:w-[90%] mx-auto max-w-screen-2xl my-8"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="px-4">
          {blogs.map((blog) => (
            <CarouselItem
              className="my-auto transition-all duration-200 ease-in sm:basis-1/4 xl:basis-1/6 hover:scale-105"
              key={blog.id || blog.createdAt}
            >
              <Link href={`/blogs/${blog.slug}`}>
                <div className="p-1 transition-shadow rounded-md group group-hover:shadow-xl h-[330px]">
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
                        <span>
                          {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                        </span>
                      </p>
                      <Separator className="my-2" />
                      <Link
                        className="flex items-center space-x-2 transition-all duration-150 ease-out hover:underline underline-offset-2 hover:text-primary"
                        href={`/blogs/${blog.slug}`}
                      >
                        <span>Voir plus</span> <ArrowUpRightIcon size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default BlogSection;
