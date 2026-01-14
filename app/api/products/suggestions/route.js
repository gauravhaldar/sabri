import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

/**
 * Quick Search Suggestions API - OPTIMIZED FOR SPEED
 * Returns matching categories, subcategories, tags, and product names
 * for autocomplete/typeahead functionality
 */

// Pre-defined suggestions for instant response (no DB call needed)
const QUICK_SUGGESTIONS = {
    // Categories
    'ring': [{ type: 'category', text: 'Rings', value: 'rings', icon: 'grid' }],
    'necklace': [{ type: 'category', text: 'Necklaces', value: 'necklaces', icon: 'grid' }],
    'earring': [{ type: 'category', text: 'Earrings', value: 'earrings', icon: 'grid' }],
    'bracelet': [{ type: 'category', text: 'Bracelets', value: 'bracelets', icon: 'grid' }],
    'men': [{ type: 'category', text: "Men's", value: 'mens', icon: 'grid' }],
    'gift': [{ type: 'category', text: 'Gifts', value: 'gifts', icon: 'grid' }],
    // Common searches
    'silver': [
        { type: 'popular', text: 'Silver Ring', value: 'silver ring', icon: 'trending-up' },
        { type: 'popular', text: 'Silver Bracelet', value: 'silver bracelet', icon: 'trending-up' },
        { type: 'popular', text: 'Silver Necklace', value: 'silver necklace', icon: 'trending-up' },
    ],
    'chain': [
        { type: 'popular', text: 'Chain Bracelet', value: 'chain bracelet', icon: 'trending-up' },
        { type: 'popular', text: 'Chain Necklace', value: 'chain necklace', icon: 'trending-up' },
    ],
    'pearl': [
        { type: 'popular', text: 'Pearl Earrings', value: 'pearl earrings', icon: 'trending-up' },
        { type: 'popular', text: 'Pearl Necklace', value: 'pearl necklace', icon: 'trending-up' },
    ],
    'stud': [
        { type: 'popular', text: 'Stud Earrings', value: 'stud earrings', icon: 'trending-up' },
    ],
    'pendant': [
        { type: 'popular', text: 'Silver Pendant', value: 'silver pendant', icon: 'trending-up' },
    ],
    'wedding': [
        { type: 'popular', text: 'Wedding Ring', value: 'wedding ring', icon: 'trending-up' },
    ],
    'engagement': [
        { type: 'popular', text: 'Engagement Ring', value: 'engagement ring', icon: 'trending-up' },
    ],
};

// Get instant suggestions without DB call
function getInstantSuggestions(query) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    // Check pre-defined suggestions
    for (const [key, values] of Object.entries(QUICK_SUGGESTIONS)) {
        if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
            suggestions.push(...values);
        }
    }

    // Add category matches
    const categories = [
        { name: 'Rings', slug: 'rings' },
        { name: 'Necklaces', slug: 'necklaces' },
        { name: 'Earrings', slug: 'earrings' },
        { name: 'Bracelets', slug: 'bracelts' },
        { name: "Men's", slug: 'mens' },
        { name: 'Gifts', slug: 'gifts' },
    ];

    categories.forEach(cat => {
        if (cat.name.toLowerCase().includes(lowerQuery) || cat.slug.includes(lowerQuery)) {
            if (!suggestions.find(s => s.value === cat.slug)) {
                suggestions.push({
                    type: 'category',
                    text: cat.name,
                    value: cat.slug,
                    icon: 'grid',
                });
            }
        }
    });

    return suggestions.slice(0, 6);
}

export async function GET(request) {
    const startTime = Date.now();

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim().toLowerCase();
        const limit = parseInt(searchParams.get("limit")) || 6;

        if (!query || query.length < 1) {
            return NextResponse.json({
                success: true,
                data: { suggestions: [], products: [], query: '' },
            });
        }

        // STEP 1: Return instant suggestions immediately (no DB)
        const instantSuggestions = getInstantSuggestions(query);

        // For very short queries (1-2 chars), just return instant suggestions
        if (query.length <= 2) {
            console.log(`⚡ INSTANT SUGGESTIONS: "${query}" → ${instantSuggestions.length} in ${Date.now() - startTime}ms`);
            return NextResponse.json({
                success: true,
                data: {
                    query,
                    suggestions: instantSuggestions,
                    products: [],
                },
            });
        }

        // STEP 2: Connect to DB only for longer queries
        await connectDB();

        const searchRegex = new RegExp(query, 'i');

        // Run queries in parallel for speed
        const [matchingCategories, matchingSubcategories, matchingProducts] = await Promise.all([
            // Categories - very fast
            Product.distinct("category", { isActive: true, category: searchRegex }),

            // Subcategories - very fast
            Product.distinct("subcategory", { isActive: true, subcategory: searchRegex }),

            // Products - limited fields for speed
            Product.find(
                { isActive: true, name: searchRegex },
                { name: 1, category: 1, price: 1, slug: 1, _id: 1 }
            )
                .sort({ isFeatured: -1 })
                .limit(4)
                .lean(), // Use lean() for faster queries
        ]);

        // Build suggestions array
        const suggestions = [...instantSuggestions];

        // Add category matches
        matchingCategories.forEach(cat => {
            if (cat && !suggestions.find(s => s.value === cat)) {
                suggestions.push({
                    type: 'category',
                    text: cat.charAt(0).toUpperCase() + cat.slice(1),
                    value: cat,
                    icon: 'grid',
                });
            }
        });

        // Add subcategory matches
        matchingSubcategories.forEach(subcat => {
            if (subcat && !suggestions.find(s => s.value === subcat.toLowerCase())) {
                suggestions.push({
                    type: 'subcategory',
                    text: subcat,
                    value: subcat.toLowerCase(),
                    icon: 'tag',
                });
            }
        });

        // Format products
        const productSuggestions = matchingProducts.map(p => ({
            id: p._id.toString(),
            name: p.name,
            category: p.category,
            price: p.price,
            slug: p.slug,
        }));

        const responseTime = Date.now() - startTime;
        console.log(`⚡ SUGGESTIONS: "${query}" → ${suggestions.length} suggestions, ${productSuggestions.length} products in ${responseTime}ms`);

        return NextResponse.json({
            success: true,
            data: {
                query,
                suggestions: suggestions.slice(0, limit),
                products: productSuggestions,
                responseTime,
            },
        });
    } catch (error) {
        console.error("Error fetching suggestions:", error);

        // Return instant suggestions even on error
        const query = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() || '';
        const fallbackSuggestions = getInstantSuggestions(query);

        return NextResponse.json({
            success: true,
            data: {
                query,
                suggestions: fallbackSuggestions,
                products: [],
            },
        });
    }
}
