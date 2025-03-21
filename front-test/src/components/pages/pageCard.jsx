import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function PageCard({ page }) {
  // Format the date to be more readable
  const formattedDate = new Date(page.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Create a content preview (first 100 characters)
  const contentPreview = page.content
    ? page.content.substring(0, 100) + (page.content.length > 100 ? "..." : "")
    : "No content available";

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold">{page.title}</CardTitle>
          {page.status ? (
            <Badge variant="default">Published</Badge>
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p
          className="prose text-muted-foreground line-clamp-3 prose-stone dark:prose-invert "
          dangerouslySetInnerHTML={{ __html: contentPreview }}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {formattedDate}
        </div>
        <Link
          href={`/pages/${page.slug}`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
