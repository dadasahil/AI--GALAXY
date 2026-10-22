import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tools, categories } from "../data/tools";
import { PUBLIC_TOOL_LIMIT } from "../lib/access";
import ToolCard from "../components/ToolCard";

export default function ToolsDirectory() {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") || "All";
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      const matchesPricing = pricing === "All" || t.pricing === pricing;
      const matchesQuery =
        !query ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tagline.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesPricing && matchesQuery;
    });
  }, [activeCategory, pricing, query]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">The full directory</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-star-100 sm:text-4xl">AI Tool Directory</h1>
      <p className="mt-3 max-w-2xl text-sm text-star-500">
        {tools.length} tools across {categories.length} categories. Search, filter, save favorites, or add up to
        four tools to Compare.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-star-500">
        The first {PUBLIC_TOOL_LIMIT} tools are open to everyone. Login unlocks the rest of the directory.
      </p>

      {/* Search + filters */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI tools, e.g. 'video', 'resume', 'coding'…"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-star-100 placeholder:text-star-700 outline-none focus:border-violet-glow lg:max-w-sm"
        />
        <select
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
          className="rounded-xl border border-white/10 bg-space-900 px-4 py-3 text-sm text-star-100 outline-none focus:border-violet-glow"
        >
          {["All", "Free", "Freemium", "Paid"].map((p) => (
            <option key={p} value={p}>{p === "All" ? "All pricing" : p}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryPill label="All" active={activeCategory === "All"} onClick={() => setParams({})} />
        {categories.map((c) => (
          <CategoryPill
            key={c}
            label={c}
            active={activeCategory === c}
            onClick={() => setParams({ category: c })}
          />
        ))}
      </div>

      <p className="mt-6 font-mono text-xs text-star-700">{filtered.length} result{filtered.length !== 1 && "s"}</p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-star-500">
          <p className="text-3xl">🛰️</p>
          <p className="mt-3">No tools match that search. Try a different keyword or clear the filters.</p>
        </div>
      )}
    </div>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-violet-glow bg-violet-glow/15 text-violet-300"
          : "border-white/10 text-star-300 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
