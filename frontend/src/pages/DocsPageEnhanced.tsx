import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import DocumentationSearch from "../components/DocumentationSearch";

interface DocParams {
  docPath?: string;
  "*"?: string;
  [key: string]: string | undefined;
}

interface NavigationItem {
  title: string;
  path: string;
  children?: NavigationItem[];
}

const DocsPageEnhanced = () => {
  const params = useParams<DocParams>();
  const { docPath, "*": wildcard } = params;
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Reconstruct the full path - default to main README if no path specified
  const fullDocPath = wildcard ? `${docPath}/${wildcard}` : docPath || "README";

  // Documentation navigation structure
  const navigationStructure: NavigationItem[] = [
    {
      title: "📚 Documentation Hub",
      path: "README",
    },
    {
      title: "🏗️ Developer",
      path: "developer/guides/development",
      children: [
        {
          title: "🚀 Setup & Installation",
          path: "developer/setup/installation",
        },
        {
          title: "🔧 Environment Config",
          path: "developer/setup/environment",
        },
        {
          title: "🛠️ Troubleshooting",
          path: "developer/setup/troubleshooting",
        },
        {
          title: "🏗️ System Overview",
          path: "developer/architecture/system-overview",
        },
        {
          title: "⚛️ Frontend Architecture",
          path: "developer/architecture/frontend-architecture",
        },
        {
          title: "🔧 Backend Architecture",
          path: "developer/architecture/backend-architecture",
        },
        {
          title: "📡 API Documentation",
          path: "developer/apis/backend-apis",
        },
        {
          title: "🚀 Deployment Guide",
          path: "developer/deployment/production",
        },
        {
          title: "📝 Contributing",
          path: "developer/guides/contributing",
        },
        {
          title: "🎨 Code Style",
          path: "developer/guides/code-style",
        },
      ],
    },
    {
      title: "📝 Content",
      path: "content/README",
      children: [
        {
          title: "📰 Blog Management",
          path: "content/blog/README",
        },
        {
          title: "📄 Page Content",
          path: "content/pages/README",
        },
      ],
    },
    {
      title: "🔧 Operations",
      path: "operations/monitoring/README",
      children: [
        {
          title: "📊 Monitoring",
          path: "operations/monitoring/README",
        },
        {
          title: "🔒 Security",
          path: "operations/security/README",
        },
        {
          title: "⚡ Performance",
          path: "operations/performance/README",
        },
        {
          title: "🧪 Testing",
          path: "operations/testing/README",
        },
      ],
    },
    {
      title: "📋 Legacy Docs",
      path: "developer/guides/development",
      children: [
        {
          title: "🏗️ Architecture (Legacy)",
          path: "developer/architecture/system-overview",
        },
        {
          title: "💻 Development (Legacy)",
          path: "developer/guides/development",
        },
        {
          title: "📡 API (Legacy)",
          path: "developer/apis/backend-apis",
        },
        {
          title: "🚀 Deployment (Legacy)",
          path: "developer/deployment/production",
        },
      ],
    },
  ];

  // Custom link component to handle internal docs links
  const LinkRenderer = (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: React.ReactNode;
    },
  ) => {
    const { href, children, ...otherProps } = props;

    if (!href) {
      return <a {...otherProps}>{children}</a>;
    }

    // Check if it's an internal docs link starting with /docs/
    if (href.startsWith("/docs/")) {
      const normalizedHref = href.replace(
        /\/docs\/(.+)/,
        (_match: string, path: string) => {
          return `/docs/${path.replace(/_/g, "-")}`;
        },
      );

      return (
        <Link to={normalizedHref} {...otherProps}>
          {children}
        </Link>
      );
    }

    // Handle relative markdown links
    if (href.endsWith(".md") && !href.startsWith("http")) {
      // Convert relative path to absolute docs path
      let resolvedPath = href;

      // Get current directory from fullDocPath
      const currentDir = fullDocPath.includes("/")
        ? fullDocPath.substring(0, fullDocPath.lastIndexOf("/"))
        : "";

      // Handle relative paths
      if (href.startsWith("../")) {
        // Go up directories
        const upLevels = (href.match(/\.\.\//g) || []).length;
        let targetDir = currentDir;

        for (let i = 0; i < upLevels; i++) {
          if (targetDir.includes("/")) {
            targetDir = targetDir.substring(0, targetDir.lastIndexOf("/"));
          } else {
            targetDir = "";
          }
        }

        const fileName = href.replace(/\.\.\//g, "");
        resolvedPath = targetDir ? `${targetDir}/${fileName}` : fileName;
      } else if (href.startsWith("./")) {
        // Current directory reference - remove the ./
        const fileName = href.substring(2);
        resolvedPath = currentDir ? `${currentDir}/${fileName}` : fileName;
      } else if (!href.startsWith("/")) {
        // Relative to current directory
        resolvedPath = currentDir ? `${currentDir}/${href}` : href;
      }

      // Remove .md extension and normalize
      resolvedPath = resolvedPath.replace(/\.md$/, "").replace(/_/g, "-");

      return (
        <Link to={`/docs/${resolvedPath}`} {...otherProps}>
          {children}
        </Link>
      );
    }

    // For external links or other internal links
    return (
      <a
        href={href}
        {...otherProps}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  };

  // Navigation item component
  const NavigationItemComponent = ({
    item,
    level = 0,
  }: {
    item: NavigationItem;
    level?: number;
  }) => {
    const isActive = fullDocPath === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isParent = level === 0;

    return (
      <div className="w-full block">
        <Link
          to={`/docs/${item.path}`}
          className={`
            block w-full py-2 px-3 rounded-md font-medium transition-colors
            ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : isParent
                  ? "text-gray-900 hover:bg-gray-50 hover:text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary pl-6"
            }
            ${isParent ? "text-sm font-semibold" : "text-sm"}
          `}
          onClick={() => setSidebarOpen(false)}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <div className="space-y-1 block">
            {item.children!.map((child, index) => (
              <NavigationItemComponent
                key={index}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setContent("");
    setError(null);

    // Try multiple filename patterns for better compatibility
    const tryMultiplePaths = async (basePath: string): Promise<string> => {
      const variants = [
        basePath,
        basePath.replace(/-/g, "_"),
        basePath.replace(/_/g, "-"),
      ];

      const uniqueVariants = Array.from(new Set(variants));

      for (const variant of uniqueVariants) {
        try {
          const docUrl = `/docs/${variant}.md`;
          const res = await fetch(docUrl);

          if (res.ok) {
            const text = await res.text();

            // Verify it's actually markdown content
            if (!text.includes("<!DOCTYPE html>") && !text.includes("<html")) {
              return text;
            }
          }
        } catch {
          // Continue to next variant
          continue;
        }
      }

      throw new Error(
        `Document not found: ${basePath} (tried variants: ${uniqueVariants.join(", ")})`,
      );
    };

    tryMultiplePaths(fullDocPath)
      .then(text => {
        setContent(text);
      })
      .catch(err => {
        setError(`Failed to load document: ${err.message}`);
      });
  }, [fullDocPath]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close sidebar on mobile
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  if (error) {
    return (
      <div className="min-h-screen bg-backgroundAlt">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h1 className="text-2xl font-bold text-red-800 mb-4">
                Document Not Found
              </h1>
              <p className="text-red-600 mb-6">{error}</p>
              <Link
                to="/docs"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Return to Documentation Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-backgroundAlt">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary">Loading documentation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Documentation Search Modal */}
      <DocumentationSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto flex gap-6 lg:gap-8">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
            aria-label="Toggle navigation sidebar"
            title="Toggle navigation sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Sidebar */}
          <div
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 lg:w-72 xl:w-80 bg-white shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out pt-20 lg:pt-0`}
          >
            <div className="p-4 lg:p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Documentation
                </h2>
                <div className="flex items-center gap-2">
                  {/* Search Button */}
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Search documentation"
                    title="Search documentation (⌘K)"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md transition-colors"
                    aria-label="Close navigation sidebar"
                    title="Close navigation sidebar"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <nav className="space-y-1 flex flex-col">
                {navigationStructure.map((item, index) => (
                  <NavigationItemComponent key={index} item={item} />
                ))}
              </nav>
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
                <ReactMarkdown
                  children={content}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    a: LinkRenderer,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPageEnhanced;
