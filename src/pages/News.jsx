const news = [
  { tag: "Models", title: "Frontier labs keep shrinking the cost of top-tier reasoning models", blurb: "Efficient training techniques are closing the gap between flagship and open-weight models faster than expected." },
  { tag: "Companies", title: "AI coding agents move from autocomplete to autonomous tickets", blurb: "Editors and agents increasingly plan, execute, and test multi-file changes with only light human review." },
  { tag: "Launches", title: "Video generation quality crosses into short-form production use", blurb: "Longer clip lengths and better motion consistency are making generated video viable for real marketing content." },
  { tag: "Industry", title: "Enterprises formalize AI governance as agentic tools spread", blurb: "Companies are writing policies for what autonomous agents can access and act on without a human in the loop." },
];

export default function News() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">Signal, not noise</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-star-100 sm:text-4xl">AI News</h1>
      <p className="mt-3 text-sm text-star-500">A snapshot of the themes shaping AI right now. Wire this page to a live news API for real-time updates.</p>

      <div className="mt-10 space-y-5">
        {news.map((n) => (
          <div key={n.title} className="glass rounded-2xl p-6">
            <span className="font-mono text-[11px] text-cyan-glow">{n.tag}</span>
            <h2 className="mt-1 font-display text-lg font-semibold text-star-100">{n.title}</h2>
            <p className="mt-2 text-sm text-star-500">{n.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
