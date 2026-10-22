import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="font-display text-4xl text-cyan-glow">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-star-100">Lost in the AI Galaxy</h1>
      <p className="mt-2 text-star-500">This page does not exist. Let us get you back on course.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-6 py-3 text-sm font-semibold text-space-950">
        Back to Home
      </Link>
    </div>
  );
}
