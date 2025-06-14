import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface DocParams {
  docPath?: string;
  '*'?: string;
  [key: string]: string | undefined;
}

const DocsPage = () => {
  // Get both docPath and wildcard for nested docs
  const params = useParams<DocParams>();
  const { docPath, '*': wildcard } = params;
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Reconstruct the full path - default to 'website-overview' if no path specified
  const fullDocPath = wildcard
    ? `${docPath}/${wildcard}`
    : docPath || 'website-overview';

  // Custom link component to handle internal docs links
  const LinkRenderer = (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: React.ReactNode;
    }
  ) => {
    const { href, children, ...otherProps } = props;

    // Check if it's an internal docs link
    if (href && href.startsWith('/docs/')) {
      // Normalize the path (convert underscores to hyphens for consistency)
      const normalizedHref = href.replace(
        /\/docs\/(.+)/,
        (_match: string, path: string) => {
          return `/docs/${path.replace(/_/g, '-')}`;
        }
      );

      return (
        <Link to={normalizedHref} {...otherProps}>
          {children}
        </Link>
      );
    }

    // For external links or non-docs internal links
    return (
      <a
        href={href}
        {...otherProps}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  };

  useEffect(() => {
    setContent('');
    setError(null);

    // Smart path resolution: Try multiple filename patterns
    const tryMultiplePaths = async (basePath: string): Promise<string> => {
      // Extract directory and filename parts
      const pathParts = basePath.split('/');
      const filename = pathParts[pathParts.length - 1];
      const directory = pathParts.slice(0, -1).join('/');

      // Generate all possible filename variants
      const variants = [
        filename, // Original (e.g., "landing-page")
        filename.replace(/-/g, '_'), // Underscores (e.g., "landing_page")
        filename.replace(/_/g, '-'), // Hyphens (e.g., "landing-page")
      ];

      // Remove duplicates using filter
      const uniqueVariants = variants.filter(
        (variant, index, arr) => arr.indexOf(variant) === index
      );

      // Try each variant
      for (const variant of uniqueVariants) {
        const fullPath = directory ? `${directory}/${variant}` : variant;
        const mdPath = `/docs/${fullPath}.md`;

        try {
          const res = await fetch(mdPath);
          if (res.ok) {
            const text = await res.text();

            // Verify it's actually markdown content
            if (!text.includes('<!DOCTYPE html>') && !text.includes('<html')) {
              return text;
            }
          }
        } catch {
          // Continue to next variant
          continue;
        }
      }

      throw new Error(
        `Document not found: ${basePath} (tried variants: ${uniqueVariants.join(', ')})`
      );
    };

    tryMultiplePaths(fullDocPath)
      .then(text => {
        setContent(text);
      })
      .catch(err => {
        setError(`Failed to load document: ${err.message}`);
      });
  }, [fullDocPath, docPath, wildcard]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto mb-16 mt-24 px-12 py-12 prose prose-lg max-w-3xl ">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          a: LinkRenderer,
        }}
      />
    </div>
  );
};

export default DocsPage;
