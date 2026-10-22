import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { canAccessTool } from "../lib/access";
import ToolLogo from "./ToolLogo";

const pricingStyle = {
  Free: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  Freemium: "bg-cyan-glow/10 text-cyan-glow border-cyan-glow/20",
  Paid: "bg-violet-glow/10 text-violet-300 border-violet-glow/20",
};

export default function ToolCard({ tool }) {
  const { saved, toggleSave, compareList, toggleCompare, isAuthenticated } = useApp();
  const isSaved = saved.includes(tool.id);
  const isComparing = compareList.includes(tool.id);
  const isLocked = !canAccessTool(tool, isAuthenticated);
  const detailPath = isLocked ? "/login" : `/tools/${tool.slug}`;
  const loginState = isLocked ? { from: { pathname: `/tools/${tool.slug}` } } : undefined;

  return (
    <div className="glow-border group flex flex-col rounded-2xl glass p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <Link to={detailPath} state={loginState} className="flex min-w-0 items-center gap-3">
          <ToolLogo tool={tool} />
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold leading-tight text-star-100 group-hover:text-white">
              {tool.name}
            </h3>
            <p className="truncate font-mono text-xs text-star-500">{tool.category}</p>
          </div>
        </Link>
        <button
          onClick={() => (isLocked ? undefined : toggleSave(tool.id))}
          aria-label={isSaved ? "Remove from saved" : "Save tool"}
          disabled={isLocked}
          className={`text-lg transition-colors ${isSaved ? "text-cyan-glow" : "text-star-700 hover:text-star-300"}`}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-star-500">{tool.tagline}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${pricingStyle[tool.pricing]}`}>
          {tool.pricing}
        </span>
        <span className="flex items-center gap-1 text-xs text-star-300">
          <span className="text-amber-400">★</span> {tool.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {isLocked ? (
          <Link
            to="/login"
            state={loginState}
            className="flex-1 rounded-lg bg-gradient-to-r from-violet-glow to-cyan-glow px-3 py-2 text-center text-xs font-semibold text-space-950 transition-transform hover:scale-[1.02]"
          >
            Login to unlock
          </Link>
        ) : (
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-gradient-to-r from-violet-glow to-cyan-glow px-3 py-2 text-center text-xs font-semibold text-space-950 transition-transform hover:scale-[1.02]"
          >
            Visit site ↗
          </a>
        )}
        <button
          onClick={() => (isLocked ? undefined : toggleCompare(tool.id))}
          disabled={isLocked}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            isComparing
              ? "border-violet-glow bg-violet-glow/15 text-violet-300"
              : "border-white/10 text-star-300 hover:border-white/25 hover:text-white"
          }`}
        >
          {isComparing ? "Added" : "Compare"}
        </button>
      </div>
    </div>
  );
}
