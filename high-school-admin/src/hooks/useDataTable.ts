import { useState, useMemo, useCallback } from 'react';

type SortOrder = 'asc' | 'desc' | null;

export const useDataTable = <T extends Record<string, any>>(data: T[]) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(Object.keys(data[0] || {}))
  );

  const handleSort = useCallback((field: string) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((prevOrder) => {
          if (prevOrder === 'asc') return 'desc';
          if (prevOrder === 'desc') return null;
          return 'asc';
        });
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
      return prev === field ? prev : field;
    });
  }, []);

  const toggleColumn = useCallback((column: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }
      return next;
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortField, sortOrder]);

  return {
    data: filteredAndSortedData,
    sortField,
    sortOrder,
    searchQuery,
    visibleColumns,
    handleSort,
    setSearchQuery,
    toggleColumn,
  };
};
