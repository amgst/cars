import { useEffect } from "react";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import { useLocation } from "wouter";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

export function SEO({ title, description, image, type = "website", noindex = false }: SEOProps) {
  const [location] = useLocation();
  const { settings } = useWebsiteSettings();

  useEffect(() => {
    if (!settings) return;

    // Update document title
    const pageTitle = title || settings.websiteName || "Premium Car Rentals Australia";
    const fullTitle = title ? `${title} | ${settings.websiteName || "Premium Car Rentals Australia"}` : `${settings.websiteName || "Premium Car Rentals Australia"} - Luxury Vehicle Hire`;
    document.title = fullTitle;

    // Update meta description
    const metaDesc = description || settings.metaDescription || settings.description || "";
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = metaDesc;

    // Update keywords
    if (settings.metaKeywords) {
      let metaKeywords = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = settings.metaKeywords;
    }

    // Update canonical URL
    const canonicalUrl = typeof window !== "undefined" ? window.location.origin + location : location;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Update Open Graph tags
    const ogTitle = title || settings.websiteName || "Premium Car Rentals Australia";
    const ogDesc = description || settings.metaDescription || settings.description || "";
    const ogImage = image || settings.logo || "/og-image.jpg";

    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateOGTag("og:title", ogTitle);
    updateOGTag("og:description", ogDesc);
    updateOGTag("og:url", canonicalUrl);
    updateOGTag("og:type", type);
    updateOGTag("og:image", ogImage);
    updateOGTag("og:locale", "en_AU");
    if (settings.websiteName) {
      updateOGTag("og:site_name", settings.websiteName);
    }

    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateTwitterTag("twitter:card", "summary_large_image");
    updateTwitterTag("twitter:title", ogTitle);
    updateTwitterTag("twitter:description", ogDesc);
    updateTwitterTag("twitter:image", ogImage);

    // Robots meta tag
    if (noindex) {
      let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.appendChild(robots);
      }
      robots.content = "noindex, nofollow";
    }

    // Add structured data (JSON-LD) for LocalBusiness
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CarRental",
      "name": settings.companyName || settings.websiteName || "Premium Car Rentals Australia",
      "description": settings.description || settings.metaDescription || "",
      "url": canonicalUrl,
      "telephone": settings.phone || "",
      "email": settings.email || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": settings.address?.split(",")[0] || "",
        "addressLocality": settings.address?.match(/[A-Za-z]+/g)?.[0] || "Sydney",
        "addressRegion": settings.address?.match(/NSW|VIC|QLD|WA|SA|TAS|NT|ACT/)?.[0] || "NSW",
        "postalCode": settings.address?.match(/\d{4}/)?.[0] || "",
        "addressCountry": "AU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-33.8688",
        "longitude": "151.2093"
      },
      "priceRange": "$$-$$$",
      "areaServed": {
        "@type": "Country",
        "name": "Australia"
      },
      "sameAs": [
        settings.facebookUrl,
        settings.twitterUrl,
        settings.instagramUrl,
        settings.linkedinUrl
      ].filter(Boolean)
    };

    // Remove existing structured data script
    let existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }, [settings, title, description, image, type, noindex, location]);

  return null;
}

