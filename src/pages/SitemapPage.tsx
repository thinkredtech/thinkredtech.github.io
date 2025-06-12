import { Link } from 'react-router-dom';

const mainRoutes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms of Service', path: '/terms-of-service' },
];

const docsCategories = [
  {
    category: 'General',
    links: [
      { name: 'Brand Guidelines', path: '/docs/brand-guidelines' },
      { name: 'Design System', path: '/docs/design-system' },
      { name: 'Website Overview', path: '/docs/website-overview' },
      { name: 'Company Info', path: '/docs/company-info' },
      { name: 'Use Cases', path: '/docs/use-cases' },
    ],
  },
  {
    category: 'Implementation Checklists',
    links: [
      {
        name: 'Bugfix & Enhancements',
        path: '/docs/dev-checklists/bugfix-and-enhancements',
      },
      { name: 'Dev Progress', path: '/docs/dev-checklists/dev-progress' },
      { name: 'Testing Plan', path: '/docs/dev-checklists/testing-plan' },
    ],
  },
  {
    category: 'Page Specs',
    links: [
      { name: 'About Page', path: '/docs/page-specs/about_page' },
      { name: 'Avatar Assistant', path: '/docs/page-specs/avatar_assistant' },
      { name: 'Blog Page', path: '/docs/page-specs/blog_page' },
      { name: 'Contact Page', path: '/docs/page-specs/contact_page' },
      { name: 'Landing Page', path: '/docs/page-specs/landing_page' },
      { name: 'Portfolio Page', path: '/docs/page-specs/portfolio_page' },
      { name: 'Services Page', path: '/docs/page-specs/services_page' },
    ],
  },
];

const SitemapPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* SEO meta tags should be set at the document level, not here */}
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
          <ul className="space-y-2 text-lg">
            {mainRoutes.map(route => (
              <li key={route.path}>
                <Link to={route.path} className="hover:underline text-primary">
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">
            Documentation & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docsCategories.map(cat => (
              <div key={cat.category}>
                <h3 className="text-lg font-bold mb-2">{cat.category}</h3>
                <ul className="space-y-1 text-base">
                  {cat.links.map(link => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="hover:underline text-primary"
                        aria-label={link.name}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="mt-16 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ThinkRED Technologies LLP. All rights
        reserved.
      </footer>
    </div>
  );
};

export default SitemapPage;
