import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, MapPin, Phone, Search, ShoppingCart, Sparkles, UserRound } from "lucide-react";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import { fetchPublicCatalog } from "../../services/catalog.service.js";
import { addToCart, getCartCount } from "../../services/cart.service.js";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

function ProductRow({ product, onAddToCart }) {
  const isInStock = Number(product.stock || 0) > 0;

  return (
    <article
      className={`flex flex-col gap-4 rounded-[22px] border bg-white px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition sm:flex-row sm:items-center sm:justify-between ${
        isInStock ? "border-slate-200 hover:border-emerald-300" : "border-slate-200 opacity-90"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <ShoppingCart size={22} />
        </div>
        <div>
          <h4 className="text-[1.15rem] font-semibold text-slate-900">{product.name}</h4>
          <p className={`mt-1 text-sm font-medium ${isInStock ? "text-emerald-600" : "text-rose-500"}`}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {product.category} {product.rxRequired ? "• Prescription required" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="text-2xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
        {isInStock ? (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        ) : null}
      </div>
    </article>
  );
}

function PharmacyCard({ vendor, onAddToCart }) {
  return (
    <article className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-slate-950">{vendor.pharmacyName}</h3>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-slate-500">
            <div className="inline-flex items-center gap-2">
              <UserRound size={18} className="text-emerald-500" />
              <span>{vendor.ownerName}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Phone size={18} className="text-emerald-500" />
              <span>{vendor.phone}</span>
            </div>
            <div className="inline-flex items-center gap-2 font-semibold text-emerald-600">
              <MapPin size={18} />
              <span>{vendor.products.length} medicines available</span>
            </div>
          </div>
        </div>

        <div className="inline-flex min-w-[122px] flex-col items-center rounded-[22px] border border-amber-300 bg-amber-50 px-5 py-4 text-slate-950 shadow-[0_10px_24px_rgba(245,158,11,0.15)]">
          <BadgeCheck size={26} className="text-amber-500" />
          <p className="mt-2 text-3xl font-bold">{vendor.products.length}</p>
          <p className="text-sm text-slate-500">Products</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {vendor.products.map((product) => (
          <ProductRow key={product._id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </article>
  );
}

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setError("");
        const data = await fetchPublicCatalog();
        setCatalog(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load pharmacy catalog");
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const filteredCatalog = useMemo(() => {
    const query = appliedSearchTerm.trim().toLowerCase();

    if (!query) {
      return catalog;
    }

    return catalog
      .map((vendor) => ({
        ...vendor,
        products: vendor.products.filter((product) =>
          [product.name, product.category, vendor.pharmacyName, vendor.ownerName]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query)),
        ),
      }))
      .filter((vendor) => vendor.products.length > 0);
  }, [catalog, appliedSearchTerm]);

  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      vendorId: product.vendor?._id || product.vendor,
      vendorName: product.vendor?.pharmacyName || product.vendorName || "Vendor Pharmacy",
      name: product.name,
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
    });
    setCartCount(getCartCount());
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setAppliedSearchTerm(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setAppliedSearchTerm("");
  };

  const totalProducts = filteredCatalog.reduce((count, vendor) => count + vendor.products.length, 0);

  return (
    <div className="min-h-screen bg-[#f4fbf9] text-slate-900">
      <PharmaHeader activePage="home" cartCount={cartCount} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[24px] bg-linear-to-r from-[#06c48d] via-[#08b084] to-[#04986c] p-6 text-white shadow-[0_25px_60px_rgba(6,196,141,0.22)] sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              <Sparkles size={16} />
              Browse verified pharmacies
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Shop medicines from approved vendor pharmacies
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
              Explore real pharmacy listings, view vendor-provided products, and add available medicines directly to your cart.
            </p>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-md">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Search Vendor Medicines</h3>
              <p className="mt-1 text-sm text-slate-500">
                Find products by medicine name, category, or pharmacy
              </p>
            </div>
          </div>

          <form className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center" onSubmit={handleSearchSubmit}>
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-emerald-200 px-4 py-4">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="e.g. Azithromycin, Aspirin, HealthFirst Pharmacy..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:opacity-95"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
            <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {filteredCatalog.length} pharmacies • {totalProducts} products
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-emerald-500" />
            <h3 className="text-3xl font-semibold text-slate-900">Approved Pharmacies</h3>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {filteredCatalog.length}
            </div>
          </div>

          {loading ? (
            <article className="rounded-[24px] bg-white p-8 text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
              <p className="text-lg text-slate-500">Loading pharmacy catalog...</p>
            </article>
          ) : error ? (
            <article className="rounded-[24px] border border-red-200 bg-red-50 p-8 text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
              <p className="text-lg text-red-700">{error}</p>
            </article>
          ) : filteredCatalog.length === 0 ? (
            <article className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="flex min-h-56 flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <MapPin size={24} />
                </div>
                <h4 className="mt-5 text-2xl font-semibold text-slate-900">
                  No vendor products found
                </h4>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Approved pharmacies will appear here once vendors add products to their catalog.
                </p>
              </div>
            </article>
          ) : (
            <div className="space-y-6">
              {filteredCatalog.map((vendor) => (
                <PharmacyCard key={vendor._id} vendor={vendor} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>
      </main>

      <PharmaFooter />
    </div>
  );
}
