"use client";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sabri Jewellery",
    url: "https://www.mysabri.in",
    logo: "https://www.mysabri.in/sabrilogo.png",
    description: "Premium silver jewellery set collections online at Mysabri. Pure 925 designs, elegant craftsmanship, and beautiful gifting options.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX", // Replace with actual phone number
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"]
    },
    sameAs: [
      // Add social media URLs when available
      // "https://www.facebook.com/mysabri",
      // "https://www.instagram.com/mysabri",
      // "https://twitter.com/mysabri"
    ],
    address: {
      "@type": "PostalAddress",
      // Add actual address when available
      // streetAddress: "123 Jewellery Street",
      // addressLocality: "Mumbai",
      // addressRegion: "Maharashtra",
      // postalCode: "400001",
      // addressCountry: "IN"
    }
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
