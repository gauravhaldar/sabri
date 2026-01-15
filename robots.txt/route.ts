import { NextResponse } from "next/server"

export async function GET() {
  const robots = `
User-agent: *
Allow: /

# Block user-specific & non-SEO pages
Disallow: /profile
Disallow: /wishlist
Disallow: /cart

# Block internal APIs (extra safety)
Disallow: /api

# Sitemap location
Sitemap: https://www.mysabri.in/sitemap.xml
  `.trim()

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
