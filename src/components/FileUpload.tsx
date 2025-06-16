import React, { useCallback, useState } from "react";
import { Upload, File, AlertCircle } from "lucide-react";
import type { DependencyNode } from "../types/dependency";
import {
  parsePackageJson,
  parsePipRequirements,
  parseMavenPom,
} from "../utils/parsers";

interface FileUploadProps {
  onFileParsed: (dependencies: DependencyNode[], fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileParsed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileRead = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const content = await file.text();
        let dependencies: DependencyNode[] = [];

        // Determine file type and parse accordingly
        if (file.name === "package.json") {
          dependencies = await parsePackageJson(content);
        } else if (file.name === "requirements.txt") {
          dependencies = await parsePipRequirements(content);
        } else if (file.name === "pom.xml") {
          dependencies = await parseMavenPom(content);
        } else {
          throw new Error(
            "Unsupported file type. Please upload package.json, requirements.txt, or pom.xml"
          );
        }

        onFileParsed(dependencies, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file");
      } finally {
        setIsLoading(false);
      }
    },
    [onFileParsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileRead(files[0]);
      }
    },
    [handleFileRead]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileRead(files[0]);
      }
    },
    [handleFileRead]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "theme-border hover:border-blue-300"
          }
          ${isLoading ? "opacity-50 pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          ) : (
            <Upload className="h-12 w-12 theme-text-tertiary" />
          )}

          <div>
            <h3 className="text-lg font-medium theme-text-primary">
              {isLoading ? "Parsing file..." : "Upload dependency file"}
            </h3>
            <p className="text-sm theme-text-secondary mt-1">
              Drag and drop or click to select
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">
              <File className="h-3 w-3 mr-1" />
              package.json
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
              <File className="h-3 w-3 mr-1" />
              requirements.txt
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs">
              <File className="h-3 w-3 mr-1" />
              pom.xml
            </span>
          </div>

          <input
            type="file"
            accept=".json,.txt,.xml"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
