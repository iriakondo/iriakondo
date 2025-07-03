import { useState, useMemo } from 'react';

export interface SearchAndFilterOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFunctions?: {
    [key: string]: (item: T, value: any) => boolean;
  };
}

export interface UseSearchAndFilterReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  filteredData: T[];
  totalCount: number;
  filteredCount: number;
}

export function useSearchAndFilter<T>({
  data,
  searchFields,
  filterFunctions = {}
}: SearchAndFilterOptions<T>): UseSearchAndFilterReturn<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const setFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value == null) return;

      const filterFunction = filterFunctions[key];
      if (filterFunction) {
        result = result.filter(item => filterFunction(item, value));
      }
    });

    return result;
  }, [data, searchTerm, filters, searchFields, filterFunctions]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    setFilter,
    clearFilters,
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length
  };
}

// Utility functions for common filter types
export const filterHelpers = {
  // Date range filter
  dateRange: (dateField: string) => (item: any, value: { start?: string; end?: string }) => {
    if (!value.start && !value.end) return true;
    
    const itemDate = new Date(item[dateField]);
    const startDate = value.start ? new Date(value.start) : null;
    const endDate = value.end ? new Date(value.end) : null;

    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    
    return true;
  },

  // Exact match filter
  exactMatch: (field: string) => (item: any, value: string) => {
    if (!value) return true;
    return item[field] === value;
  },

  // Number range filter
  numberRange: (field: string) => (item: any, value: { min?: number; max?: number }) => {
    if (value.min == null && value.max == null) return true;
    
    const itemValue = Number(item[field]);
    if (isNaN(itemValue)) return false;

    if (value.min != null && itemValue < value.min) return false;
    if (value.max != null && itemValue > value.max) return false;
    
    return true;
  },

  // Contains filter (case insensitive)
  contains: (field: string) => (item: any, value: string) => {
    if (!value) return true;
    const itemValue = String(item[field] || '').toLowerCase();
    return itemValue.includes(value.toLowerCase());
  },

  // Multiple select filter
  multiSelect: (field: string) => (item: any, values: string[]) => {
    if (!values || values.length === 0) return true;
    return values.includes(item[field]);
  }
};

export default useSearchAndFilter;
