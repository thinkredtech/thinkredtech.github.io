import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';

// Define portfolio item type
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  client: string;
  link: string;
  featured?: boolean;
  completionDate?: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

const PortfolioPage = () => {
  const [animateInView, setAnimateInView] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Enhanced portfolio data with more details
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: 'E-Commerce Platform Redesign',
      description:
        'Complete overhaul of a multi-vendor e-commerce platform with modern UI/UX and enhanced performance.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
      category: 'Web Development',
      client: 'TechMart Inc.',
      link: 'https://example.com',
      featured: true,
      completionDate: '2024',
      stats: [
        { label: 'Page Speed', value: '95%' },
        { label: 'Conversion', value: '+40%' },
        { label: 'Users', value: '50K+' },
      ],
    },
    {
      id: 2,
      title: 'Healthcare Management System',
      description:
        'Comprehensive patient management system with appointment scheduling and telemedicine features.',
      image: '/api/placeholder/600/400',
      technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Docker'],
      category: 'Web Application',
      client: 'MediCare Solutions',
      link: 'https://example.com',
      featured: true,
      completionDate: '2024',
      stats: [
        { label: 'Patients', value: '10K+' },
        { label: 'Uptime', value: '99.9%' },
        { label: 'Efficiency', value: '+60%' },
      ],
    },
    {
      id: 3,
      title: 'Financial Dashboard',
      description:
        'Real-time financial analytics dashboard with interactive charts and reporting capabilities.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'D3.js', 'Node.js', 'Express', 'MongoDB'],
      category: 'Data Visualization',
      client: 'FinanceFlow Corp',
      link: 'https://example.com',
      completionDate: '2024',
      stats: [
        { label: 'Data Points', value: '1M+' },
        { label: 'Load Time', value: '2.1s' },
        { label: 'Accuracy', value: '99.8%' },
      ],
    },
    {
      id: 4,
      title: 'Mobile Learning App',
      description:
        'Cross-platform educational app with gamification and progress tracking for K-12 students.',
      image: '/api/placeholder/600/400',
      technologies: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
      category: 'Mobile Development',
      client: 'EduTech Academy',
      link: 'https://example.com',
      featured: true,
      completionDate: '2023',
      stats: [
        { label: 'Downloads', value: '100K+' },
        { label: 'Rating', value: '4.8★' },
        { label: 'Retention', value: '85%' },
      ],
    },
    {
      id: 5,
      title: 'Corporate Website Redesign',
      description:
        'Modern corporate website with CMS integration and multilingual support.',
      image: '/api/placeholder/600/400',
      technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
      category: 'WordPress',
      client: 'GlobalTech Enterprise',
      link: 'https://example.com',
      completionDate: '2023',
      stats: [
        { label: 'Performance', value: '92%' },
        { label: 'SEO Score', value: '98%' },
        { label: 'Traffic', value: '+75%' },
      ],
    },
    {
      id: 6,
      title: 'AI-Powered Chatbot',
      description:
        'Intelligent customer service chatbot with natural language processing and machine learning.',
      image: '/api/placeholder/600/400',
      technologies: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL'],
      category: 'Artificial Intelligence',
      client: 'ServiceBot Solutions',
      link: 'https://example.com',
      featured: true,
      completionDate: '2023',
      stats: [
        { label: 'Accuracy', value: '94%' },
        { label: 'Response Time', value: '1.2s' },
        { label: 'Satisfaction', value: '4.7★' },
      ],
    },
  ];

  const technologies = Array.from(
    new Set(portfolioItems.flatMap(item => item.technologies))
  );
  const categories = Array.from(
    new Set(portfolioItems.map(item => item.category))
  );

  const { elementRef: portfolioGridRef, visibleItems } = useStaggeredAnimation(
    portfolioItems.length,
    150
  );

  useEffect(() => {
    setAnimateInView(true);
  }, []);

  const filteredItems = portfolioItems.filter(item => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'featured' && item.featured) ||
      item.category.toLowerCase().replace(/\s+/g, '-') === activeFilter;

    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTech =
      !selectedTech || item.technologies.includes(selectedTech);
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;

    return matchesFilter && matchesSearch && matchesTech && matchesCategory;
  });

  const resetFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setSelectedTech('');
    setSelectedCategory('');
  };

  return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 hero-grid-bg opacity-10"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent1/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent2/20 to-primary/20 rounded-full blur-3xl animate-float animate-delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center transition-all duration-1000 ${
              animateInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent1 to-accent2 bg-clip-text text-transparent animate-gradient">
                Our Portfolio
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-8 max-w-3xl mx-auto">
              Discover our latest projects and success stories. From
              cutting-edge web applications to innovative WordPress solutions,
              explore how we bring ideas to life.
            </p>

            {/* Enhanced stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {[
                { label: 'Projects Completed', value: '150+', icon: 'rocket' },
                { label: 'Happy Clients', value: '100+', icon: 'heart' },
                { label: 'Technologies', value: '25+', icon: 'lightning' },
                { label: 'Years Experience', value: '5+', icon: 'chart' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-primary/20 transition-all duration-1000 delay-${
                    index * 100
                  } ${animateInView ? 'animate-slide-up opacity-100' : 'opacity-0'}`}
                >
                  <div className="text-2xl mb-2">
                    {stat.icon === 'rocket' && (
                      <svg
                        className="w-8 h-8 mx-auto text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                    {stat.icon === 'heart' && (
                      <svg
                        className="w-8 h-8 mx-auto text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                    {stat.icon === 'lightning' && (
                      <svg
                        className="w-8 h-8 mx-auto text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                    {stat.icon === 'chart' && (
                      <svg
                        className="w-8 h-8 mx-auto text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <section className="py-12 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              {
                key: 'all',
                label: 'All Projects',
                count: portfolioItems.length,
              },
              {
                key: 'featured',
                label: 'Featured',
                count: portfolioItems.filter(item => item.featured).length,
              },
              {
                key: 'web-development',
                label: 'Web Development',
                count: portfolioItems.filter(
                  item => item.category === 'Web Development'
                ).length,
              },
              {
                key: 'web-application',
                label: 'Web Applications',
                count: portfolioItems.filter(
                  item => item.category === 'Web Application'
                ).length,
              },
              {
                key: 'mobile-development',
                label: 'Mobile',
                count: portfolioItems.filter(
                  item => item.category === 'Mobile Development'
                ).length,
              },
              {
                key: 'wordpress',
                label: 'WordPress',
                count: portfolioItems.filter(
                  item => item.category === 'WordPress'
                ).length,
              },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-dark hover:bg-primary hover:text-white hover:scale-105'
                }`}
              >
                {filter.label}
                <span className="ml-2 text-xs opacity-75">
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>

          {/* Advanced filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Search filter */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <svg
                  className="w-5 h-5 mr-2 inline"
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
                Search Projects
              </label>
              <div className="relative">
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title, description, or client..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Technology filter */}
            <div>
              <label
                htmlFor="tech-filter"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ⚡ Technology
              </label>
              <select
                id="tech-filter"
                value={selectedTech}
                onChange={e => setSelectedTech(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                <option value="">All Technologies</option>
                {technologies.map(tech => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                📁 Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* View mode toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👁️ View Mode
              </label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-3 px-4 transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <svg
                    className="w-4 h-4 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-3 px-4 transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <svg
                    className="w-4 h-4 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-sm font-medium text-gray-600 mr-3">
              Quick filters:
            </span>
            {['WordPress', 'React', 'JavaScript', 'Featured'].map(chip => (
              <button
                key={chip}
                onClick={() => {
                  if (chip === 'Featured') {
                    setActiveFilter('featured');
                  } else {
                    setSelectedTech(chip);
                  }
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white text-xs font-medium text-gray-700 rounded-full transition-all duration-300"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="flex justify-center items-center mb-4">
                <div className="w-4 h-4 bg-accent1 rounded-full animate-bounce mr-2"></div>
                <div className="w-4 h-4 bg-accent2 rounded-full animate-bounce animation-delay-100 mr-2"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce animation-delay-200"></div>
              </div>
              <p className="text-secondary mt-4">Loading amazing projects...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-dark mb-2">
                No projects found
              </h3>
              <p className="text-secondary mb-6">
                No projects match your current filters. Try adjusting your
                search criteria.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          ) : (
            <div ref={portfolioGridRef}>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group relative bg-white rounded-2xl shadow-regular hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                        visibleItems.includes(index)
                          ? 'animate-slide-up opacity-100'
                          : 'opacity-0'
                      }`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Image container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Hover overlay with actions */}
                        {hoveredItem === item.id && (
                          <div className="absolute top-4 left-4 animate-pulse">
                            <div className="flex gap-2">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                                aria-label={`View ${item.title} project`}
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
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                              <button
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                                aria-label={`Preview ${item.title}`}
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Featured badge */}
                        {item.featured && (
                          <div className="absolute top-4 right-4">
                            <div className="bg-accent1 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                              ⭐ Featured
                            </div>
                          </div>
                        )}

                        {/* Client info overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-2">
                              <span className="font-medium text-dark">
                                Client:
                              </span>{' '}
                              {item.client}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                            <h3 className="text-xl font-bold text-dark mt-2 group-hover:text-primary transition-colors duration-300">
                              {item.title}
                            </h3>
                          </div>
                          {item.completionDate && (
                            <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded">
                              {item.completionDate}
                            </span>
                          )}
                        </div>

                        <p className="text-secondary mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Stats grid */}
                        {item.stats && (
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {item.stats.map((stat, statIndex) => (
                              <div key={statIndex} className="text-center">
                                <div className="text-lg font-bold text-primary">
                                  {stat.value}
                                </div>
                                <div className="text-xs text-secondary">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Technology tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.technologies
                            .slice(0, 4)
                            .map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 hover:bg-primary hover:text-white text-xs font-medium text-dark rounded-md transition-all duration-300 cursor-pointer"
                              >
                                {tech}
                              </span>
                            ))}
                          {item.technologies.length > 4 && (
                            <span className="px-2 py-1 bg-gray-200 text-xs font-medium text-gray-600 rounded-md">
                              +{item.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group bg-white rounded-2xl shadow-regular hover:shadow-lg transition-all duration-300 overflow-hidden ${
                        visibleItems.includes(index)
                          ? 'animate-slide-left opacity-100'
                          : 'opacity-0'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {item.category}
                              </span>
                              <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </h3>
                            </div>
                            {item.featured && (
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                ⭐ Featured
                              </span>
                            )}
                          </div>

                          <p className="text-secondary mb-4 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                            <span>
                              Client:{' '}
                              <span className="font-medium text-dark">
                                {item.client}
                              </span>
                            </span>
                            {item.completionDate && (
                              <span>Year: {item.completionDate}</span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.technologies
                              .slice(0, 5)
                              .map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-gray-100 text-xs font-medium text-dark rounded-md"
                                >
                                  {tech}
                                </span>
                              ))}
                            {item.technologies.length > 5 && (
                              <span className="px-2 py-1 bg-gray-200 text-xs font-medium text-gray-600 rounded-md">
                                +{item.technologies.length - 5}
                              </span>
                            )}
                          </div>

                          {/* Stats for list view */}
                          {item.stats && (
                            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl">
                              {item.stats.map((stat, statIndex) => (
                                <div key={statIndex} className="text-center">
                                  <div className="text-sm font-bold text-primary">
                                    {stat.value}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {stat.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-accent1 font-medium text-sm mt-4 transition-colors duration-300"
                          >
                            View Project
                            <svg
                              className="w-4 h-4 ml-2"
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
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent1 to-accent2"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="font-comfortaa text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Let&apos;s bring your vision to life with our expertise and
              dedication to excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </Link>
              <Link
                to="/services"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
