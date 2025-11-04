"use client";

import { useEffect, useState } from "react";

export default function ShippingDeliveryPolicyPage() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetch("/api/policies/shipping", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load policy");
        const json = await res.json();
        if (json?.success && json?.data?.content && active) {
          setHtml(json.data.content);
        }
      } catch (e) {
        if (active) setError("Could not load policy.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
          Shipping & Delivery Policy
        </h1>

        {loading ? (
          <p className="text-gray-700">Loading…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : html ? (
          <div
            className="prose max-w-none prose-headings:text-black prose-p:text-gray-700"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-gray-700">No policy content available.</p>
        )}
      </div>
    </div>
  );
}
