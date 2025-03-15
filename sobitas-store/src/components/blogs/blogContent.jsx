import React from "react";
import Link from "next/link";

export default function BlogContent({ content }) {
  // If there's no content, return null
  if (!content) return null;

  // Create a safe HTML render with additional styling
  return (
    <div
      className="blog-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline 
      prose-img:rounded-lg prose-img:shadow-md
      prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4
      prose-strong:text-gray-900 prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm
      prose-ul:list-disc prose-ol:list-decimal"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
