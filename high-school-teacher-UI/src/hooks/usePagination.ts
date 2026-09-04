import { useMemo, useState } from 'react';

export const usePagination = <T,>(items: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
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