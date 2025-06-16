import React from "react";
import { Download, Search, Filter } from "lucide-react";
import { SimpleThemeToggle } from "./ThemeToggle";
import { FilterPanel } from "./FilterPanel";
import type { FilterOptions } from "../types/dependency";

interface LayoutProps {
  children: React.ReactNode;
  onExport?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filters?: FilterOptions;
  onFiltersChange?: (filters: FilterOptions) => void;
  onClearFilters?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  onExport,
  searchQuery = "",
  onSearchChange,
  showFilters = false,
  onToggleFilters,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  return (
    <div className="min-h-screen theme-bg-secondary transition-all duration-300">
      {/* Header */}
      <header className="card border-b theme-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 theme-accent-bg rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DV</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold theme-text-primary">
                  Dependency Visualizer
                </h1>
                <p className="text-sm theme-text-tertiary">
                  DevifyX Assignment
                </p>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {onSearchChange && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-tertiary w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search dependencies..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="input pl-10 pr-4 py-2 w-64 focus-ring"
                  />
                </div>
              )}

              {/* Filter Toggle */}
              {onToggleFilters &&
                filters &&
                onFiltersChange &&
                onClearFilters && (
                  <div className="relative">
                    <button
                      onClick={onToggleFilters}
                      className={`p-2 rounded-md transition-all duration-200 focus-ring ${
                        showFilters
                          ? "theme-accent-bg text-white"
                          : "theme-text-secondary hover:theme-text-primary hover:theme-bg-tertiary"
                      }`}
                      title="Toggle Filters"
                    >
                      <Filter className="w-5 h-5" />
                    </button>

                    <FilterPanel
                      isOpen={showFilters}
                      onClose={() => onToggleFilters()}
                      filters={filters}
                      onFiltersChange={onFiltersChange}
                      onClearFilters={onClearFilters}
                    />
                  </div>
                )}

              {/* Export Button */}
              {onExport && (
                <button
                  onClick={onExport}
                  className="btn-primary focus-ring flex items-center gap-2"
                  title="Export Dependencies"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}

              {/* Theme Toggle */}
              <SimpleThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="card border-t theme-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm theme-text-tertiary">
              <p>Built with React, TypeScript, and Tailwind CSS v4</p>
              <p className="mt-1">
                Supports npm (package.json), pip (requirements.txt), and Maven
                (pom.xml)
              </p>
            </div>
            <div className="text-sm theme-text-tertiary">
              <p>DevifyX Assignment © 2025</p>
              <p className="mt-1">
                AI-assisted development documented in README
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
