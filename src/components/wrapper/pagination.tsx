import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
  totalCount: number;
  totalPage: number;
  className?: string;
  onPageChange: (page: number) => void; // Callback to handle page change
};

const generatePageNumbers = (pageIndex: number, totalPage: number) => {
  const pages: (number | string)[] = [];
  const delta = 2; // Pages before/after the current page

  for (let i = 0; i < totalPage; i++) {
    if (
      i === 0 || // Always show first page
      i === totalPage - 1 || // Always show last page
      (i >= pageIndex - delta && i <= pageIndex + delta)
    ) {
      pages.push(i + 1); // Display as 1-based number for users
    } else if (i === pageIndex - delta - 1) {
      pages.push("left");
    } else if (i === pageIndex + delta + 1) {
      pages.push("right");
    }
  }
  return pages;
};

export function PaginationWarpper({
  pageIndex,
  totalPage,
  onPageChange,
  className,
}: PaginationProps) {
  const isFirstPage = pageIndex === 1;
  const isLastPage = pageIndex === totalPage;

  const pages = generatePageNumbers(pageIndex, totalPage);
  const classNameHover =
    "disabled text-foreground/60 hover:text-secondary-foreground/60 hover:bg-transparent hover:cursor-default";

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (pageIndex > 1) onPageChange(pageIndex);
            }}
            className={isFirstPage ? classNameHover : ""}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {/* Render Dynamic Pages */}
        {pages.map((page, index) => {
          const ellipsis = typeof page === "number";
          const ellipsisLeft = !ellipsis && page === "left";
          const ellipsisRight = !ellipsis && page === "right";
          return (
            <PaginationItem key={index}>
              {ellipsis ? (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page); // Convert back to 0-based index
                  }}
                  isActive={pageIndex === page}
                  className={page === pageIndex ? "active" : ""}
                >
                  {page}
                </PaginationLink>
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    let newPage = pageIndex;
                    if (ellipsisLeft) {
                      newPage = newPage - 5 < 1 ? 1 : newPage - 5;
                    }
                    if (ellipsisRight) {
                      newPage =
                        newPage + 5 > totalPage ? totalPage : newPage + 5;
                    }
                    console.log(newPage);
                    onPageChange(newPage); // Convert back to 0-based index
                  }}
                >
                  <PaginationEllipsis />
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (pageIndex < totalPage) onPageChange(pageIndex);
            }}
            className={isLastPage ? classNameHover : ""}
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
