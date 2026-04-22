import React, { useState } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const sliderMin = 0;
  const sliderMax = 100;
  const minThumbGap = 5;
  const rangeStart = ((minPrice - sliderMin) / (sliderMax - sliderMin)) * 100;
  const rangeEnd = ((maxPrice - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <div className="min-h-screen bg-[#f4fbf9] text-slate-900">
      <PharmaHeader activePage="home" />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[24px] bg-linear-to-r from-[#06c48d] via-[#08b084] to-[#04986c] p-6 text-white shadow-[0_25px_60px_rgba(6,196,141,0.22)] sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              <Sparkles size={16} />
              Find medicines nearby
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Find Your Nearest Pharmacy
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
              Search for medicines, compare prices across pharmacies, and order
              from the best deals.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              <MapPin size={16} />
              <span>Enable Location</span>
            </button>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-md">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Search Medicine</h3>
              <p className="mt-1 text-sm text-slate-500">
                Find specific medicines and compare prices
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-emerald-200 px-4 py-4">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="e.g. Azithromycin, Aspirin, Metformin..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-100"
            >
              Search Medicine
            </button>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
          <h3 className="text-xl font-semibold text-slate-900">Filter by Price Range</h3>

          <div className="mt-5 grid gap-4 text-sm text-slate-500 sm:grid-cols-2">
            <p>Minimum Price: ${minPrice}</p>
            <p className="sm:text-right">Maximum Price: ${maxPrice}</p>
          </div>

          <div className="mt-4 space-y-4">
            <div className="relative h-10">
              <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-emerald-100" />
              <div
                className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-linear-to-r from-emerald-400 to-teal-400"
                style={{
                  left: `${rangeStart}%`,
                  width: `${Math.max(rangeEnd - rangeStart, 0)}%`,
                }}
              />
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(
                    Math.min(Number(event.target.value), maxPrice - minThumbGap),
                  )
                }
                className="pointer-events-none absolute left-0 top-1/2 z-20 h-10 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:shadow-md"
              />
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Math.max(Number(event.target.value), minPrice + minThumbGap),
                  )
                }
                className="pointer-events-none absolute left-0 top-1/2 z-10 h-10 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:shadow-md"
              />
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
              Tip: Showing medicines priced between{" "}
              <span className="font-semibold">${minPrice}</span> and{" "}
              <span className="font-semibold">${maxPrice}</span>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-emerald-500" />
            <h3 className="text-3xl font-semibold text-slate-900">Nearby Pharmacies</h3>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              0
            </div>
          </div>

          <article className="rounded-[24px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="flex min-h-56 flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <MapPin size={24} />
              </div>
              <h4 className="mt-5 text-2xl font-semibold text-slate-900">
                No pharmacy is registered
              </h4>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Nearby pharmacy count is currently <span className="font-semibold text-emerald-700">0</span>.
                We will connect the pharmacy listings soon, and registered pharmacies
                will appear here after backend integration.
              </p>
            </div>
          </article>
        </section>
      </main>

      <PharmaFooter />
    </div>
  );
}
