import { useState, useMemo } from "react";
import { Layout } from "./components/Layout";
import { FileUpload } from "./components/FileUpload";
import { DependencyTree } from "./components/DependencyTree";
import type { DependencyNode, FilterOptions } from "./types/dependency";

function App() {
  const [dependencies, setDependencies] = useState<DependencyNode[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dependencyTypes: [],
    showOutdated: false,
    showWithVulnerabilities: false,
    licenseTypes: [],
    versionConstraints: "all",
  });

  // Filter dependencies based on search query and advanced filters
  const filteredDependencies = useMemo(() => {
    const hasSearchQuery = searchQuery.trim();
    const hasAdvancedFilters =
      filters.dependencyTypes.length > 0 ||
      filters.licenseTypes.length > 0 ||
      filters.showOutdated ||
      filters.showWithVulnerabilities ||
      filters.versionConstraints !== "all";

    if (!hasSearchQuery && !hasAdvancedFilters) return dependencies;

    const filterDeps = (deps: DependencyNode[]): DependencyNode[] => {
      return deps
        .filter((dep) => {
          // Search filter
          const matchesSearch =
            !hasSearchQuery ||
            dep.name.toLowerCase().includes(searchQuery.toLowerCase());

          // Dependency type filter
          const matchesType =
            filters.dependencyTypes.length === 0 ||
            filters.dependencyTypes.includes(dep.type);

          // License filter
          const matchesLicense =
            filters.licenseTypes.length === 0 ||
            (dep.license && filters.licenseTypes.includes(dep.license));

          // Version constraint filter
          const matchesVersionConstraint = (() => {
            if (filters.versionConstraints === "all") return true;
            if (filters.versionConstraints === "exact")
              return (
                !dep.version.includes("^") &&
                !dep.version.includes("~") &&
                !dep.version.includes(">=")
              );
            if (filters.versionConstraints === "range")
              return (
                dep.version.includes("^") ||
                dep.version.includes("~") ||
                dep.version.includes(">=")
              );
            if (filters.versionConstraints === "latest")
              return dep.version === "latest" || dep.version.includes("*");
            return true;
          })();

          // Outdated filter (mock logic - in real app would check against registry)
          const matchesOutdated =
            !filters.showOutdated ||
            dep.version.includes("^") ||
            dep.version.includes("~");

          // Vulnerabilities filter (mock logic - in real app would check security database)
          const matchesVulnerabilities =
            !filters.showWithVulnerabilities ||
            (dep.vulnerabilities && dep.vulnerabilities.length > 0);

          // Check if children match (for search)
          const hasMatchingChildren =
            hasSearchQuery && dep.children && dep.children.length > 0
              ? filterDeps(dep.children).length > 0
              : false;

          const matchesAllFilters =
            matchesType &&
            matchesLicense &&
            matchesVersionConstraint &&
            matchesOutdated &&
            matchesVulnerabilities;

          return (matchesSearch || hasMatchingChildren) && matchesAllFilters;
        })
        .map((dep) => ({
          ...dep,
          children: dep.children ? filterDeps(dep.children) : [],
        }));
    };

    return filterDeps(dependencies);
  }, [dependencies, searchQuery, filters]);

  const handleFileParsed = (
    newDependencies: DependencyNode[],
    newFileName: string
  ) => {
    setDependencies(newDependencies);
    setFileName(newFileName);
    setSelectedNode(null);
  };

  const handleExport = () => {
    // Simple JSON export for now
    const dataStr = JSON.stringify(dependencies, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName || "dependencies"}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNodeClick = (node: DependencyNode) => {
    setSelectedNode(selectedNode?.name === node.name ? null : node);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dependencyTypes: [],
      showOutdated: false,
      showWithVulnerabilities: false,
      licenseTypes: [],
      versionConstraints: "all",
    });
  };

  return (
    <Layout
      onExport={dependencies.length > 0 ? handleExport : undefined}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onClearFilters={handleClearFilters}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        {dependencies.length === 0 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold theme-text-primary mb-4">
              Welcome to Dependency Visualizer
            </h2>
            <p className="text-lg theme-text-secondary mb-8 max-w-2xl mx-auto">
              Upload your dependency files to visualize and analyze your
              project's dependency tree. Supports multiple package managers
              including npm, pip, and Maven.
            </p>
          </div>
        )}

        {/* File Upload */}
        <div className="flex justify-center">
          <FileUpload onFileParsed={handleFileParsed} />
        </div>

        {/* Results Section */}
        {dependencies.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tree View */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold theme-text-primary">
                    Dependency Tree
                  </h3>
                  <div className="text-sm theme-text-tertiary">
                    File: <span className="font-medium">{fileName}</span>
                  </div>
                </div>

                <DependencyTree
                  dependencies={filteredDependencies}
                  onNodeClick={handleNodeClick}
                  searchQuery={searchQuery}
                />
              </div>
            </div>

            {/* Sidebar with Details */}
            <div className="space-y-6">
              {/* Statistics */}
              <div className="card p-6">
                <h4 className="text-lg font-semibold theme-text-primary mb-4">
                  Statistics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="theme-text-secondary">
                      Total Dependencies
                    </span>
                    <span className="font-medium theme-text-primary">
                      {dependencies.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-secondary">Production</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {
                        dependencies.filter((d) => d.type === "dependencies")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-secondary">Development</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {
                        dependencies.filter((d) => d.type === "devDependencies")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-secondary">Peer</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {
                        dependencies.filter(
                          (d) => d.type === "peerDependencies"
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Node Details */}
              {selectedNode && (
                <div className="card p-6">
                  <h4 className="text-lg font-semibold theme-text-primary mb-4">
                    Package Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium theme-text-secondary">
                        Name
                      </span>
                      <p className="theme-text-primary font-mono text-sm">
                        {selectedNode.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium theme-text-secondary">
                        Version
                      </span>
                      <p className="theme-text-primary font-mono text-sm">
                        {selectedNode.version}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium theme-text-secondary">
                        Type
                      </span>
                      <p className="theme-text-primary text-sm">
                        {selectedNode.type}
                      </p>
                    </div>
                    {selectedNode.license && (
                      <div>
                        <span className="text-sm font-medium theme-text-secondary">
                          License
                        </span>
                        <p className="theme-text-primary text-sm">
                          {selectedNode.license}
                        </p>
                      </div>
                    )}
                    {selectedNode.repositoryUrl && (
                      <div>
                        <span className="text-sm font-medium theme-text-secondary">
                          Repository
                        </span>
                        <a
                          href={selectedNode.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                        >
                          {selectedNode.repositoryUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="card p-6">
                <h4 className="text-lg font-semibold theme-text-primary mb-4">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={handleExport}
                    className="w-full btn-primary text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => {
                      setDependencies([]);
                      setFileName("");
                      setSelectedNode(null);
                      setSearchQuery("");
                    }}
                    className="w-full btn-secondary text-sm"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Info */}
        {dependencies.length === 0 && (
          <div className="card p-8">
            <h3 className="text-xl font-semibold theme-text-primary mb-6 text-center">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">
                    📊
                  </span>
                </div>
                <h4 className="font-semibold theme-text-primary mb-2">
                  Interactive Visualization
                </h4>
                <p className="theme-text-secondary text-sm">
                  Collapsible tree view with expand/collapse functionality and
                  detailed package information
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 dark:text-green-400 text-xl">
                    🔍
                  </span>
                </div>
                <h4 className="font-semibold theme-text-primary mb-2">
                  Search & Filter
                </h4>
                <p className="theme-text-secondary text-sm">
                  Real-time search through dependencies and filter by type,
                  version, or vulnerabilities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">
                    📄
                  </span>
                </div>
                <h4 className="font-semibold theme-text-primary mb-2">
                  Multi-Format Support
                </h4>
                <p className="theme-text-secondary text-sm">
                  Support for npm, pip, and Maven dependency files with
                  intelligent parsing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
