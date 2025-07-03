import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';
import Select from './Select';
import Input from './Input';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'number' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterValue {
  [key: string]: any;
}

interface FilterPanelProps {
  filters: FilterOption[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onReset: () => void;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = '',
  collapsible = true,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleFilterChange = (key: string, value: any) => {
    onChange({
      ...values,
      [key]: value
    });
  };

  const handleReset = () => {
    onReset();
  };

  const hasActiveFilters = Object.values(values).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  const renderFilterInput = (filter: FilterOption) => {
    const value = values[filter.key] || '';

    switch (filter.type) {
      case 'select':
        return (
          <Select
            key={filter.key}
            label={filter.label}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            options={filter.options || []}
            placeholder={filter.placeholder}
          />
        );

      case 'date':
        return (
          <Input
            key={filter.key}
            label={filter.label}
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
          />
        );

      case 'dateRange':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={value?.start || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, start: e.target.value })}
                placeholder="Date début"
              />
              <Input
                type="date"
                value={value?.end || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, end: e.target.value })}
                placeholder="Date fin"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <Input
            key={filter.key}
            label={filter.label}
            type="number"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
          />
        );

      case 'text':
        return (
          <Input
            key={filter.key}
            label={filter.label}
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Filtres</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {Object.values(values).filter(v => v !== '' && v !== null && v !== undefined).length}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleReset}
                icon={<X className="w-4 h-4" />}
              >
                Réinitialiser
              </Button>
            )}
            
            {collapsible && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(filter => renderFilterInput(filter))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
