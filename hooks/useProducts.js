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

