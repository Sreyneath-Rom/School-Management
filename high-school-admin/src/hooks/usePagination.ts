import { useEffect, useMemo, useState } from 'react';

export const usePagination = <T,>(items: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the underlying item set changes (a new filter,
  // search term, or sort). Without this, narrowing a filtered list while on
  // page 3 leaves `currentPage` pointing past the new end — the table then
  // renders empty even though matching results exist on page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const paginationData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
      currentItems,
      currentPage: safePage,
      totalPages,
      totalItems: items.length,
      startIndex: items.length === 0 ? 0 : startIndex + 1,
      endIndex: Math.min(endIndex, items.length),
    };
  }, [items, itemsPerPage, currentPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(paginationData.currentPage + 1);
  const prevPage = () => goToPage(paginationData.currentPage - 1);

  return {
    ...paginationData,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
};