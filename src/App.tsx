import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './styles/LoadingScreen.css';

const DocsPage = lazy(() => import('./pages/DocsPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AvatarAssistant = lazy(() => import('./components/AvatarAssistant'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense
          fallback={
            <div className="loading-screen">
              <div className="loading-logo">
                <img src="/assets/images/thinkRED-np.svg" alt="ThinkRED Logo" />
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            <Route path="/docs/:docPath/*" element={<DocsPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          </Routes>
          <AvatarAssistant />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
