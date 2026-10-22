import { Link } from "react-router-dom";
import { useState } from "react";
import { tools, categories } from "../data/tools";
import ToolCard from "../components/ToolCard";
import { useApp } from "../hooks/useApp";
import { PUBLIC_TOOL_LIMIT } from "../lib/access";

const publicTools = tools.slice(0, PUBLIC_TOOL_LIMIT);

const categoryIcons = {
  "Chatbots & Assistants": "Chat",
  "Coding & Dev Tools": "Code",
  "Image & Design": "Art",
  Video: "Film",
  "Voice & Music": "Audio",
  Writing: "Write",
  Productivity: "Flow",
  Research: "Find",
  "Data & Analytics": "Data",
  "Resume & Career": "Jobs",
  Automation: "Auto",
  "Website Builders": "Web",
  Presentations: "Deck",
  "Agents & Frameworks": "Agent",
};

export default function Landing() {
  const { isAuthenticated, profile, user } = useApp();
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Explorer";
  const displayedTools = isAuthenticated ? tools : publicTools;

  return (
    <div>
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 text-center lg:px-8 lg:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-star-300">
          ✦ {tools.length}+ AI tools mapped across {categories.length} categories
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-star-100 sm:text-5xl lg:text-6xl">
          Your Personal Guide to the <span className="text-gradient">AI Universe</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-star-500 sm:text-lg">
          Discover, compare, learn, and build with AI - one map of the whole galaxy, instead of a hundred open tabs.
        </p>
        <div className="mx-auto mt-6 max-w-2xl">
          {isAuthenticated ? (
            <div className="glass rounded-2xl px-5 py-4 text-left sm:text-center">
              <p className="font-display text-xl font-bold text-star-100">Hello, {displayName}</p>
              <p className="mt-1 text-sm text-star-500">
                Welcome back. Your AI tools, comparisons, and saved favorites are ready.
              </p>
            </div>
          ) : (
            <div className="glass rounded-2xl px-5 py-4 text-left sm:text-center">
              <p className="font-display text-xl font-bold text-star-100">Start with 10 free AI tools</p>
              <p className="mt-1 text-sm text-star-500">
                Explore the first 10 tools without an account. Login unlocks the full directory, compare tools, and saved favorites.
              </p>
              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/tools" className="rounded-xl bg-gradient-to-r from-violet-glow to-cyan-glow px-5 py-3 text-center text-sm font-semibold text-space-950">
                  Explore free tools
                </Link>
                <Link to="/register" state={{ from: { pathname: "/tools" } }} className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold text-star-100 hover:bg-white/5">
                  Unlock all tools
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/tools"
            className="w-full rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-7 py-3 text-sm font-semibold text-space-950 shadow-lg shadow-violet-glow/25 transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Explore AI Tools
          </Link>
          <ProtectedHomeLink
            to="/quiz"
            isAuthenticated={isAuthenticated}
            onLocked={() => setShowLoginRequired(true)}
            className="w-full rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-star-100 transition-colors hover:border-white/30 hover:bg-white/5 sm:w-auto"
          >
            Find the Best AI for Me
          </ProtectedHomeLink>
        </div>
      </section>

      <SectionHeader
        eyebrow={isAuthenticated ? "Full access" : "Free preview"}
        title={isAuthenticated ? "All 113 AI Tools" : "10 AI Tools You Can Use Now"}
      />
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayedTools.map((t) => <ToolCard key={t.id} tool={t} />)}
        </div>
      </section>

      <SectionHeader eyebrow="Browse by discipline" title="Popular Categories" />
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <ProtectedHomeLink
              key={c}
              to={`/tools?category=${encodeURIComponent(c)}`}
              isAuthenticated={isAuthenticated}
              onLocked={() => setShowLoginRequired(true)}
              className="glow-border rounded-2xl glass p-5 transition-transform hover:-translate-y-1"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-cyan-glow">{categoryIcons[c] || "AI"}</div>
              <h3 className="mt-3 font-display text-sm font-semibold text-star-100">{c}</h3>
              <p className="mt-1 font-mono text-xs text-star-500">
                {tools.filter((t) => t.category === c).length} tools
              </p>
            </ProtectedHomeLink>
          ))}
        </div>
      </section>

      <SectionHeader eyebrow="From zero to hired" title="Featured Workflow" />
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-star-100">Become a Data Analyst</h3>
              <p className="mt-1 text-sm text-star-500">A guided path from spreadsheets to your first analytics role.</p>
            </div>
            <ProtectedHomeLink to="/workflows" isAuthenticated={isAuthenticated} onLocked={() => setShowLoginRequired(true)} className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-star-100 hover:bg-white/5">
              View all workflows →
            </ProtectedHomeLink>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs">
            {["Excel", "SQL", "Power BI", "Python", "Kaggle", "Projects", "Interview Prep"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-star-100">{step}</span>
                {i < arr.length - 1 && <span className="text-star-700">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>
      {showLoginRequired && <LoginRequiredModal onClose={() => setShowLoginRequired(false)} />}
    </div>
  );
}

function ProtectedHomeLink({ to, isAuthenticated, onLocked, className, children }) {
  if (isAuthenticated) return <Link to={to} className={className}>{children}</Link>;
  return <button type="button" onClick={onLocked} className={className}>{children}</button>;
}

function LoginRequiredModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-space-950/80 px-5 backdrop-blur-xl">
      <section className="glass max-w-md rounded-2xl p-7 text-center shadow-2xl shadow-violet-glow/20">
        <p className="text-4xl" aria-hidden="true">Lock</p>
        <h2 className="mt-4 font-display text-2xl font-bold text-star-100">Login Required</h2>
        <p className="mt-3 text-sm leading-6 text-star-500">
          Please login or create an account to explore 100+ AI tools, compare tools, save favorites, and access exclusive features.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link to="/login" state={{ from: { pathname: "/tools" } }} className="rounded-xl bg-gradient-to-r from-violet-glow to-cyan-glow px-5 py-3 text-sm font-semibold text-space-950">
            Login
          </Link>
          <Link to="/register" state={{ from: { pathname: "/tools" } }} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-star-100 hover:bg-white/5">
            Register
          </Link>
        </div>
        <button onClick={onClose} className="mt-5 text-xs font-semibold text-star-500 hover:text-star-100">
          Close
        </button>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="mx-auto mt-20 max-w-7xl px-5 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-star-100 sm:text-3xl">{title}</h2>
      <div className="mt-6" />
    </div>
  );
}
