import React from 'react';
import { Link } from 'react-router-dom';

const SitemapPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
      <ul className="space-y-4 text-lg">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/portfolio">Portfolio</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Other Resources</h2>
        <ul className="space-y-2 text-base">
          <li><a href="/docs/brand_guidelines.md" target="_blank" rel="noopener noreferrer">Brand Guidelines</a></li>
          <li><a href="/docs/design_system.md" target="_blank" rel="noopener noreferrer">Design System</a></li>
          <li><a href="/docs/mockup_overview.md" target="_blank" rel="noopener noreferrer">Mockup Overview</a></li>
          <li><a href="/docs/implementation_checklists/todo.md" target="_blank" rel="noopener noreferrer">Development Todo</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SitemapPage;
