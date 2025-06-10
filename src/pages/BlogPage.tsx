import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { blogPosts } from '../data/blogPosts';

const BlogPage: React.FC = () => {
  // Sample blog data
  // const blogPosts: BlogPost[] = [
  //   {
  //     id: 1,
  //     title: "The Future of Internal Developer Platforms",
  //     excerpt: "How IDPs are revolutionizing development workflows and improving team productivity.",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     image: "/assets/images/thinkRED-square.png",
  //     author: "Sayak Sarkar",
  //     date: "May 15, 2025",
  //     categories: ["Development", "DevOps"],
  //     tags: ["IDP", "Developer Experience", "Automation"]
  //   },
  //   {
  //     id: 2,
  //     title: "Optimizing React Applications for Performance",
  //     excerpt: "Best practices and techniques for building lightning-fast React applications.",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     image: "/assets/images/thinkRED-square.png",
  //     author: "Sayak Sarkar",
  //     date: "May 10, 2025",
  //     categories: ["Development", "Frontend"],
  //     tags: ["React", "Performance", "JavaScript"]
  //   },
  //   {
  //     id: 3,
  //     title: "Kubernetes vs. Docker Swarm: Which is Right for Your Project?",
  //     excerpt: "A comprehensive comparison of two popular container orchestration platforms.",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     image: "/assets/images/thinkRED-square.png",
  //     author: "Sayak Sarkar",
  //     date: "May 5, 2025",
  //     categories: ["DevOps", "Infrastructure"],
  //     tags: ["Kubernetes", "Docker", "Containers"]
  //   },
  //   {
  //     id: 4,
  //     title: "Building Accessible Web Applications",
  //     excerpt: "Why accessibility matters and how to implement it in your web projects.",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     image: "/assets/images/thinkRED-square.png",
  //     author: "Sayak Sarkar",
  //     date: "April 28, 2025",
  //     categories: ["Development", "UX/UI"],
  //     tags: ["Accessibility", "Web Standards", "Inclusive Design"]
  //   },
  //   {
  //     id: 5,
  //     title: "The Rise of AI in Software Development",
  //     excerpt: "How artificial intelligence is changing the way we build and maintain software.",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     image: "/assets/images/thinkRED-square.png",
  //     author: "Sayak Sarkar",
  //     date: "April 20, 2025",
  //     categories: ["AI", "Development"],
  //     tags: ["Artificial Intelligence", "Machine Learning", "Future Tech"]
  //   },
  //   {
  //     id: 6,
  //     title: "Securing Your Web Applications: A Comprehensive Guide",
  //     excerpt: "Essential security practices every developer should implement.",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     image: "/assets/images/thinkRED-square.png",
  //     author: "Sayak Sarkar",
  //     date: "April 15, 2025",
  //     categories: ["Security", "Development"],
  //     tags: ["Cybersecurity", "Web Security", "Best Practices"]
  //   }
  // ];

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Extract unique categories and tags for filter options
  const categories = Array.from(
    new Set(blogPosts.flatMap(post => post.categories))
  );
  const tags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  // Filter blog posts based on search term and filters
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || post.categories.includes(selectedCategory);
    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  return (
    <div className="pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog & Insights
          </h1>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            Explore our latest articles, thought leadership, and engineering
            insights on technology trends and best practices.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label
                htmlFor="tag-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tag
              </label>
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Tags</option>
                {tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-secondary">
            Showing {filteredPosts.length} of {blogPosts.length} articles
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
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
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{post.author}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
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
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
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
          <div className="text-center py-12">
            <p className="text-xl text-secondary mb-4">
              No articles match your search criteria.
            </p>
            <button onClick={resetFilters} className="btn btn-primary">
              Reset Filters
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-lg text-secondary mb-6 max-w-2xl mx-auto">
            Subscribe to receive the latest insights, articles, and resources
            directly to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
