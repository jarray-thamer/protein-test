import React, { useState, useEffect } from "react";
import { PageGrid } from "@/components/pages/pageGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getPages } from "@/helpers/page/communicator";

export default function PagesPage() {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const response = await getPages();

        setPages(response || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pages:", err);
        setError("Failed to load pages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

  return (
    <div className="container px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
        <Link to="/pages/new">
          <Button className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Create New Page
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2">Loading pages...</span>
        </div>
      ) : error ? (
        <div className="py-10 text-center text-destructive">
          <h3 className="text-lg font-medium">Error</h3>
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <PageGrid pages={pages} />
      )}
    </div>
  );
}
