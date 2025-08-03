import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  category: string;
  score?: number;
}

interface DocumentationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

export default function DocumentationSearch({
  isOpen,
  onClose,
  placeholder = "Search documentation...",
}: DocumentationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search index for documentation pages
  const searchIndex: SearchResult[] = useMemo(
    () => [
      {
        title: "Documentation Hub",
        path: "README",
        excerpt:
          "Welcome to the ThinkRED documentation. Your gateway to all technical and content documentation.",
        category: "Overview",
      },
      {
        title: "Setup & Installation",
        path: "developer/setup/installation",
        excerpt:
          "Complete guide to setting up the ThinkRED development environment on your local machine.",
        category: "Developer",
      },
      {
        title: "Environment Configuration",
        path: "developer/setup/environment",
        excerpt:
          "Configure environment variables, API keys, and development settings for optimal performance.",
        category: "Developer",
      },
      {
        title: "System Architecture",
        path: "developer/architecture/system-overview",
        excerpt:
          "High-level overview of the ThinkRED system architecture, components, and data flow.",
        category: "Developer",
      },
      {
        title: "API Documentation",
        path: "developer/api/overview",
        excerpt:
          "Complete API reference for ThinkRED services including authentication, endpoints, and examples.",
        category: "Developer",
      },
      {
        title: "Contributing Guide",
        path: "developer/CONTRIBUTING",
        excerpt:
          "Guidelines for contributing to ThinkRED projects including code standards and workflow.",
        category: "Developer",
      },
      {
        title: "Security Guidelines",
        path: "developer/SECURITY",
        excerpt:
          "Security best practices and vulnerability management for ThinkRED projects.",
        category: "Developer",
      },
      {
        title: "Style Guide",
        path: "developer/STYLE_GUIDE",
        excerpt:
          "Code style guidelines and formatting standards for ThinkRED projects.",
        category: "Developer",
      },
      {
        title: "Content Guidelines",
        path: "content/README",
        excerpt:
          "Brand guidelines, content strategy, and writing standards for ThinkRED.",
        category: "Content",
      },
      {
        title: "Blog Management",
        path: "content/blog/README",
        excerpt:
          "Blog content creation, management, and publishing workflow guidelines.",
        category: "Content",
      },
      {
        title: "SEO Enhancement",
        path: "content/SEO_ENHANCEMENT_REPORT",
        excerpt:
          "SEO optimization strategies, implementation guide, and performance metrics.",
        category: "Content",
      },
      {
        title: "Deployment Guide",
        path: "operations/DEPLOYMENT",
        excerpt:
          "Deployment procedures, CI/CD workflows, and best practices for ThinkRED applications.",
        category: "Operations",
      },
      {
        title: "Zero Downtime Deployment",
        path: "operations/ZERO_DOWNTIME_DEPLOYMENT",
        excerpt:
          "Advanced deployment strategies for achieving zero downtime updates and rollbacks.",
        category: "Operations",
      },
      {
        title: "SSH Deployment",
        path: "operations/SSH_DEPLOYMENT",
        excerpt:
          "SSH-based deployment procedures, security considerations, and automation scripts.",
        category: "Operations",
      },
      {
        title: "Configuration Management",
        path: "operations/CONFIGURATION",
        excerpt:
          "Environment configuration, settings management, and deployment variables.",
        category: "Operations",
      },
      {
        title: "Health Monitoring",
        path: "operations/HEALTH_REPORTS",
        excerpt:
          "System health monitoring, alerting, and operational reporting procedures.",
        category: "Operations",
      },
      {
        title: "Performance Management",
        path: "operations/performance/README",
        excerpt:
          "Performance optimization, testing procedures, and troubleshooting guidelines.",
        category: "Operations",
      },
    ],
    [],
  );

  // Perform search
  const performSearch = useCallback(
    (searchQuery: string): SearchResult[] => {
      if (!searchQuery.trim()) return [];

      const normalizedQuery = searchQuery.toLowerCase().trim();
      const words = normalizedQuery.split(/\s+/);

      return searchIndex
        .map(item => {
          let score = 0;
          const title = item.title.toLowerCase();
          const excerpt = item.excerpt.toLowerCase();
          const category = item.category.toLowerCase();

          // Exact title match gets highest score
          if (title === normalizedQuery) score += 100;

          // Title contains query
          if (title.includes(normalizedQuery)) score += 50;

          // Category match
          if (category.includes(normalizedQuery)) score += 30;

          // Excerpt contains query
          if (excerpt.includes(normalizedQuery)) score += 20;

          // Word-based scoring
          words.forEach(word => {
            if (title.includes(word)) score += 10;
            if (excerpt.includes(word)) score += 5;
            if (category.includes(word)) score += 8;
          });

          return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8); // Limit to top 8 results
    },
    [searchIndex],
  );

  // Handle search input change
  useEffect(() => {
    if (query.trim()) {
      const searchResults = performSearch(query);
      setResults(searchResults);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query, performSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick();
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  // Handle result click
  const handleResultClick = () => {
    onClose();
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "developer":
        return "bg-blue-100 text-blue-800";
      case "content":
        return "bg-green-100 text-green-800";
      case "operations":
        return "bg-purple-100 text-purple-800";
      case "overview":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const words = searchQuery.toLowerCase().split(/\s+/);
    let highlightedText = text;

    words.forEach(word => {
      const regex = new RegExp(`(${word})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200">$1</mark>',
      );
    });

    return highlightedText;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl">
        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {query.trim() && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.path}-${index}`}
                  to={`/docs/${result.path}`}
                  onClick={() => handleResultClick()}
                  className={`block px-4 py-3 hover:bg-gray-50 border-l-4 transition-colors ${
                    selectedIndex === index
                      ? "bg-gray-50 border-primary"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className="font-medium text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(result.title, query),
                          }}
                        />
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}
                        >
                          {result.category}
                        </span>
                      </div>
                      <p
                        className="text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.excerpt, query),
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">
                Try different keywords or browse popular pages below
              </p>
            </div>
          )}

          {!query.trim() && (
            <div className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Popular Pages
                </h3>
                <div className="space-y-1">
                  {searchIndex.slice(0, 5).map((item, index) => (
                    <Link
                      key={`popular-${index}`}
                      to={`/docs/${item.path}`}
                      onClick={() => handleResultClick()}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}
                        >
                          {item.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-4 border-t pt-3">
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                      ↵
                    </kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                      esc
                    </kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
