"use client";

import { useState, useMemo } from "react";
import SpreadsheetTable from "./SpreadsheetTable";
import SearchBar from "./SearchBar";
import { Project } from "@/types/project";

interface ProjectsContainerProps {
  projects: Project[];
}

// The password to unlock protected projects
const UNLOCK_PASSWORD = "carter2025";

// Parse date string to sortable number
// Handles: "11.2025" (month.year), "2024" (year only), "Ongoing", ""
function parseDate(dateStr: string): number {
  if (!dateStr) return 0;
  
  const normalized = dateStr.toLowerCase().trim();
  
  // "Ongoing" projects should appear at the top (highest value)
  if (normalized === "ongoing") return 999999;
  
  // Format: "11.2025" (month.year)
  const parts = dateStr.split(".");
  if (parts.length === 2) {
    const month = parseInt(parts[0], 10) || 0;
    const year = parseInt(parts[1], 10) || 0;
    return year * 100 + month; // e.g., 202511 for 11.2025
  }
  
  // Format: "2024" (year only) - treat as December of that year
  const yearOnly = parseInt(dateStr, 10);
  if (!isNaN(yearOnly) && yearOnly > 1900 && yearOnly < 2100) {
    return yearOnly * 100 + 1; // Put year-only dates at start of that year
  }
  
  return 0;
}

// Check if status is "Featured" and extract the number (e.g., "Featured 1" -> 1)
function getFeaturedOrder(status: string): number | null {
  if (!status) return null;
  const normalized = status.toLowerCase().trim();
  
  // Match "featured", "featured 1", "featured 2", etc.
  if (normalized === "featured") return 0;
  const match = normalized.match(/^featured\s+(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

export default function ProjectsContainer({ projects }: ProjectsContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Sort projects: Featured first (by number), then by date (most recent first)
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aFeatured = getFeaturedOrder(a.status);
      const bFeatured = getFeaturedOrder(b.status);
      
      // Both are featured - sort by featured number
      if (aFeatured !== null && bFeatured !== null) {
        return aFeatured - bFeatured;
      }
      
      // Only a is featured - a comes first
      if (aFeatured !== null) return -1;
      
      // Only b is featured - b comes first
      if (bFeatured !== null) return 1;
      
      // Neither is featured - sort by date (most recent first)
      return parseDate(b.date) - parseDate(a.date);
    });
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return sortedProjects;

    const query = searchQuery.toLowerCase();
    return sortedProjects.filter((project) => {
      return (
        project.item?.toLowerCase().includes(query) ||
        project.client?.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        project.role?.toLowerCase().includes(query) ||
        project.notes?.toLowerCase().includes(query) ||
        project.status?.toLowerCase().includes(query)
      );
    });
  }, [sortedProjects, searchQuery]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === UNLOCK_PASSWORD) {
      setIsUnlocked(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleUnlockRequest = () => {
    setShowPasswordModal(true);
    setPasswordError(false);
    setPasswordInput("");
  };

  return (
    <div className="bg-[#1a1a1a] border-x border-b border-[#3a3a3a] rounded-b-lg shadow-2xl">
      {/* Toolbar */}
      <div className="sticky top-[106px] z-20 flex items-center gap-4 px-4 py-2 bg-[#252525] border-b border-[#3a3a3a]">
        <SearchBar projects={projects} onSearch={setSearchQuery} />
        <span className="text-xs text-[#666] font-mono hidden md:block whitespace-nowrap">
          {filteredProjects.length === projects.length
            ? `${projects.length} projects`
            : `${filteredProjects.length} of ${projects.length}`}
        </span>
      </div>

      {/* Spreadsheet */}
      <SpreadsheetTable 
        projects={filteredProjects} 
        isUnlocked={isUnlocked}
        onUnlockRequest={handleUnlockRequest}
      />

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-white font-medium mb-1">Full Portfolio Access</h3>
            <p className="text-[#888] text-sm mb-4">
              For full access to my portfolio, please enter the password to view or{" "}
              <a 
                href="mailto:carter@nothingradio.com?subject=Portfolio%20Access%20Request" 
                className="text-[#4a9eff] hover:underline"
              >
                request access
              </a>.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Password"
                autoFocus
                className={`w-full bg-[#2a2a2a] border ${
                  passwordError ? "border-red-500" : "border-[#3a3a3a]"
                } rounded px-3 py-2 text-white placeholder-[#666] focus:outline-none focus:border-[#4a9eff] transition-colors`}
              />
              {passwordError && (
                <p className="text-red-400 text-xs mt-1">Incorrect password</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] text-[#888] rounded hover:bg-[#333] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#4a9eff] text-white rounded hover:bg-[#3a8eef] transition-colors"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

