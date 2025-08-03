import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from markdown content
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      headings.push({ id, title, level });
    }

    setToc(headings);
  }, [content]);

  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        if (heading.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once to set initial active heading

    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Table of Contents
        </h3>
        <nav className="space-y-1">
          {toc.map(item => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left text-sm transition-colors hover:text-primary ${
                item.level === 1 ? "font-medium" : ""
              } ${item.level === 2 ? "pl-2" : ""} ${
                item.level === 3 ? "pl-4" : ""
              } ${item.level === 4 ? "pl-6" : ""} ${
                item.level >= 5 ? "pl-8" : ""
              } ${
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-gray-600"
              }`}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;
