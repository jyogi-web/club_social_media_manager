export const setSEOTitle = (title: string) => {
  document.title = title;
};

export const setSEODescription = (description: string) => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

export const setSEOKeywords = (keywords: string) => {
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords);
  }
};

export const setOGPTags = (data: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}) => {
  if (data.title) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (ogTitle) ogTitle.setAttribute('content', data.title);
    if (twitterTitle) twitterTitle.setAttribute('content', data.title);
  }

  if (data.description) {
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (ogDescription) ogDescription.setAttribute('content', data.description);
    if (twitterDescription) twitterDescription.setAttribute('content', data.description);
  }

  if (data.url) {
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (ogUrl) ogUrl.setAttribute('content', data.url);
    if (twitterUrl) twitterUrl.setAttribute('content', data.url);
    if (canonical) canonical.setAttribute('href', data.url);
  }

  if (data.image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (ogImage) ogImage.setAttribute('content', data.image);
    if (twitterImage) twitterImage.setAttribute('content', data.image);
  }
};

export const addStructuredData = (data: Record<string, unknown>) => {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};