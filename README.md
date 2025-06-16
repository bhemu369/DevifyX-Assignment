# Dependency Visualizer

A modern React application built for DevifyX that visualizes dependency trees from multiple package managers with an interactive, user-friendly interface.

![Dependency Visualizer](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-^5.5.3-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.0-blue) ![Vite](https://img.shields.io/badge/Vite-^6.0.1-green)

## 🎯 Features

### Core Functionality

- **Multi-format Support**: Parse dependency files from:

  - 📦 **npm/yarn** (`package.json`)
  - 🐍 **pip** (`requirements.txt`)
  - ☕ **Maven** (`pom.xml`)

- **Interactive Tree Visualization**:

  - Collapsible/expandable nodes
  - Real-time search and filtering
  - Click to view detailed package information
  - Expand/Collapse All functionality

- **Rich Metadata Display**:

  - Package versions (current & latest)
  - Dependency types (prod/dev/peer/optional)
  - License information
  - Repository links
  - Version conflict detection
  - Vulnerability warnings (UI ready)

- **Export Capabilities**:

  - JSON export functionality
  - Clean data export with full dependency tree

- **Modern UI/UX**:
  - Dark/Light mode toggle with system preference detection
  - Responsive design (mobile-friendly)
  - ARIA-compliant accessibility
  - Beautiful drag-and-drop file upload

### Optional Features Implemented

✅ **1. Offline File Upload & Analysis**

- Complete offline functionality
- Drag-and-drop file upload interface
- Real-time parsing and visualization

✅ **2. Search & Filter System**

- Real-time search through dependency names
- Filter by dependency type
- Advanced filtering options in UI

✅ **3. Version Status Tracking**

- Display current versions
- UI framework for latest version comparison
- Version conflict detection

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/dependency-visualizer.git
   cd dependency-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.0.1 with SWC
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React
- **File Parsing**:
  - Native JSON parsing for package.json
  - Custom regex parsing for requirements.txt
  - xml2js for Maven pom.xml
- **State Management**: React Hooks (useState, useMemo, useEffect)

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUpload.tsx      # Drag-and-drop file upload component
│   ├── DependencyTree.tsx  # Interactive tree visualization
│   └── Layout.tsx          # Main layout with header/footer
├── types/
│   └── dependency.ts       # TypeScript interfaces
├── utils/
│   └── parsers.ts          # File parsing utilities
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles with Tailwind imports
```

## 🔧 Usage

### Uploading Files

1. **Drag and Drop**: Simply drag your dependency file onto the upload area
2. **Click to Select**: Click the upload area to open file browser
3. **Supported Files**:
   - `package.json` - npm/yarn projects
   - `requirements.txt` - Python pip projects
   - `pom.xml` - Maven Java projects

### Navigating the Tree

- **Expand/Collapse**: Click the chevron icons to navigate
- **Search**: Use the search bar to filter dependencies
- **View Details**: Click on any package to see detailed information
- **Export**: Use the export button to download dependency data

### Keyboard Shortcuts

- `Ctrl/Cmd + F`: Focus search bar
- `ESC`: Clear search/close details panel

## 🤖 AI Tool Usage Documentation

As per the assignment requirements, this project utilized AI tools for development assistance:

### Tools Used

1. **Claude Sonnet (Cursor AI)**

   - **Purpose**: Primary development assistant for code generation and problem-solving
   - **Usage**:
     - Generated initial component structures
     - Helped with TypeScript interface definitions
     - Assisted with Tailwind CSS styling and responsive design
     - Provided suggestions for React best practices
     - Helped debug parsing logic for different file formats

2. **GitHub Copilot** (if applicable)
   - **Purpose**: Code completion and inline suggestions
   - **Usage**: Assisted with repetitive code patterns and utility functions

### AI-Assisted Development Areas

- **Component Architecture**: AI helped design the modular component structure
- **TypeScript Types**: Generated comprehensive type definitions for dependency data
- **CSS Styling**: Assisted with Tailwind CSS classes and responsive design patterns
- **File Parsing Logic**: Helped implement parsers for different package manager formats
- **Error Handling**: Suggested robust error handling patterns
- **Accessibility**: Recommended ARIA attributes and keyboard navigation patterns

### Human Oversight

All AI-generated code was:

- Reviewed and tested thoroughly
- Modified to fit specific project requirements
- Optimized for performance and maintainability
- Integrated following React and TypeScript best practices

## 🧪 Testing

The application includes built-in validation for:

- File format detection
- JSON parsing error handling
- XML parsing with error recovery
- Requirements.txt format validation

## 🚀 Future Enhancements

### Planned Features

- **Graph Visualization**: D3.js or Cytoscape.js integration for network graphs
- **Vulnerability Scanning**: Integration with security advisory APIs
- **Version Checking**: Automatic latest version fetching
- **Advanced Exports**: PDF and image export options
- **Dependency Comparison**: Side-by-side project comparison
- **CI/CD Integration**: GitHub Action for automated dependency analysis

### Performance Optimizations

- Virtual scrolling for large dependency trees
- Lazy loading of package metadata
- Caching of parsed dependency data

## 📄 License

This project is part of the DevifyX assignment and is for educational/demonstration purposes.

## 🤝 Contributing

This is an assignment project, but feedback and suggestions are welcome!

## 📞 Contact

For questions about this implementation or the assignment, please reach out through the appropriate channels.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
