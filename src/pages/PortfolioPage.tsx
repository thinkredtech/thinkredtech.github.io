import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import Filter from '../components/ui/Filter';
import SearchInput from '../components/ui/SearchInput';
import ResetButton from '../components/ui/ResetButton';
import FilterContainer from '../components/ui/FilterContainer';

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
      <PageHero
        title="Our Portfolio"
        subtitle="Explore our recent projects and see how we've helped businesses transform their digital presence and operations."
      />

      <div className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Enhanced Search and Filters using shared components */}
          <FilterContainer
            showStats={true}
            totalItems={portfolioItems.length}
            filteredItems={filteredItems.length}
            itemName="projects"
            quickActions={
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-secondary/70">Popular:</span>
                {['WordPress', 'React', 'JavaScript'].map(tech => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
              {/* Enhanced Search Input */}
              <SearchInput
                label="Search Projects"
                placeholder="Search by title, description, or client..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="col-span-1 md:col-span-3"
              />

              {/* Enhanced Technology Filter */}
              <Filter
                label="Technology"
                options={technologies.map(tech => ({
                  label: tech,
                  value: tech,
                }))}
                value={selectedTech}
                onChange={setSelectedTech}
                placeholder="All Technologies"
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                }
              />

              {/* Enhanced Category Filter */}
              <Filter
                label="Category"
                options={categories.map(category => ({
                  label: category,
                  value: category,
                }))}
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

              {/* Enhanced Reset Button */}
              <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
                <label className="block label-1 text-secondary mb-2">
                  Actions
                </label>
                <ResetButton
                  onReset={resetFilters}
                  className="w-full max-w-[60px]"
                  title="Reset all filters"
                />
              </div>
            </div>
          </FilterContainer>

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
                    <h3 className="heading-2 mb-2">{item.title}</h3>
                    <p className="text-secondary mb-4">{item.description}</p>

                    <div className="mb-4">
                      <p className="text-sm text-secondary/70 mb-1">
                        Client: {item.client}
                      </p>
                      <p className="text-sm text-secondary/70">
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
              <p className="body-1-medium text-secondary mb-4">
                No projects match your search criteria.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="heading-1 mb-4">Ready to Start Your Project?</h2>
            <p className="text-secondary mb-6 max-w-2xl mx-auto">
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
