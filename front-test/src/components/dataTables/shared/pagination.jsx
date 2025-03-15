import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTablePagination({ table }) {
  // State to track if "All" is selected
  const [isAllSelected, setIsAllSelected] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between px-2 space-y-4 lg:flex-row lg:space-y-0">
      {/* Selected rows info */}
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {/* Rows per page dropdown */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={
              isAllSelected ? "all" : `${table.getState().pagination.pageSize}`
            }
            onValueChange={(value) => {
              if (value === "all") {
                // User selected "All"
                setIsAllSelected(true);
                table.setPageSize(table.getFilteredRowModel().rows.length);
              } else {
                // User selected a number
                setIsAllSelected(false);
                table.setPageSize(Number(value));
              }
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {/* Numeric options */}
              {[6, 10, 20, 30, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
              {/* "All" option */}
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
