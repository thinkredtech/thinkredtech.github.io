import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: string | number | boolean | object | undefined;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update document title
    document.title = config.title;

    // Update meta tags
    updateMetaTag("description", config.description);
    updateMetaTag("keywords", config.keywords || "");
    updateMetaTag("author", config.author || "ThinkRED Technologies");
    updateMetaTag("robots", getRobotsContent(config));

    // Open Graph tags
    updateMetaProperty("og:title", config.title);
    updateMetaProperty("og:description", config.description);
    updateMetaProperty("og:type", config.type || "website");
    updateMetaProperty("og:url", config.url || window.location.href);
    updateMetaProperty(
      "og:image",
      config.image || "/assets/logos/thinkRED-og-image.png",
    );
    updateMetaProperty("og:site_name", "ThinkRED Technologies");

    // Twitter Card tags
    updateMetaProperty("twitter:card", "summary_large_image");
    updateMetaProperty("twitter:title", config.title);
    updateMetaProperty("twitter:description", config.description);
    updateMetaProperty(
      "twitter:image",
      config.image || "/assets/logos/thinkRED-og-image.png",
    );

    // Article specific tags (for blog posts)
    if (config.type === "article") {
      updateMetaProperty(
        "article:author",
        config.author || "ThinkRED Technologies",
      );
      updateMetaProperty("article:section", config.section || "Technology");
      if (config.publishedTime) {
        updateMetaProperty("article:published_time", config.publishedTime);
      }
      if (config.modifiedTime) {
        updateMetaProperty("article:modified_time", config.modifiedTime);
      }
      if (config.tags) {
        // Remove existing article:tag tags
        removeMetaProperties("article:tag");
        // Add new article:tag tags
        config.tags.forEach((tag) => {
          const meta = document.createElement("meta");
          meta.setAttribute("property", "article:tag");
          meta.setAttribute("content", tag);
          document.head.appendChild(meta);
        });
      }
    }

    // Canonical URL
    updateCanonicalUrl(config.canonical || config.url || window.location.href);

    // Cleanup function to reset to defaults when component unmounts
    return () => {
      // Reset to default values if needed
      document.title =
        "ThinkRED Technologies | Simplify Technology & Experience";
    };
  }, [config]);
};

export const useStructuredData = (data: StructuredData) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    script.id = `structured-data-${data["@type"]}`;

    // Remove existing structured data of the same type
    const existing = document.getElementById(
      `structured-data-${data["@type"]}`,
    );
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(
        `structured-data-${data["@type"]}`,
      );
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [data]);
};

// Helper functions
const updateMetaTag = (name: string, content: string) => {
  if (!content) return;

  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

const updateMetaProperty = (property: string, content: string) => {
  if (!content) return;

  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

const removeMetaProperties = (property: string) => {
  const metas = document.querySelectorAll(`meta[property="${property}"]`);
  metas.forEach((meta) => meta.remove());
};

const updateCanonicalUrl = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
};

const getRobotsContent = (config: SEOConfig) => {
  const robots = [];

  if (config.noindex) {
    robots.push("noindex");
  } else {
    robots.push("index");
  }

  if (config.nofollow) {
    robots.push("nofollow");
  } else {
    robots.push("follow");
  }

  return robots.join(", ");
};

// Pre-defined SEO configurations for different page types
export const SEOConfigs = {
  home: {
    title:
      "ThinkRED Technologies | Expert Web & Mobile App Development, DevOps, Platform Engineering Services",
    description:
      "Transform your business with cutting-edge web applications, mobile apps, DevOps automation, and platform engineering solutions. Expert team delivering enterprise-grade technology solutions for startups to Fortune 500 companies.",
    keywords:
      "web development, mobile app development, DevOps automation, platform engineering, enterprise automation, React development, Node.js development, TypeScript development, cloud computing, technology consultation, custom software development, digital transformation, API development, microservices architecture, AWS cloud services, full-stack development, responsive web design, mobile-first development, enterprise software solutions, startup technology partner, software consulting, application modernization, system integration, database design, UI/UX design, agile development, continuous integration, continuous deployment, scalable applications, performance optimization",
    type: "website" as const,
  },

  about: {
    title:
      "About ThinkRED Technologies | Engineering Excellence & Innovation Leaders",
    description:
      "Learn about ThinkRED Technologies - an engineering-focused company delivering innovative web applications, platform solutions, and enterprise automation. Open source heritage meets enterprise expertise with proven track record.",
    keywords:
      "ThinkRED Technologies, software engineering company, technology innovation, enterprise solutions, open source, engineering excellence, company culture, software development team, technology consulting firm, web development agency, mobile app development company, DevOps consulting, platform engineering experts, digital transformation partners, enterprise technology solutions, custom software development company, agile development methodology, scalable technology solutions, experienced development team",
    type: "website" as const,
  },

  services: {
    title:
      "Our Services | Web Development, Mobile Apps, DevOps, Platform Engineering & Technology Consulting",
    description:
      "Comprehensive technology services including cutting-edge web & mobile app development, DevOps automation, platform engineering, enterprise automation, technology consultation, design & branding, and data & AI services for businesses of all sizes.",
    keywords:
      "web development services, mobile app development, DevOps automation, platform engineering, technology consultation, enterprise software development, cloud migration services, API development, microservices architecture, full-stack development, React development services, Node.js development, TypeScript development, database design, UI/UX design services, responsive web design, progressive web apps, native mobile apps, cross-platform development, enterprise automation, system integration, application modernization, digital transformation services, software consulting, technology strategy, performance optimization, scalable architecture, continuous integration, continuous deployment, infrastructure automation, cloud computing services, AWS consulting, data analytics, AI integration, machine learning solutions",
    type: "website" as const,
  },

  portfolio: {
    title:
      "Our Portfolio | Successful Web Development Projects & Technology Solutions Case Studies",
    description:
      "Explore our portfolio of successful web applications, enterprise platforms, mobile apps, and technology solutions. Real-world case studies showcasing our expertise in modern web technologies and digital transformation.",
    keywords:
      "portfolio, web development portfolio, mobile app portfolio, case studies, successful projects, web applications, enterprise platforms, React projects, Node.js applications, successful technology implementations, client testimonials, project showcase, digital transformation case studies, custom software solutions, enterprise web applications, mobile app development projects, e-commerce platforms, business automation solutions, API integration projects, database optimization, performance improvements, scalable web applications, responsive design examples, technology success stories",
    type: "website" as const,
  },

  careers: {
    title:
      "Careers at ThinkRED Technologies | Join Our Engineering Team - Remote & Hybrid Opportunities",
    description:
      "Join ThinkRED Technologies and work on cutting-edge projects with modern technologies. We're hiring passionate developers, DevOps engineers, and technology professionals. Remote-friendly culture with excellent growth opportunities.",
    keywords:
      "careers, technology jobs, software developer jobs, DevOps engineer careers, full-stack developer positions, React developer jobs, Node.js developer careers, TypeScript developer positions, frontend developer jobs, backend developer careers, mobile app developer jobs, platform engineer careers, remote work opportunities, hybrid work options, technology careers, software engineering jobs, web development careers, startup jobs, technology company careers, engineering positions, developer jobs, programming jobs, software architect positions, technical lead careers, senior developer jobs, junior developer positions, internship opportunities, technology internships",
    type: "website" as const,
  },

  blog: {
    title:
      "ThinkRED Blog | Technology Insights, Web Development Tutorials & Engineering Best Practices",
    description:
      "Stay updated with the latest technology trends, engineering best practices, and insights from the ThinkRED team. In-depth articles on web development, mobile app development, DevOps, platform engineering, and emerging technologies.",
    keywords:
      "technology blog, engineering insights, web development articles, mobile development tutorials, DevOps best practices, platform engineering, software development tutorials, tech industry trends, programming tutorials, React tutorials, Node.js guides, TypeScript articles, JavaScript development, frontend development, backend development, full-stack development, cloud computing articles, AWS tutorials, database optimization, performance tuning, software architecture, microservices patterns, API design, system design, technology trends, software engineering best practices, development methodologies, agile practices, continuous integration guides, deployment strategies, code quality, testing strategies, development tools, programming languages, framework comparisons",
    type: "website" as const,
  },

  contact: {
    title:
      "Contact ThinkRED Technologies | Get Your Project Started - Free Consultation & Quote",
    description:
      "Ready to transform your business with technology? Contact ThinkRED Technologies for web development, mobile app development, platform engineering, DevOps automation, and technology consultation services. Free consultation available.",
    keywords:
      "contact ThinkRED, get quote, technology consultation, project inquiry, web development consultation, mobile app development quote, enterprise solutions, custom software development, free consultation, project estimate, development services, technology partner, digital transformation consultation, software development quote, platform engineering consultation, DevOps consulting, cloud migration consultation, API development services, database design consultation, UI/UX design services, startup technology consulting, enterprise technology solutions, business automation consultation, system integration services, application modernization consulting, technology strategy consultation, software architecture consulting",
    type: "website" as const,
  },
};

// Structured data schemas
export const StructuredDataSchemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ThinkRED Technologies LLP",
    url: "https://thinkred.tech",
    logo: "https://thinkred.tech/assets/logos/thinkRED-logo.png",
    description:
      "ThinkRED Technologies - Expert web application development, platform engineering, DevOps automation, and technology consultation services.",
    foundingDate: "2021",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@thinkred.tech",
      contactType: "Customer Service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://github.com/thinkredtech",
      "https://www.linkedin.com/company/thinkred-technologies",
    ],
    areaServed: "Worldwide",
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "DevOps",
      "Platform Engineering",
      "Enterprise Automation",
      "Technology Consultation",
      "React",
      "Node.js",
      "TypeScript",
      "Cloud Computing",
    ],
    service: [
      {
        "@type": "Service",
        name: "Web Application Development",
        description:
          "Custom web application development using modern technologies like React, Node.js, and TypeScript. Full-stack solutions with responsive design and scalable architecture.",
        offers: {
          "@type": "Offer",
          category: "Web Development",
        },
      },
      {
        "@type": "Service",
        name: "Mobile App Development",
        description:
          "Native and cross-platform mobile application development for iOS and Android using React Native and modern mobile technologies.",
        offers: {
          "@type": "Offer",
          category: "Mobile Development",
        },
      },
      {
        "@type": "Service",
        name: "DevOps & Infrastructure Automation",
        description:
          "DevOps services, CI/CD pipeline setup, cloud migration, infrastructure automation, and deployment optimization using AWS and modern DevOps tools.",
        offers: {
          "@type": "Offer",
          category: "DevOps & Cloud",
        },
      },
      {
        "@type": "Service",
        name: "Platform Engineering",
        description:
          "Enterprise platform development, microservices architecture, API development, and scalable system design for complex business requirements.",
        offers: {
          "@type": "Offer",
          category: "Platform Engineering",
        },
      },
      {
        "@type": "Service",
        name: "Technology Consultation",
        description:
          "Expert technology consultation, architecture review, digital transformation guidance, and strategic technology planning for businesses.",
        offers: {
          "@type": "Offer",
          category: "Consulting",
        },
      },
      {
        "@type": "Service",
        name: "Enterprise Automation",
        description:
          "Business process automation, workflow optimization, system integration, and custom automation solutions to improve operational efficiency.",
        offers: {
          "@type": "Offer",
          category: "Enterprise Solutions",
        },
      },
      {
        "@type": "Service",
        name: "Design & Branding",
        description:
          "UI/UX design, brand identity development, user experience optimization, and design system creation for digital products.",
        offers: {
          "@type": "Offer",
          category: "Design & UX",
        },
      },
      {
        "@type": "Service",
        name: "Data & AI Services",
        description:
          "Data analytics implementation, AI integration, machine learning solutions, and intelligent automation for data-driven business decisions.",
        offers: {
          "@type": "Offer",
          category: "Data & AI",
        },
      },
    ],
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ThinkRED Technologies",
    url: "https://thinkred.tech",
    description:
      "Expert web development, platform engineering, and technology consultation services.",
    publisher: {
      "@type": "Organization",
      name: "ThinkRED Technologies LLP",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://thinkred.tech/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  article: (article: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
    keywords?: string[];
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ThinkRED Technologies LLP",
      logo: {
        "@type": "ImageObject",
        url: "https://thinkred.tech/assets/logos/thinkRED-logo.png",
      },
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image:
      article.image ||
      "https://thinkred.tech/assets/logos/thinkRED-og-image.png",
    url: article.url,
    keywords: article.keywords?.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  }),

  service: (service: {
    name: string;
    description: string;
    provider: string;
    areaServed?: string;
    serviceType?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider,
    },
    areaServed: service.areaServed || "Worldwide",
    serviceType: service.serviceType || "Technology Services",
  }),
};
