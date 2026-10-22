import { Link } from "react-router-dom";
import { workflows } from "../data/workflows";
import { tools } from "../data/tools";

export default function Workflows() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">Goal-oriented learning paths</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-star-100 sm:text-4xl">AI Workflows</h1>
      <p className="mt-3 max-w-2xl text-sm text-star-500">Pick a destination, follow the order, and use the recommended tools at each stage.</p>

      <div className="mt-10 space-y-6">
        {workflows.map((w) => (
          <div key={w.id} className="glass rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-star-100">{w.title}</h2>
              <div className="flex gap-2 font-mono text-[11px]">
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-star-300">{w.difficulty}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-star-300">{w.estimatedTime}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs">
              {w.steps.map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-star-100">{step}</span>
                  {i < arr.length - 1 && <span className="text-star-700">→</span>}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-star-500">Recommended tools:</span>
              {w.tools.map((name) => {
                const t = tools.find((t) => t.name === name);
                return t ? (
                  <Link key={name} to={`/tools/${t.slug}`} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-cyan-glow hover:border-cyan-glow">
                    {name}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
