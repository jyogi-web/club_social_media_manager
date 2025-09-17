import { useEffect } from 'react';
import { setSEOTitle, setSEODescription, setOGPTags, addStructuredData } from '../utils/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogp?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
  };
  structuredData?: Record<string, unknown>;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogp,
  structuredData
}: SEOProps) => {
  useEffect(() => {
    if (title) {
      setSEOTitle(title);
    }

    if (description) {
      setSEODescription(description);
    }

    if (ogp) {
      setOGPTags(ogp);
    }

    if (structuredData) {
      addStructuredData(structuredData);
    }

    return () => {
      setSEOTitle('Club Social Media Manager - クラブのSNS投稿を効率的に管理');
      setSEODescription('クラブや団体のソーシャルメディア投稿を効率的に管理・作成できるWebアプリケーション。Discord連携でメンバーと簡単に共有。');
    };
  }, [title, description, keywords, ogp, structuredData]);
};