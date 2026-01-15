import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://www.mysabri.in"

  // 1️⃣ Static pages
  const staticPages = [
    "",
    "/contact-us",
    "/blog",
    "/privacy-policy",
    "/policies/shipping-delivery-policy",
    "/policies/return-exchange-policy",
    "/policies/terms-of-service",
  ]

  const staticUrls = staticPages.map((path) => ({
    loc: `${baseUrl}${path}`,
    lastmod: new Date().toISOString(),
    changefreq: "monthly",
    priority: path === "" ? "1.0" : "0.6",
  }))

  // 2️⃣ Product / category pages
  const categoryPages = [
    "/new-arrivals",
    "/best-sellers",
    "/bracelets",
    "/necklaces",
    "/rings",
    "/earrings",
    "/ring-cum-bangle",
    "/mens",
    "/women",
    "/gifts",
  ]

  const categoryUrls = categoryPages.map((path) => ({
    loc: `${baseUrl}${path}`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: "0.9",
  }))

  // 3️⃣ Merge all URLs
  const allUrls = [...staticUrls, ...categoryUrls]

  // 4️⃣ Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`
  )
  .join("")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
    },
  })
}
