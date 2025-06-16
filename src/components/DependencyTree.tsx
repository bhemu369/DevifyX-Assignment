import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Package,
  AlertTriangle,
  ExternalLink,
  Shield,
} from "lucide-react";
import type { DependencyNode, DependencyType } from "../types/dependency";

interface DependencyTreeProps {
  dependencies: DependencyNode[];
  onNodeClick?: (node: DependencyNode) => void;
  searchQuery?: string;
}

const DependencyTypeColors: Record<DependencyType, string> = {
  dependencies: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  devDependencies:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  peerDependencies:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  optionalDependencies:
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const DependencyTreeNode: React.FC<{
  node: DependencyNode;
  level: number;
  onToggle: (node: DependencyNode) => void;
  onNodeClick?: (node: DependencyNode) => void;
  searchQuery?: string;
}> = ({ node, level, onToggle, onNodeClick, searchQuery }) => {
  const hasChildren = node.children && node.children.length > 0;
  const indentClass = `ml-${level * 4}`;

  // Highlight search matches
  const isSearchMatch =
    searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

  // Determine highlighting classes
  const getHighlightClasses = () => {
    let classes =
      "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-200 ";

    if (isSearchMatch) {
      classes += "bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 ";
    } else if (node.vulnerabilities && node.vulnerabilities.length > 0) {
      classes += "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 ";
    } else if (node.hasVersionConflict) {
      classes +=
        "bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 ";
    } else {
      classes += "hover:theme-bg-tertiary ";
    }

    return classes + indentClass;
  };

  return (
    <div className="select-none">
      <div
        className={getHighlightClasses()}
        onClick={() => onNodeClick?.(node)}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(node);
          }}
          className="flex-shrink-0 w-4 h-4 flex items-center justify-center theme-text-tertiary hover:theme-text-primary"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            node.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )
          ) : (
            <div className="w-3 h-3" />
          )}
        </button>

        {/* Package Icon */}
        <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />

        {/* Package Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span
              className={`font-medium truncate ${
                isSearchMatch
                  ? "text-yellow-800 dark:text-yellow-200 font-bold"
                  : "theme-text-primary"
              }`}
            >
              {searchQuery
                ? // Highlight search term in package name
                  node.name
                    .split(new RegExp(`(${searchQuery})`, "gi"))
                    .map((part, index) =>
                      part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <mark
                          key={index}
                          className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded"
                        >
                          {part}
                        </mark>
                      ) : (
                        part
                      )
                    )
                : node.name}
            </span>

            {/* Dependency Type Badge */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                DependencyTypeColors[node.type]
              }`}
            >
              {node.type.replace("Dependencies", "")}
            </span>

            {/* Version */}
            <span className="text-sm theme-text-tertiary">{node.version}</span>

            {/* Latest Version (if different) */}
            {node.latestVersion && node.latestVersion !== node.version && (
              <span className="text-sm text-orange-500 dark:text-orange-400">
                → {node.latestVersion}
              </span>
            )}
          </div>

          {/* Additional Info Row */}
          <div className="flex items-center space-x-4 mt-1">
            {/* License */}
            {node.license && (
              <div className="flex items-center space-x-1 text-xs theme-text-tertiary">
                <Shield className="w-3 h-3" />
                <span>{node.license}</span>
              </div>
            )}

            {/* Repository Link */}
            {node.repositoryUrl && (
              <a
                href={node.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-blue-500 hover:text-blue-700"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Repository</span>
              </a>
            )}

            {/* Vulnerabilities */}
            {node.vulnerabilities && node.vulnerabilities.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-red-500 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-semibold">
                  {node.vulnerabilities.length} vulnerabilities
                </span>
                <div className="flex space-x-1">
                  {node.vulnerabilities.map((vuln, idx) => (
                    <span
                      key={idx}
                      className={`px-1 py-0.5 rounded text-xs font-bold ${
                        vuln.severity === "critical"
                          ? "bg-red-600 text-white"
                          : vuln.severity === "high"
                          ? "bg-red-500 text-white"
                          : vuln.severity === "moderate"
                          ? "bg-orange-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {vuln.severity.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Version Conflict Warning */}
            {node.hasVersionConflict && (
              <div className="flex items-center space-x-1 text-xs text-orange-500 animate-bounce">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-semibold">Version conflict</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && node.isExpanded && (
        <div className="ml-4">
          {node.children.map((child, index) => (
            <DependencyTreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onNodeClick={onNodeClick}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DependencyTree: React.FC<DependencyTreeProps> = ({
  dependencies,
  onNodeClick,
  searchQuery,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [, forceRender] = useState({});

  const handleToggle = (node: DependencyNode) => {
    const nodeId = `${node.name}-${node.version}`;
    const newExpanded = new Set(expandedNodes);

    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }

    setExpandedNodes(newExpanded);

    // Update the node's expanded state
    node.isExpanded = newExpanded.has(nodeId);

    // Force re-render
    forceRender({});
  };

  const handleExpandAll = () => {
    const allNodeIds = new Set<string>();

    const collectNodeIds = (nodes: DependencyNode[]) => {
      nodes.forEach((node) => {
        const nodeId = `${node.name}-${node.version}`;
        allNodeIds.add(nodeId);
        node.isExpanded = true;
        if (node.children && node.children.length > 0) {
          collectNodeIds(node.children);
        }
      });
    };

    collectNodeIds(dependencies);
    setExpandedNodes(allNodeIds);

    // Force re-render
    forceRender({});
  };

  const handleCollapseAll = () => {
    const collapseNodes = (nodes: DependencyNode[]) => {
      nodes.forEach((node) => {
        node.isExpanded = false;
        if (node.children && node.children.length > 0) {
          collapseNodes(node.children);
        }
      });
    };

    collapseNodes(dependencies);
    setExpandedNodes(new Set());

    // Force re-render
    forceRender({});
  };

  if (dependencies.length === 0) {
    return (
      <div className="text-center py-8 theme-text-tertiary">
        No dependencies found. Upload a file to get started.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-4 theme-bg-tertiary rounded-lg">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium theme-text-secondary">
            {dependencies.length} dependencies
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExpandAll}
            className="px-3 py-1 text-sm btn-primary"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1 text-sm btn-secondary"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree Container */}
      <div className="card max-h-96 overflow-y-auto">
        {dependencies.map((dependency, index) => (
          <DependencyTreeNode
            key={`${dependency.name}-${index}`}
            node={dependency}
            level={0}
            onToggle={handleToggle}
            onNodeClick={onNodeClick}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 theme-bg-tertiary rounded-lg">
        <h5 className="text-sm font-medium theme-text-primary mb-2">Legend</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 rounded"></div>
            <span className="theme-text-secondary">Search Match</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"></div>
            <span className="theme-text-secondary">Vulnerabilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500"></div>
            <span className="theme-text-secondary">Version Conflicts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-3 h-3 text-blue-500" />
            <span className="theme-text-secondary">Dependencies</span>
          </div>
        </div>
      </div>
    </div>
  );
};
