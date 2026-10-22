import { Link } from "react-router-dom";
import { tools } from "../data/tools";
import { useApp } from "../hooks/useApp";
import ToolCard from "../components/ToolCard";

export default function Dashboard() {
  const { saved, compareList, user } = useApp();
  const savedTools = tools.filter((t) => saved.includes(t.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">Your mission control</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-star-100 sm:text-4xl">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm text-star-500">
        {user ? `Signed in as ${user.email}. Favorites and comparisons sync with Supabase.` : "Sign in to sync your favorites and comparisons across devices."}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Saved tools" value={savedTools.length} />
        <Stat label="In compare" value={compareList.length} />
        <Stat label="Tools available" value={tools.length} />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-star-100">Saved AI tools</h2>
          <Link to="/tools" className="font-mono text-xs text-cyan-glow hover:underline">Browse more →</Link>
        </div>
        {savedTools.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {savedTools.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        ) : (
          <EmptyState text="You have not saved any tools yet. Tap the star on any tool card to save it here." />
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="glass rounded-2xl p-5 text-center">
      <p className="font-display text-3xl font-bold text-gradient">{value}</p>
      <p className="mt-1 font-mono text-xs text-star-500">{label}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="mt-5 glass rounded-2xl p-8 text-center text-sm text-star-500">
      {text}
    </div>
  );
}
