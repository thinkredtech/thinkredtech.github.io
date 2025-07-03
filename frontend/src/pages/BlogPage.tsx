import React, { useState } from "react";
import { Link } from "react-router-dom";

import { blogPosts } from "../data/blog/blogPosts";
import PageHero from "../components/ui/PageHero";
import Filter from "../components/ui/Filter";
import SearchInput from "../components/ui/SearchInput";
import ViewToggle from "../components/ui/ViewToggle";
import ResetButton from "../components/ui/ResetButton";
import FilterContainer from "../components/ui/FilterContainer";
import {
  useSEO,
  useStructuredData,
  SEOConfigs,
  StructuredDataSchemas,
} from "../hooks/useSEO";

const BlogPage = () => {
  // Apply SEO configuration for blog page
  useSEO({
    ...SEOConfigs.blog,
    url: `${window.location.origin}/blog`,
  });

  // Add breadcrumb structured data
  useStructuredData(
    StructuredDataSchemas.breadcrumb([
      { name: "Home", url: window.location.origin },
      { name: "Blog", url: `${window.location.origin}/blog` },
    ]),
  );
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract unique categories and tags for filter options
  const categories = Array.from(
    new Set(blogPosts.flatMap((post) => post.categories)),
  );
  const tags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  // Filter blog posts based on search term and filters
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || post.categories.includes(selectedCategory);
    const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedTag("");
  };

  return (
    <div>
      {/* Enhanced Hero Section using PageHero component */}
      <PageHero
        title="Blog & Insights"
        subtitle="Explore our latest articles, thought leadership, and engineering insights on technology trends and best practices."
      />

      {/* Enhanced Search and Content Section */}
      <div className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Enhanced Search and Filters */}
          <FilterContainer
            showStats={true}
            totalItems={blogPosts.length}
            filteredItems={filteredPosts.length}
            itemName="articles"
            quickActions={
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-secondary/70">Popular:</span>
                {["React", "DevOps", "Cloud"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
              {/* Enhanced Search Input */}
              <SearchInput
                label="Search Articles"
                placeholder="Search by title, content, or author..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="col-span-1 md:col-span-3"
              />

              {/* Enhanced Category Filter */}
              <Filter
                label="Category"
                options={categories.map((cat) => ({ label: cat, value: cat }))}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
                className="col-span-1 md:col-span-2"
                icon={
                  <svg
                    className="w-5 h-5 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
                    />
                  </svg>
                }
              />

              {/* Enhanced Tag Filter */}
              <Filter
                label="Tags"
                options={tags.map((tag) => ({ label: tag, value: tag }))}
                value={selectedTag}
                onChange={setSelectedTag}
                placeholder="All Tags"
                className="col-span-1 md:col-span-2"
                icon={
                  <svg
                    className="w-5 h-5 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                }
              />

              {/* View Mode Toggle and Reset */}
              <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
                <label className="block label-1 text-secondary mb-2">
                  Actions
                </label>
                <div className="flex gap-1">
                  <ViewToggle
                    viewMode={viewMode}
                    onToggle={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                    className="flex-1 max-w-[25px]"
                    title={
                      viewMode === "grid"
                        ? "Switch to List View"
                        : "Switch to Grid View"
                    }
                  />
                  <ResetButton
                    onReset={resetFilters}
                    className="flex-1 max-w-[25px]"
                    title="Reset all filters"
                  />
                </div>
              </div>
            </div>
          </FilterContainer>

          {/* Blog Posts Grid/List */}
          {filteredPosts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-60 md:h-48 lg:h-60"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-secondary/70">
                          {post.date}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-secondary/70">
                          {post.author}
                        </span>
                      </div>

                      <h3 className="heading-2 mb-2">{post.title}</h3>
                      <p className="text-secondary mb-4">{post.excerpt}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent1/10 text-accent1 text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-secondary text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/blog/${post.id}`}
                        className="text-primary hover:underline font-medium inline-flex items-center"
                      >
                        Read More
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="object-cover w-full h-48 md:h-full"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center mb-3">
                          <span className="text-sm text-secondary/70">
                            {post.date}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-secondary/70">
                            {post.author}
                          </span>
                        </div>

                        <h3 className="heading-2 mb-3">{post.title}</h3>
                        <p className="text-secondary mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.map((category, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-accent1/10 text-accent1 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-secondary text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-secondary/70">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/blog/${post.id}`}
                          className="text-primary hover:underline font-medium inline-flex items-center"
                        >
                          Read More
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="body-1-medium text-secondary mb-4">
                No articles match your search criteria.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Signup Section - Temporarily disabled until next development phase */}

      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto text-white">
            <h2 className="font-comfortaa display-2 mb-6">
              Stay Updated with Our Newsletter
            </h2>
            <p className="body-1-medium mb-8 opacity-90">
              Subscribe to receive the latest insights, articles, and resources
              directly to your inbox. Join our community of developers and
              technology enthusiasts.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 border-2 border-white/20 bg-white/10 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/50 backdrop-blur-sm"
                />
                <button className="btn bg-white text-primary hover:bg-white/90 px-6 py-3 body-1-semibold whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-white/70 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
