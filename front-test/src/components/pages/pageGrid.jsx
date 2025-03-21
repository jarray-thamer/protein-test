import { PageCard } from "./pageCard";

export function PageGrid({ pages }) {
  if (!pages || pages.length === 0) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-lg font-medium">No pages found</h3>
        <p className="mt-2 text-muted-foreground">
          Create a new page to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <PageCard key={page._id} page={page} />
      ))}
    </div>
  );
}
