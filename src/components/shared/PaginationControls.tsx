// /src/components/shared/PaginationControls.tsx
'use client'

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/**
 * A reusable component to render pagination controls.
 * It centralizes the UI and logic for displaying page numbers, next/previous buttons, and ellipses.
 * @param currentPage - The currently active page.
 * @param totalPages - The total number of pages.
 * @param basePath - The base path for the page links (e.g., '/videos').
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, basePath }) => {

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // Simple case: if total pages are less than or equal to the max to show, render all page numbers.
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href={`${basePath}?page=${i}`} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Complex case: render page numbers with ellipses for many pages.
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // Adjust window if we are near the start or end.
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      }
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 4;
        endPage = totalPages;
      }

      // Render the first page and an ellipsis if needed.
      if (startPage > 1) {
        pageNumbers.push(
          <PaginationItem key="1">
            <PaginationLink href={`${basePath}?page=1`}>1</PaginationLink>
          </PaginationItem>
        );
        if (startPage > 2) {
          pageNumbers.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }
      }

      // Render the main window of page numbers.
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href={`${basePath}?page=${i}`} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Render the last page and an ellipsis if needed.
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href={`${basePath}?page=${totalPages}`}>{totalPages}</PaginationLink>
          </PaginationItem>
        );
      }
    }
    return pageNumbers;
  };

  // Do not render pagination if there's only one page or less.
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`${basePath}?page=${Math.max(1, currentPage - 1)}`} />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
