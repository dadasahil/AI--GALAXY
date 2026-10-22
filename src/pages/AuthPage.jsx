import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const isAdminLogin = mode === "admin";
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, profileLoaded, signIn, signInWithGoogle, signUp, resetPassword, authLoading } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (!authLoading && isAuthenticated && (!isAdminLogin || profileLoaded)) {
    if (isAdminLogin) return <Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace />;
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      if (isRegister) {
        await signUp(email, password, name);
        setNotice("Check your inbox and verify your email address before logging in.");
        setPassword("");
        return;
      } else {
        await signIn(email, password, remember);
        if (isAdminLogin) {
          navigate("/admin/dashboard", { replace: true });
          return;
        }
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email first, then request the reset link.");
      return;
    }
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await resetPassword(email);
      setNotice("Password reset email sent. Check your inbox for the secure link.");
    } catch (err) {
      setError(err.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle(`${window.location.origin}${isAdminLogin ? "/admin/dashboard" : from}`);
    } catch (err) {
      setError(err.message || "Could not continue with Google.");
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center px-5 py-14 lg:grid-cols-[1fr_440px] lg:gap-12 lg:px-8">
      <section className="hidden lg:block">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">AI Galaxy account</p>
        <h1 className="mt-3 max-w-xl font-display text-5xl font-bold leading-tight text-star-100">
          Save your AI stack across the whole universe.
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-6 text-star-500">
          Sign in to sync favorites, compare lists, and your personal dashboard through Supabase.
        </p>
      </section>

      <section className="glass rounded-2xl p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">
          {isAdminLogin ? "Admin access" : isRegister ? "Create account" : "Welcome back"}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-star-100">
          {isAdminLogin ? "Admin Login" : isRegister ? "Register" : "Login"}
        </h2>

        <div className="mt-6">
          <button onClick={handleGoogle} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-star-100 transition-colors hover:bg-white/5">
            Continue with Google
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {isRegister && !isAdminLogin && (
            <label className="block">
              <span className="text-xs font-medium text-star-300">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-star-100 outline-none focus:border-cyan-glow"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block">
            <span className="text-xs font-medium text-star-300">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-star-100 outline-none focus:border-cyan-glow"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-star-300">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-star-100 outline-none focus:border-cyan-glow"
              placeholder="At least 6 characters"
            />
          </label>

          {!isRegister && (
            <div className="flex items-center justify-between gap-3 text-xs">
              <label className="inline-flex items-center gap-2 text-star-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                Remember me
              </label>
              <button type="button" onClick={handleForgotPassword} className="font-semibold text-cyan-glow hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {notice && (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {notice}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-glow to-cyan-glow px-5 py-3 text-sm font-semibold text-space-950 shadow-lg shadow-violet-glow/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Working..." : isRegister ? "Create account" : isAdminLogin ? "Enter Admin Panel" : "Login"}
          </button>
        </form>

        {!isAdminLogin && (
          <p className="mt-5 text-center text-sm text-star-500">
            {isRegister ? "Already have an account?" : "New to AI Galaxy?"}{" "}
            <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-cyan-glow hover:underline">
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
