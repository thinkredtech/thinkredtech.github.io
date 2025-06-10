import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// Import sample blog posts data (this would typically come from an API)
import { blogPosts, BlogPost } from '../data/blogPosts';

interface BlogPostParams {
  postId: string;
  [key: string]: string;
}

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<BlogPostParams>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [heroRef, setHeroRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Simulate fetching post data
    // In a real application, this would be an API call
    setTimeout(() => {
      try {
        const foundPost = blogPosts.find(p => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
          setLoading(false);
        } else {
          setError('Blog post not found');
          setLoading(false);
        }
      } catch {
        setError('Error loading blog post');
        setLoading(false);
      }
    }, 300); // Simulate network delay
  }, [postId]);

  // Set CSS custom property for background image to avoid inline styles
  useEffect(() => {
    if (post?.image && heroRef) {
      heroRef.style.setProperty('--hero-bg-image', `url(${post.image})`);
    }
  }, [post?.image, heroRef]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {error || 'Post not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't seem to exist.
          </p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div
        ref={setHeroRef}
        className="w-full md:mt-20 mt-14 h-96 bg-cover bg-center relative hero-background"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent1/80 text-white text-sm rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-white">
                <div className="flex items-center">
                  <img
                    src={post.authorImage || '/assets/images/default-avatar.png'}
                    alt={post.author}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <span>{post.author}</span>
                </div>
                <span className="mx-3">•</span>
                <span>{post.date}</span>
                <span className="mx-3">•</span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
            {/* Markdown Content with HTML support */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Share this article</h3>
              <div className="flex space-x-4">
                {(() => {
                  const url = window.location.href;
                  const title = post.title;
                  const author = post.author;
                  const readTime = post.readTime || '5 min read';
                  const firstLine =
                    post.content
                      .split('\n')
                      .find((line: string) => line.trim())
                      ?.trim() || '';
                  const summary = `Check out "${title}" by ${author} (${readTime}): ${firstLine}`;

                  return (
                    <>
                      <button
                        type="button"
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Share on Facebook"
                        aria-label="Share on Facebook"
                        onClick={() => {
                          // Facebook no longer supports prefilled text via URL params. Only the URL will be shared.
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                            '_blank',
                            'noopener,noreferrer'
                          );
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                        title="Share on Twitter"
                        aria-label="Share on Twitter"
                        onClick={() => {
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${summary} ${url}`)}`,
                            '_blank',
                            'noopener,noreferrer'
                          );
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                        title="Share on LinkedIn"
                        aria-label="Share on LinkedIn"
                        onClick={() => {
                          // LinkedIn no longer supports prefilled summary/title via URL params. Only the URL will be shared.
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                            '_blank',
                            'noopener,noreferrer'
                          );
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 mt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={post.authorImage || '/assets/images/default-avatar.png'}
                alt={post.author}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold mb-2">{post.author}</h3>
                <p className="text-gray-600 mb-4">
                  {post.authorBio ||
                    'Technology enthusiast and writer at ThinkRED Technologies. Passionate about sharing knowledge and exploring new technologies.'}
                </p>
                <div className="flex space-x-4">
                  {post.authorWebsite && (
                    <a
                      href={post.authorWebsite}
                      className="text-primary hover:text-primary-dark"
                      aria-label={`${post.author}'s Website`}
                      title={`${post.author}'s Website`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </a>
                  )}
                  {post.authorFacebook && (
                    <a
                      href={post.authorFacebook}
                      className="text-primary hover:text-primary-dark"
                      aria-label={`${post.author}'s Facebook Profile`}
                      title={`${post.author}'s Facebook Profile`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {post.authorTwitter && (
                    <a
                      href={post.authorTwitter}
                      className="text-primary hover:text-primary-dark"
                      aria-label={`${post.author}'s Twitter Profile`}
                      title={`${post.author}'s Twitter Profile`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                  {post.authorLinkedIn && (
                    <a
                      href={post.authorLinkedIn}
                      className="text-primary hover:text-primary-dark"
                      aria-label={`${post.author}'s LinkedIn Profile`}
                      title={`${post.author}'s LinkedIn Profile`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {post.authorGitHub && (
                    <a
                      href={post.authorGitHub}
                      className="text-primary hover:text-primary-dark"
                      aria-label={`${post.author}'s GitHub Profile`}
                      title={`${post.author}'s GitHub Profile`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.853 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts
                .filter(
                  relatedPost =>
                    relatedPost.id !== postId &&
                    relatedPost.categories.some(cat =>
                      post.categories.includes(cat)
                    )
                )
                .slice(0, 3)
                .map(relatedPost => (
                  <div
                    key={relatedPost.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="object-cover w-full h-48"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <Link
                        to={`/blog/${relatedPost.id}`}
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
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
