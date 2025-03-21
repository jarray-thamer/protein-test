import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "@/helpers/page/communicator";
import { Loader2 } from "lucide-react";

export default function PageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);
        const response = await getPageBySlug(slug);

        setPage(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch page:", err);
        setError("Failed to load page. It may not exist or has been removed.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center max-w-4xl py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">Loading page...</span>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="p-6 text-center rounded-lg bg-muted">
          <h2 className="mb-2 text-xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            {error || "The requested page could not be found."}
          </p>
        </div>
      </div>
    );
  }

  // Format the date to be more readable
  const formattedDate = new Date(page.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container max-w-4xl px-8 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <time dateTime={page.createdAt}>{formattedDate}</time>
            <span>•</span>
            <span>{page.status ? "Published" : "Draft"}</span>
          </div>
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none">
          {page.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <p>No content available for this page.</p>
          )}
        </div>
      </div>
    </div>
  );
}
