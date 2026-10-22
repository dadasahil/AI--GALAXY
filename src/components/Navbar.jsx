import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";

const links = [
  { to: "/tools", label: "Explore Tools" },
  { to: "/compare", label: "Compare" },
  { to: "/quiz", label: "Find My AI" },
  { to: "/workflows", label: "Workflows" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, signOut, authLoading } = useApp();
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/tools", label: "Explore Tools" },
    { to: "/#about", label: "About" },
    { to: "/#pricing", label: "Pricing" },
    { to: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-space-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="text-xl" aria-hidden="true">✦</span>
          <span>AI <span className="text-gradient">Galaxy</span></span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {isAuthenticated
            ? links.map((l) => <NavItem key={l.to} to={l.to} label={l.label} />)
            : publicLinks.map((l) => <NavItem key={l.to} to={l.to} label={l.label} />)}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-40 truncate font-mono text-xs text-star-500">{user.email}</span>
              {isAdmin && (
                <NavLink to="/admin/dashboard" className="rounded-full border border-cyan-glow/30 px-4 py-2 text-sm font-semibold text-cyan-glow hover:bg-cyan-glow/10">
                  Admin
                </NavLink>
              )}
              <button
                onClick={signOut}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-star-300 transition-colors hover:border-white/25 hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-star-300 transition-colors hover:text-white">
                Log in
              </NavLink>
              <NavLink to="/register" className="rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-4 py-2 text-sm font-semibold text-space-950 shadow-lg shadow-violet-glow/20 transition-transform hover:scale-[1.03]">
                Sign up free
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="grid h-9 min-w-14 place-items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-star-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/5 px-5 pb-4 pt-2 lg:hidden">
          {links.map((l) => (
            isAuthenticated ? (
              <NavItem key={l.to} to={l.to} label={l.label} onClick={() => setOpen(false)} mobile />
            ) : null
          ))}
          {!isAuthenticated && publicLinks.map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} onClick={() => setOpen(false)} mobile />
          ))}
          <div className="mt-3 grid gap-2 border-t border-white/5 pt-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="w-full rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-star-100"
              >
                Sign out
              </button>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className="w-full rounded-full border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-star-100">
                  Log in
                </NavLink>
                <NavLink to="/register" onClick={() => setOpen(false)} className="w-full rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-4 py-2.5 text-center text-sm font-semibold text-space-950">
                  Sign up free
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
      {authLoading && <div className="h-px bg-cyan-glow/50" />}
      {loginModal && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-space-950/80 px-5 backdrop-blur-xl">
          <section className="glass max-w-md rounded-2xl p-7 text-center shadow-2xl shadow-violet-glow/20">
            <p className="text-4xl" aria-hidden="true">Lock</p>
            <h2 className="mt-4 font-display text-2xl font-bold text-star-100">Login Required</h2>
            <p className="mt-3 text-sm leading-6 text-star-500">
              Please login or create an account to explore 100+ AI tools, compare tools, save favorites, and access exclusive features.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => navigate("/login")} className="rounded-xl bg-gradient-to-r from-violet-glow to-cyan-glow px-5 py-3 text-sm font-semibold text-space-950">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-star-100 hover:bg-white/5">
                Register
              </button>
            </div>
            <button onClick={() => setLoginModal(false)} className="mt-5 text-xs font-semibold text-star-500 hover:text-star-100">
              Close
            </button>
          </section>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, label, onClick, mobile = false }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${mobile ? "block rounded-lg px-3 py-2.5" : "rounded-full px-3.5 py-2"} text-sm font-medium transition-colors ${
          isActive ? "bg-white/8 text-white" : "text-star-300 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
