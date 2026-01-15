import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Product from "@/lib/models/Product"

export async function GET() {
  const baseUrl = "https://www.mysabri.in"

  try {
    // Connect to database to fetch products
    await connectDB()
    
    // Use aggregation to avoid TypeScript issues
    const products = await Product.aggregate([
      { $match: { isActive: true } },
      { $project: { slug: 1, category: 1, updatedAt: 1 } }
    ])
    
    const productUrls = products.map((product: any) => {
      const categoryPath = product.category || "best-sellers"
      const productPath = product.slug || product._id
      return {
        loc: `${baseUrl}/${categoryPath}/${productPath}`,
        lastmod: product.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
      }
    })

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls
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
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating products sitemap:", error)
    return new NextResponse("Error generating sitemap", { status: 500 })
  }
}
