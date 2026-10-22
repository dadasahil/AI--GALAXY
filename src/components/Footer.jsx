export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <span aria-hidden="true">✦</span> AI <span className="text-gradient">Galaxy</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-star-500">
              Your personal guide to the AI universe - discover, compare, learn, and build.
            </p>
          </div>
          <FooterCol title="Explore" items={["AI Tool Directory", "Compare Tools", "Find My AI Quiz", "AI News"]} />
          <FooterCol title="Career" items={["Resume Builder", "ATS Analyzer", "Career Roadmaps", "Interview Prep"]} />
          <FooterCol title="Learn" items={["Prompt Library", "Learning Hub", "AI Workflows", "Courses"]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-star-700 sm:flex-row">
          <p>© {new Date().getFullYear()} AI Galaxy. All tool names and logos belong to their respective owners.</p>
          <p className="font-mono">Built with React · Tailwind · deep space</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-star-100">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-star-500">
        {items.map((i) => (
          <li key={i} className="cursor-pointer transition-colors hover:text-star-100">{i}</li>
        ))}
      </ul>
    </div>
  );
}
