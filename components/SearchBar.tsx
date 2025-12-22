"use client";

import { useState, useEffect, useMemo } from "react";
import { Project } from "@/types/project";

interface SearchBarProps {
  projects: Project[];
  onSearch: (query: string) => void;
}

export default function SearchBar({ projects, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Extract unique values from projects
  const suggestions = useMemo(() => {
    const categories = new Set<string>();
    const clients = new Set<string>();
    const roles = new Set<string>();

    projects.forEach((project) => {
      if (project.category) categories.add(project.category);
      if (project.client) clients.add(project.client);
      if (project.role) {
        // Split roles by comma and add each
        project.role.split(",").forEach((r) => {
          const trimmed = r.trim();
          if (trimmed) roles.add(trimmed);
        });
      }
    });

    return [
      ...Array.from(categories).map((c) => `${c}`),
      ...Array.from(clients).map((c) => `${c}`),
      ...Array.from(roles).map((r) => `${r}`),
    ].filter((s) => s.length > 0);
  }, [projects]);

  // Typing animation for placeholder
  useEffect(() => {
    if (isFocused || query) {
      setPlaceholder("");
      return;
    }

    let currentIndex = Math.floor(Math.random() * suggestions.length);
    let charIndex = 0;
    let isDeleting = false;
    let currentText = "";

    const getRandomSuggestion = () => {
      const newIndex = Math.floor(Math.random() * suggestions.length);
      return suggestions[newIndex] || "Search projects...";
    };

    const type = () => {
      const currentSuggestion = suggestions[currentIndex] || "Search projects...";

      if (!isDeleting) {
        currentText = currentSuggestion.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentSuggestion.length) {
          setIsTyping(false);
          setTimeout(() => {
            isDeleting = true;
            setIsTyping(true);
          }, 2000);
        }
      } else {
        currentText = currentSuggestion.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = Math.floor(Math.random() * suggestions.length);
        }
      }

      setPlaceholder(currentText);
    };

    const interval = setInterval(type, isDeleting ? 30 : 60);
    return () => clearInterval(interval);
  }, [suggestions, isFocused, query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || "Search..."}
          className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-1.5 pl-9 pr-8 text-xs text-white font-mono placeholder-[#555] focus:outline-none focus:border-[#C1121E] transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

