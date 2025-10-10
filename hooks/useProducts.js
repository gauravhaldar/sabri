import { useState, useEffect } from "react";
import {
  transformProductsFromBackend,
  transformProductFromBackend,
} from "../lib/productUtils";

export function useProducts(category = null, filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (category) params.append("category", category);
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
          }
        });

        const queryString = params.toString();
        const response = await fetch(
          `/api/products${queryString ? `?${queryString}` : ""}`
        );
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, JSON.stringify(filters)]);

  return { products, loading, error, refetch: () => fetchProducts() };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/slug/${slug}`);
        const data = await response.json();

        if (data.success) {
          const transformedProduct = transformProductFromBackend(
            data.data.product
          );
          setProduct(transformedProduct);
        } else {
          setError(data.message || "Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error, refetch: () => fetchProduct() };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/featured");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch featured products");
        }
      } catch (err) {
        setError("Failed to fetch featured products");
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error, refetch: () => fetchFeaturedProducts() };
}

export function useNewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/new-arrivals");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch new arrivals");
        }
      } catch (err) {
        setError("Failed to fetch new arrivals");
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return { products, loading, error, refetch: () => fetchNewArrivals() };
}

export function useBestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/best-sellers");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch best sellers");
        }
      } catch (err) {
        setError("Failed to fetch best sellers");
        console.error("Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return { products, loading, error, refetch: () => fetchBestSellers() };
}

export function useNecklaces() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNecklaces = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/necklaces");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch necklaces");
        }
      } catch (err) {
        setError("Failed to fetch necklaces");
        console.error("Error fetching necklaces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNecklaces();
  }, []);

  return { products, loading, error, refetch: () => fetchNecklaces() };
}

export function useBracelets() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBracelets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/bracelets");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch bracelets");
        }
      } catch (err) {
        setError("Failed to fetch bracelets");
        console.error("Error fetching bracelets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBracelets();
  }, []);

  return { products, loading, error, refetch: () => fetchBracelets() };
}

export function useRings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/rings");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch rings");
        }
      } catch (err) {
        setError("Failed to fetch rings");
        console.error("Error fetching rings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRings();
  }, []);

  return { products, loading, error, refetch: () => fetchRings() };
}

export function useEarrings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarrings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/earrings");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch earrings");
        }
      } catch (err) {
        setError("Failed to fetch earrings");
        console.error("Error fetching earrings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarrings();
  }, []);

  return { products, loading, error, refetch: () => fetchEarrings() };
}

export function useMens() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMens = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/mens");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch mens products");
        }
      } catch (err) {
        setError("Failed to fetch mens products");
        console.error("Error fetching mens products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMens();
  }, []);

  return { products, loading, error, refetch: () => fetchMens() };
}

export function useFineGold() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFineGold = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/fine-gold");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch fine gold products");
        }
      } catch (err) {
        setError("Failed to fetch fine gold products");
        console.error("Error fetching fine gold products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFineGold();
  }, []);

  return { products, loading, error, refetch: () => fetchFineGold() };
}

export function useFineSilver() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFineSilver = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/fine-silver");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch fine silver products");
        }
      } catch (err) {
        setError("Failed to fetch fine silver products");
        console.error("Error fetching fine silver products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFineSilver();
  }, []);

  return { products, loading, error, refetch: () => fetchFineSilver() };
}

export function useGifts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products/gifts");
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch gifts");
        }
      } catch (err) {
        setError("Failed to fetch gifts");
        console.error("Error fetching gifts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  return { products, loading, error, refetch: () => fetchGifts() };
}

export function useRelatedProducts(productId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/related/${productId}`);
        const data = await response.json();

        if (data.success) {
          const transformedProducts = transformProductsFromBackend(
            data.data.products
          );
          setProducts(transformedProducts);
        } else {
          setError(data.message || "Failed to fetch related products");
        }
      } catch (err) {
        setError("Failed to fetch related products");
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  return { products, loading, error, refetch: () => fetchRelatedProducts() };
}
