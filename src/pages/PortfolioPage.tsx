import { useState } from 'react';
import { Link } from 'react-router-dom';

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
}

const PortfolioPage = () => {
  // Sample portfolio data
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: 'OfficePro Inc.',
      description:
        "A revamped, WordPress-based platform that seamlessly integrates OfficePro Inc's technology training, certification, and AV staffing services.",
      image: '/assets/portfolio/projects/officepro.png',
      technologies: [
        'WordPress',
        'LearnPress',
        'HTML',
        'CSS',
        'JavaScript',
        'PHP',
        'MySQL',
      ],
      category: 'Web Application',
      client: 'OfficePro Inc.',
      link: 'https://officepro.on.thinkred.tech/',
    },
    {
      id: 2,
      title: 'Epic Learning Sync - WordPress Plugin',
      description:
        'A WordPress plugin that seamlessly synchronizes LearnPress courses with data from the Epic Learning Network API. It provides a robust, secure, and user-friendly way to manage course content while ensuring data integrity and performance.',
      image: '/assets/portfolio/projects/epic-learning-sync.png',
      technologies: [
        'WordPress',
        'LearnPress',
        'HTML',
        'CSS',
        'JavaScript',
        'PHP',
        'MySQL',
      ],
      category: 'WordPress Plugin',
      client: 'OfficePro Inc.',
      link: 'https://github.com/thinkredtech/epic-learning-sync',
    },
    {
      id: 3,
      title: 'Zeomed Services',
      description:
        'A WordPress based comprehensive healthcare management system portfolio site for managing digital content, business enquiries and selling course and training programs.',
      image: '/assets/portfolio/projects/zeomed-services.png',
      technologies: ['WordPress', 'HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      category: 'Web Application',
      client: 'Zeomed Services',
      link: 'https://zeomedservices.com',
    },
  ];

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extract unique technologies and categories for filter options
  const technologies = Array.from(
    new Set(portfolioItems.flatMap(item => item.technologies))
  );
  const categories = Array.from(
    new Set(portfolioItems.map(item => item.category))
  );

  // Filter portfolio items based on search term and filters
  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTech =
      selectedTech === '' || item.technologies.includes(selectedTech);
    const matchesCategory =
      selectedCategory === '' || item.category === selectedCategory;

    return matchesSearch && matchesTech && matchesCategory;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTech('');
    setSelectedCategory('');
  };

  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-backgroundAlt">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Our Portfolio
            </h1>
            <p className="text-lg text-secondary">
              Explore our recent projects and see how we've helped businesses
              transform their digital presence and operations.
            </p>
          </div>
        </div>
      </section>

      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
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
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Technology Filter */}
              <div>
                <label
                  htmlFor="tech-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Technology
                </label>
                <select
                  id="tech-filter"
                  value={selectedTech}
                  onChange={e => setSelectedTech(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Technologies</option>
                  {technologies.map((tech, index) => (
                    <option key={index} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
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
              Showing {filteredItems.length} of {portfolioItems.length} projects
            </p>
          </div>

          {/* Portfolio Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-secondary mb-4">{item.description}</p>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">
                        Client: {item.client}
                      </p>
                      <p className="text-sm text-gray-500">
                        Category: {item.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center"
                    >
                      View Project
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
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-secondary mb-4">
                No projects match your search criteria.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-secondary mb-6 max-w-2xl mx-auto">
              Let's discuss how ThinkRED can help bring your vision to life with
              our expertise in web development, platform engineering, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
              <Link to="/services" className="btn btn-secondary">
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
