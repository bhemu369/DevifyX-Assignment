export type DependencyType = 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies';

export interface DependencyNode {
  name: string;
  version: string;
  latestVersion?: string;
  type: DependencyType;
  children: DependencyNode[];
  license?: string;
  repositoryUrl?: string;
  homepage?: string;
  vulnerabilities?: VulnerabilityInfo[];
  isExpanded?: boolean;
  hasVersionConflict?: boolean;
}

export interface VulnerabilityInfo {
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  url?: string;
}

export interface PackageManager {
  type: 'npm' | 'pip' | 'maven';
  fileName: string;
  parseFunction: (content: string) => Promise<DependencyNode[]>;
}

export interface FilterOptions {
  dependencyTypes: string[];
  showOutdated: boolean;
  showWithVulnerabilities: boolean;
  licenseTypes: string[];
  versionConstraints: 'all' | 'exact' | 'range' | 'latest';
} 