import { useState, useMemo, useCallback } from 'react';

type SortOrder = 'asc' | 'desc' | null;

export const useDataTable = <T extends Record<string, any>>(data: T[]) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Track hidden columns rather than a fixed "visible" set computed once
  // from data[0]. If `data` starts empty (e.g. loading from useFetch) and
  // populates later, columns now stay in sync instead of locking to {}.
  const columns = useMemo(() => Object.keys(data[0] ?? {}), [data]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const visibleColumns = useMemo(
    () => new Set(columns.filter((c) => !hiddenColumns.has(c))),
    [columns, hiddenColumns]
  );

  const handleSort = useCallback((field: string) => {
    setSortField((prevField) => {
      if (prevField !== field) {
        setSortOrder('asc');
        return field;
      }
      setSortOrder((prevOrder) => {
        if (prevOrder === 'asc') return 'desc';
        if (prevOrder === 'desc') return null;
        return 'asc';
      });
      return prevField;
    });
  }, []);

  const toggleColumn = useCallback((column: string) => {
    setHiddenColumns((prev) => {
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
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => val !== null && val !== undefined && val.toString().toLowerCase().includes(q)
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