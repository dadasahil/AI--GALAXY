import { Link } from "react-router-dom";
import { tools } from "../data/tools";
import { useApp } from "../hooks/useApp";
import ToolLogo from "../components/ToolLogo";

const rows = [
  { key: "category", label: "Category" },
  { key: "pricing", label: "Pricing" },
  { key: "rating", label: "Rating" },
  { key: "whyUse", label: "Best use case" },
  { key: "future", label: "Where it's headed" },
];

export default function Compare() {
  const { compareList, toggleCompare, clearCompare } = useApp();
  const selected = tools.filter((t) => compareList.includes(t.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">Side by side</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-star-100 sm:text-4xl">Compare AI Tools</h1>
        {selected.length > 0 && (
          <button onClick={clearCompare} className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-star-300 hover:bg-white/5">
            Clear all
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-display text-3xl text-cyan-glow">Compare</p>
          <p className="mt-4 text-star-500">
            You have not added any tools yet. Head to the directory and tap <span className="text-star-100">Compare</span> on up to four tools.
          </p>
          <Link to="/tools" className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-6 py-3 text-sm font-semibold text-space-950">
            Browse AI Tools
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40"></th>
                {selected.map((t) => (
                  <th key={t.id} className="glass rounded-t-2xl border-b-0 px-4 py-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <ToolLogo tool={t} />
                        <div>
                          <p className="font-display text-sm font-semibold text-star-100">{t.name}</p>
                          <a href={t.website} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-mono text-[11px] text-cyan-glow hover:underline">
                            Visit site ↗
                          </a>
                        </div>
                      </div>
                      <button onClick={() => toggleCompare(t.id)} className="text-star-700 hover:text-rose-300" aria-label="Remove">×</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key}>
                  <td className="border-t border-white/5 px-2 py-4 font-mono text-xs text-star-500">{row.label}</td>
                  {selected.map((t) => (
                    <td
                      key={t.id}
                      className={`glass border-t-0 px-4 py-4 text-sm text-star-300 ${i === rows.length - 1 ? "rounded-b-2xl" : ""}`}
                    >
                      {row.key === "rating" ? (
                        <span className="text-amber-400">★ {t.rating.toFixed(1)}</span>
                      ) : row.key === "pricing" ? (
                        <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px]">{t.pricing}</span>
                      ) : (
                        t[row.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
