import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Enhanced Smart Search
    if (search) {
      const searchTerms = search.trim().toLowerCase().split(/\s+/).filter(term => term.length > 0);

      if (searchTerms.length === 1) {
        // Single word search - search across all fields
        const searchRegex = new RegExp(searchTerms[0], 'i');
        query.$or = [
          { category: searchRegex },
          { subcategory: searchRegex },
          { tags: { $elemMatch: { $regex: searchRegex } } },
          { name: searchRegex },
          { description: searchRegex },
          { 'specifications.material': searchRegex },
          { 'specifications.metalType': searchRegex },
          { 'specifications.gemstone': searchRegex },
          { 'seo.keywords': { $elemMatch: { $regex: searchRegex } } },
        ];
      } else {
        // Multi-word search (e.g., "mens bracelets", "silver ring")
        // Build conditions that must ALL match (AND logic across terms)
        const andConditions = searchTerms.map(term => {
          const termRegex = new RegExp(term, 'i');
          return {
            $or: [
              { category: termRegex },
              { subcategory: termRegex },
              { tags: { $elemMatch: { $regex: termRegex } } },
              { name: termRegex },
              { description: termRegex },
              { 'specifications.material': termRegex },
              { 'specifications.metalType': termRegex },
              { 'specifications.gemstone': termRegex },
              { 'seo.keywords': { $elemMatch: { $regex: termRegex } } },
              // Special handling for "mens" keyword
              ...(term === 'mens' || term === 'men' ? [{ men: true }] : []),
              ...(term === 'women' || term === 'womens' ? [{ women: true }] : []),
            ],
          };
        });

        query.$and = andConditions;
      }

      // Use aggregation for better relevance scoring
      const aggregationPipeline = [
        { $match: { ...query } },
        {
          $addFields: {
            // Calculate relevance score
            searchScore: {
              $add: [
                // Exact category match gets highest score
                { $cond: [{ $regexMatch: { input: "$category", regex: new RegExp(`^${searchTerms[0]}$`, 'i') } }, 100, 0] },
                // Category contains term
                { $cond: [{ $regexMatch: { input: "$category", regex: new RegExp(searchTerms[0], 'i') } }, 50, 0] },
                // Subcategory match
                { $cond: [{ $regexMatch: { input: { $ifNull: ["$subcategory", ""] }, regex: new RegExp(searchTerms[0], 'i') } }, 40, 0] },
                // Tags match (check if any tag matches)
                { $cond: [{ $gt: [{ $size: { $filter: { input: { $ifNull: ["$tags", []] }, as: "tag", cond: { $regexMatch: { input: "$$tag", regex: new RegExp(searchTerms[0], 'i') } } } } }, 0] }, 30, 0] },
                // Name contains term
                { $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(searchTerms[0], 'i') } }, 20, 0] },
                // Featured products get a boost
                { $cond: ["$isFeatured", 10, 0] },
                // Best sellers get a boost
                { $cond: ["$isBestSeller", 5, 0] },
              ],
            },
          },
        },
        { $sort: { searchScore: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const products = await Product.aggregate(aggregationPipeline);

      // Get total count for pagination
      const countPipeline = [
        { $match: { ...query } },
        { $count: "total" },
      ];
      const countResult = await Product.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;

      // Console log for debugging
      console.log(`\n🔍 SMART SEARCH: "${search}"`);
      console.log(`   Terms: [${searchTerms.join(', ')}]`);
      console.log(`   Results: ${products.length} of ${total} total`);

      return NextResponse.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
          },
          searchInfo: {
            query: search,
            terms: searchTerms,
            matchCount: total,
          },
        },
      });
    }

    // Non-search query (category listing, etc.)
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching products",
      },
      { status: 500 }
    );
  }
}
