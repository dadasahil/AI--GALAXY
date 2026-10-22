import { Link, Navigate, useParams } from "react-router-dom";
import { tools } from "../data/tools";
import { useApp } from "../hooks/useApp";
import { canAccessTool } from "../lib/access";
import ToolCard from "../components/ToolCard";
import ToolLogo from "../components/ToolLogo";

export default function ToolDetail() {
  const { slug } = useParams();
  const tool = tools.find((t) => t.slug === slug);
  const { saved, toggleSave, isAuthenticated } = useApp();

  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-3xl">✦</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Tool not found</h1>
        <p className="mt-2 text-star-500">It may have drifted out of the galaxy.</p>
        <Link to="/tools" className="mt-6 inline-block rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5">
          ← Back to directory
        </Link>
      </div>
    );
  }

  if (!canAccessTool(tool, isAuthenticated)) {
    return <Navigate to="/login" replace state={{ from: { pathname: `/tools/${tool.slug}` } }} />;
  }

  const alternatives = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);
  const isSaved = saved.includes(tool.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <Link to="/tools" className="font-mono text-xs text-star-500 hover:text-star-100">← Back to directory</Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <ToolLogo tool={tool} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-bold text-star-100 sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 font-mono text-xs text-star-500">{tool.category}</p>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="text-amber-400">★ {tool.rating.toFixed(1)}</span>
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-star-300">{tool.pricing}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleSave(tool.id)}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium ${
              isSaved ? "border-cyan-glow text-cyan-glow" : "border-white/15 text-star-100 hover:bg-white/5"
            }`}
          >
            {isSaved ? "★ Saved" : "☆ Save"}
          </button>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-5 py-2.5 text-sm font-semibold text-space-950 transition-transform hover:scale-[1.03]"
          >
            Visit official site ↗
          </a>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-lg text-star-300">{tool.tagline}</p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <InfoCard title="What it is" label="Orbit" text={tool.description} />
        <InfoCard title="Why you should use it" label="Use" text={tool.whyUse} />
        <InfoCard title="Where it's headed" label="Next" text={tool.future} />
        <InfoCard title="Pros & cons" label="Tradeoffs" custom>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 text-emerald-300"><span>+</span> Purpose-built for {tool.category.toLowerCase()}</li>
            <li className="flex gap-2 text-emerald-300"><span>+</span> Actively developed with frequent updates</li>
            <li className="flex gap-2 text-rose-300"><span>-</span> {tool.pricing === "Paid" ? "No free tier for full features" : "Advanced features gated behind a paid plan"}</li>
            <li className="flex gap-2 text-rose-300"><span>-</span> Output quality still benefits from human review</li>
          </ul>
        </InfoCard>
      </div>

      {alternatives.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-star-100">Alternatives in {tool.category}</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {alternatives.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, label, text, children, custom }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-star-100">
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-glow">{label}</span> {title}
      </h3>
      {custom ? (
        <div className="mt-3">{children}</div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-star-500">{text}</p>
      )}
    </div>
  );
}
