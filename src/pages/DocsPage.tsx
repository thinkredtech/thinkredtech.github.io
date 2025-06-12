import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { docPath = '', '*': wildcard = '' } = params;
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Reconstruct the full path
  const fullDocPath = wildcard ? `${docPath}/${wildcard}` : docPath;

  useEffect(() => {
    if (!fullDocPath) {
      setError('No document specified.');
      setContent('');
      return;
    }
    // Construct the path to the markdown file
    const mdPath = `/docs/${fullDocPath}.md`;
    fetch(mdPath)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load document.');
        return res.text();
      })
      .then(setContent)
      .catch(() => setError('Failed to load document.'));
  }, [fullDocPath]);

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
      />
    </div>
  );
};

export default DocsPage;
