import type { DependencyNode, DependencyType } from '../types/dependency';
import { XMLParser } from 'fast-xml-parser';

export async function parsePackageJson(content: string): Promise<DependencyNode[]> {
  try {
    const packageData = JSON.parse(content);
    const dependencies: DependencyNode[] = [];

    // Parse different dependency types
    const depTypes: Array<{ key: keyof typeof packageData; type: DependencyType }> = [
      { key: 'dependencies', type: 'dependencies' },
      { key: 'devDependencies', type: 'devDependencies' },
      { key: 'peerDependencies', type: 'peerDependencies' },
      { key: 'optionalDependencies', type: 'optionalDependencies' },
    ];

    for (const { key, type } of depTypes) {
      const deps = packageData[key];
      if (deps && typeof deps === 'object') {
        for (const [name, version] of Object.entries(deps)) {
          // Add some mock children for demonstration (in a real app, this would come from dependency resolution)
          const children: DependencyNode[] = [];
          
          // Mock license data for common packages
          const getLicense = (packageName: string): string => {
            const licenseMap: Record<string, string> = {
              'react': 'MIT',
              'react-dom': 'MIT',
              'typescript': 'Apache-2.0',
              'tailwindcss': 'MIT',
              'vite': 'MIT',
              'lucide-react': 'ISC',
              'd3': 'BSD-3-Clause',
              'lodash': 'MIT',
              'axios': 'MIT',
              'express': 'MIT',
              'webpack': 'MIT',
              'babel': 'MIT',
              'eslint': 'MIT',
              'prettier': 'MIT',
              'jest': 'MIT',
            };
            return licenseMap[packageName] || ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0', 'ISC'][Math.floor(Math.random() * 5)];
          };

          // Mock vulnerability data (some packages have mock vulnerabilities for testing)
          const getVulnerabilities = (packageName: string) => {
            const vulnerablePackages = ['lodash', 'axios', 'express'];
            if (vulnerablePackages.includes(packageName)) {
              return [{
                id: `CVE-2023-${Math.floor(Math.random() * 9999)}`,
                                 severity: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'moderate' | 'high',
                title: `Mock vulnerability in ${packageName}`,
                description: `This is a mock vulnerability for testing purposes.`,
              }];
            }
            return [];
          };
          
          // Add mock sub-dependencies for some popular packages to demonstrate tree functionality
          if (name === 'react' || name === 'lucide-react' || name === 'd3') {
            children.push({
              name: `${name}-dom` || 'sub-package-1',
              version: '1.0.0',
              type: 'dependencies',
              children: [],
              isExpanded: false,
              license: getLicense(`${name}-dom`),
              vulnerabilities: getVulnerabilities(`${name}-dom`),
              hasVersionConflict: Math.random() > 0.8,
            });
            children.push({
              name: `@types/${name}`,
              version: '^18.0.0',
              type: 'devDependencies',
              children: [],
              isExpanded: false,
              license: getLicense(`@types/${name}`),
              vulnerabilities: getVulnerabilities(`@types/${name}`),
              hasVersionConflict: Math.random() > 0.9,
            });
          }
          
          if (name === 'tailwindcss') {
            children.push({
              name: 'postcss',
              version: '^8.4.0',
              type: 'dependencies',
              children: [],
              isExpanded: false,
              license: getLicense('postcss'),
              vulnerabilities: getVulnerabilities('postcss'),
            });
            children.push({
              name: 'autoprefixer',
              version: '^10.4.0',
              type: 'dependencies',
              children: [],
              isExpanded: false,
              license: getLicense('autoprefixer'),
              vulnerabilities: getVulnerabilities('autoprefixer'),
            });
          }

          // Mock version conflicts for some packages
          const hasVersionConflict = ['react', 'typescript', 'lodash'].includes(name) && Math.random() > 0.7;

          dependencies.push({
            name,
            version: version as string,
            type,
            children,
            isExpanded: false,
            license: getLicense(name),
            vulnerabilities: getVulnerabilities(name),
            hasVersionConflict,
          });
        }
      }
    }

    return dependencies;
  } catch (error) {
    throw new Error(`Failed to parse package.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parsePipRequirements(content: string): Promise<DependencyNode[]> {
  try {
    const dependencies: DependencyNode[] = [];
    const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse different formats: package==1.0.0, package>=1.0.0, etc.
      const match = trimmedLine.match(/^([a-zA-Z0-9_-]+)([><=!~]+)?([0-9.*]+)?/);
      
      if (match) {
        const [, name, operator, version] = match;
        // Mock license for Python packages
        const pythonLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0', 'PSF'];
        const license = pythonLicenses[Math.floor(Math.random() * pythonLicenses.length)];
        
        // Mock vulnerabilities for some packages
        const vulnerablePackages = ['requests', 'urllib3', 'django'];
        const vulnerabilities = vulnerablePackages.includes(name.toLowerCase()) ? [{
          id: `CVE-2023-${Math.floor(Math.random() * 9999)}`,
          severity: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'moderate' | 'high',
          title: `Mock vulnerability in ${name}`,
          description: `This is a mock vulnerability for testing purposes.`,
        }] : [];

        dependencies.push({
          name: name.toLowerCase(),
          version: version ? `${operator || ''}${version}` : 'latest',
          type: 'dependencies',
          children: [],
          isExpanded: false,
          license,
          vulnerabilities,
        });
      }
    }

    return dependencies;
  } catch (error) {
    throw new Error(`Failed to parse requirements.txt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parseMavenPom(content: string): Promise<DependencyNode[]> {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const result = parser.parse(content);
    
    const dependencies: DependencyNode[] = [];
    
    // fast-xml-parser structure is different - dependencies can be an array or single object
    let projectDeps = result?.project?.dependencies?.dependency;
    
    // Handle both single dependency and array of dependencies
    if (projectDeps && !Array.isArray(projectDeps)) {
      projectDeps = [projectDeps];
    }

    if (Array.isArray(projectDeps)) {
      for (const dep of projectDeps) {
        const name = `${dep.groupId || 'unknown'}:${dep.artifactId || 'unknown'}`;
        const version = dep.version || 'unknown';
        const scope = dep.scope || 'compile';
        
        // Map Maven scopes to our dependency types
        let type: DependencyType = 'dependencies';
        if (scope === 'test') type = 'devDependencies';
        if (scope === 'provided') type = 'peerDependencies';

        // Mock license for Maven packages
        const mavenLicenses = ['Apache-2.0', 'MIT', 'BSD-3-Clause', 'GPL-3.0', 'LGPL-2.1'];
        const license = mavenLicenses[Math.floor(Math.random() * mavenLicenses.length)];
        
        // Mock vulnerabilities for some packages
        const vulnerablePackages = ['org.springframework:spring-core', 'org.apache.commons:commons-lang3'];
        const vulnerabilities = vulnerablePackages.includes(name) ? [{
          id: `CVE-2023-${Math.floor(Math.random() * 9999)}`,
          severity: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'moderate' | 'high',
          title: `Mock vulnerability in ${name}`,
          description: `This is a mock vulnerability for testing purposes.`,
        }] : [];

        dependencies.push({
          name,
          version,
          type,
          children: [],
          isExpanded: false,
          license,
          vulnerabilities,
        });
      }
    }

    return dependencies;
  } catch (error) {
    throw new Error(`Failed to parse pom.xml: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 