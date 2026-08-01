import { useEffect } from 'react';

export default function SEO({ title, description, path = '' }) {
  useEffect(() => {
    document.title = title
      ? `${title} | viewjob`
      : 'viewjob - Find Your Dream Job';

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    const desc = description || 'Find Your Dream Job. Browse thousands of job listings from top companies worldwide.';
    setMeta('description', desc);
    setMeta('og:title', document.title);
    setMeta('og:description', desc);
    setMeta('og:url', `https://viewjob.online${path}`);
    setMeta('og:type', 'website');

    // Structured Data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'viewjob',
      url: 'https://viewjob.online',
      description: desc,
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://viewjob.online/jobs?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();
    document.head.appendChild(script);
  }, [title, description, path]);

  return null;
}