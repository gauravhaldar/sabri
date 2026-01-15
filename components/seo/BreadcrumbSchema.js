"use client";

export default function BreadcrumbSchema({ breadcrumbs }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}
