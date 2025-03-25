"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export default function EnhancedSearchForm({
  categories = [],
  onSearch,
  className,
  placeholder = "Search products...",
  isMobile = false,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(searchInput, 300);
  const router = useRouter();
  const inputRef = useRef(null);

  // Update available subcategories when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(
        (cat) => cat.designation === selectedCategory
      );
      setAvailableSubCategories(category ? category.subCategories : []);
    } else {
      setAvailableSubCategories([]);
    }
    setSelectedSubCategory(""); // Reset subcategory when category changes
  }, [selectedCategory, categories]);

  // Handle debounced search for suggestions

  // Handle search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();

    if (searchInput.trim()) {
      setIsLoading(true);
      let url = `/products?search=${encodeURIComponent(searchInput.trim())}`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
        if (selectedSubCategory) {
          url += `&subcategory=${encodeURIComponent(selectedSubCategory)}`;
        }
      }

      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        router.push(url);
        setSearchInput("");
        setShowSuggestions(false);

        if (isMobile) {
          // Close the mobile drawer after search
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" })
          );
        }
      }, 300);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
    handleSearchSubmit();
  };

  const clearSearch = () => {
    setSearchInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Category Selection */}
          <div className="hidden w-full gap-2  md:flex md:w-auto">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.designation}>
                      {cat.designation}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Subcategory Selection - Only shown if category is selected */}
            {selectedCategory && (
              <Select
                value={selectedSubCategory}
                onValueChange={setSelectedSubCategory}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {availableSubCategories.map((subCat) => (
                      <SelectItem key={subCat._id} value={subCat.designation}>
                        {subCat.designation}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Search Input with Autocomplete */}
          <div className="relative flex-1">
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <div className="relative flex items-center w-full">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pr-16"
                  onFocus={() =>
                    searchInput.length >= 2 && setShowSuggestions(true)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowSuggestions(false);
                    }
                  }}
                />
                <div className="absolute right-0 flex items-center gap-1 pr-3">
                  {searchInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6"
                      onClick={clearSearch}
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
              <PopoverContent
                className="p-0 w-[var(--radix-popover-trigger-width)]"
                align="start"
                side="bottom"
              >
                <Command>
                  <CommandList>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        {suggestions.length === 0 ? (
                          <CommandEmpty>No results found.</CommandEmpty>
                        ) : (
                          <CommandGroup heading="Suggestions">
                            {suggestions.map((suggestion) => (
                              <CommandItem
                                key={suggestion}
                                onSelect={() =>
                                  handleSuggestionSelect(suggestion)
                                }
                              >
                                {suggestion}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </form>

      {/* Real-time search results preview */}
      {searchResults.length > 0 && (
        <div className="mt-6 border rounded-md">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-medium">Search Results</h3>
            <p className="text-sm text-muted-foreground">
              Found {searchResults.length} results for "{searchInput}"
            </p>
          </div>
          <ul className="divide-y">
            {searchResults.slice(0, 3).map((result) => (
              <li
                key={result.id}
                className="p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{result.name}</h4>
                  <span className="text-sm font-medium">{result.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.category}
                </p>
              </li>
            ))}
          </ul>
          {searchResults.length > 3 && (
            <div className="p-3 text-center border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchSubmit}
                className="text-sm"
              >
                View all {searchResults.length} results
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
