import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
}

const BASE_URL = "https://neurabridgeco.lovable.app";
const SITE_NAME = "NeuraBridge";

export function usePageSEO({ title, description, canonical, ogType = "website", jsonLd }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = `${title} | ${SITE_NAME}`;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalEl && canonical) {
      canonicalEl.href = `${BASE_URL}${canonical}`;
    }

    // OG tags
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (el) el.setAttribute("content", content);
    };
    setMeta("og:title", `${title} | ${SITE_NAME}`);
    setMeta("og:description", description);
    setMeta("og:type", ogType);
    if (canonical) setMeta("og:url", `${BASE_URL}${canonical}`);
    setMeta("twitter:title", `${title} | ${SITE_NAME}`);
    setMeta("twitter:description", description);

    // JSON-LD
    let scriptEl = document.getElementById("page-jsonld");
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "page-jsonld";
        scriptEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Cleanup page-specific JSON-LD on unmount
      const el = document.getElementById("page-jsonld");
      if (el) el.remove();
    };
  }, [title, description, canonical, ogType, jsonLd]);
}
