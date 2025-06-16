import React from "react";
import { X, Check } from "lucide-react";
import type { FilterOptions } from "../types/dependency";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  if (!isOpen) return null;

  const dependencyTypeOptions = [
    {
      value: "dependencies",
      label: "Production",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      value: "devDependencies",
      label: "Development",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      value: "peerDependencies",
      label: "Peer",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      value: "optionalDependencies",
      label: "Optional",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  const licenseOptions = [
    "MIT",
    "Apache-2.0",
    "BSD-3-Clause",
    "GPL-3.0",
    "ISC",
    "BSD-2-Clause",
    "LGPL-2.1",
    "MPL-2.0",
  ];

  const versionOptions = [
    { value: "all", label: "All Versions" },
    { value: "exact", label: "Exact Versions Only" },
    { value: "range", label: "Version Ranges Only" },
    { value: "latest", label: "Latest Versions Only" },
  ];

  const handleDependencyTypeToggle = (type: string) => {
    const newTypes = filters.dependencyTypes.includes(type)
      ? filters.dependencyTypes.filter((t) => t !== type)
      : [...filters.dependencyTypes, type];

    onFiltersChange({ ...filters, dependencyTypes: newTypes });
  };

  const handleLicenseToggle = (license: string) => {
    const newLicenses = filters.licenseTypes.includes(license)
      ? filters.licenseTypes.filter((l) => l !== license)
      : [...filters.licenseTypes, license];

    onFiltersChange({ ...filters, licenseTypes: newLicenses });
  };

  const hasActiveFilters =
    filters.dependencyTypes.length > 0 ||
    filters.licenseTypes.length > 0 ||
    filters.showOutdated ||
    filters.showWithVulnerabilities ||
    filters.versionConstraints !== "all";

  return (
    <div className="absolute top-full right-0 mt-2 w-80 card p-4 shadow-lg z-50 border theme-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold theme-text-primary">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm theme-text-secondary hover:theme-text-primary transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 theme-text-secondary hover:theme-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dependency Types */}
        <div>
          <h4 className="text-sm font-medium theme-text-primary mb-3">
            Dependency Types
          </h4>
          <div className="space-y-2">
            {dependencyTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.dependencyTypes.includes(option.value)}
                    onChange={() => handleDependencyTypeToggle(option.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      filters.dependencyTypes.includes(option.value)
                        ? "theme-accent-bg border-transparent"
                        : "theme-border"
                    }`}
                  >
                    {filters.dependencyTypes.includes(option.value) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className={`text-sm ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Version Constraints */}
        <div>
          <h4 className="text-sm font-medium theme-text-primary mb-3">
            Version Constraints
          </h4>
          <div className="space-y-2">
            {versionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="radio"
                    name="versionConstraints"
                    value={option.value}
                    checked={filters.versionConstraints === option.value}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        versionConstraints: e.target.value as any,
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      filters.versionConstraints === option.value
                        ? "theme-accent-bg border-transparent"
                        : "theme-border"
                    }`}
                  >
                    {filters.versionConstraints === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-sm theme-text-secondary">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Filters */}
        <div>
          <h4 className="text-sm font-medium theme-text-primary mb-3">
            Special Filters
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.showOutdated}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      showOutdated: e.target.checked,
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.showOutdated
                      ? "theme-accent-bg border-transparent"
                      : "theme-border"
                  }`}
                >
                  {filters.showOutdated && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm theme-text-secondary">
                Show Outdated Only
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.showWithVulnerabilities}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      showWithVulnerabilities: e.target.checked,
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.showWithVulnerabilities
                      ? "theme-accent-bg border-transparent"
                      : "theme-border"
                  }`}
                >
                  {filters.showWithVulnerabilities && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm theme-text-secondary">
                Show With Vulnerabilities
              </span>
            </label>
          </div>
        </div>

        {/* License Types */}
        <div>
          <h4 className="text-sm font-medium theme-text-primary mb-3">
            License Types
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {licenseOptions.map((license) => (
              <label
                key={license}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.licenseTypes.includes(license)}
                    onChange={() => handleLicenseToggle(license)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      filters.licenseTypes.includes(license)
                        ? "theme-accent-bg border-transparent"
                        : "theme-border"
                    }`}
                  >
                    {filters.licenseTypes.includes(license) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-xs theme-text-secondary">{license}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
