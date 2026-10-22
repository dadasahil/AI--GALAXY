import { useMemo, useState } from "react";
import { useApp } from "../hooks/useApp";
import { categories, tools } from "../data/tools";

const nav = [
  ["Dashboard", "Home"],
  ["AI Tools", "Bot"],
  ["Categories", "Folder"],
  ["News", "News"],
  ["Users", "Users"],
  ["Featured Tools", "Star"],
  ["Analytics", "Chart"],
  ["Settings", "Gear"],
];

const seedUsers = [
  { id: 1, name: "Aarav Mehta", email: "aarav@aigalaxy.dev", date: "2026-07-31", role: "user", status: "active" },
  { id: 2, name: "Mira Shah", email: "mira@studio.ai", date: "2026-07-30", role: "admin", status: "active" },
  { id: 3, name: "Neel Rao", email: "neel@builder.io", date: "2026-07-29", role: "user", status: "suspended" },
  { id: 4, name: "Isha Kapoor", email: "isha@workflow.co", date: "2026-07-31", role: "user", status: "active" },
];

const submittedTools = tools.slice(0, 12).map((tool, index) => ({
  ...tool,
  tags: [tool.category.split(" ")[0], tool.pricing, index % 2 ? "Growth" : "Ops"],
  status: index % 3 === 0 ? "Pending" : "Approved",
  featured: index % 4 === 0,
  views: 9800 - index * 421,
}));

export default function AdminPanel() {
  const { profile, user, signOut } = useApp();
  const [section, setSection] = useState("Dashboard");
  const [toolRows, setToolRows] = useState(submittedTools);
  const [userRows, setUserRows] = useState(seedUsers);
  const [toolQuery, setToolQuery] = useState("");
  const [toolStatus, setToolStatus] = useState("All");
  const [userQuery, setUserQuery] = useState("");
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState("");

  const filteredTools = useMemo(() => {
    return toolRows.filter((tool) => {
      const q = toolQuery.toLowerCase();
      const matchesQuery = !q || [tool.name, tool.category, tool.pricing, tool.description].join(" ").toLowerCase().includes(q);
      const matchesStatus = toolStatus === "All" || tool.status === toolStatus;
      return matchesQuery && matchesStatus;
    });
  }, [toolRows, toolQuery, toolStatus]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.toLowerCase();
    return userRows.filter((row) => !q || [row.name, row.email, row.role, row.status].join(" ").toLowerCase().includes(q));
  }, [userRows, userQuery]);

  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function updateTool(id, updates, message) {
    setToolRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...updates } : row)));
    flash(message);
  }

  function updateUser(id, updates, message) {
    setUserRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...updates } : row)));
    flash(message);
  }

  const stats = [
    ["Total Users", userRows.length, "+12%"],
    ["Registered Today", userRows.filter((row) => row.date === "2026-07-31").length, "Live"],
    ["Total AI Tools", toolRows.length, "+8"],
    ["Most Viewed Tool", toolRows[0]?.name ?? "None", "9.8k"],
    ["Total Categories", categories.length, "Indexed"],
    ["Today's Visits", "18,420", "+21%"],
    ["Recent Registrations", userRows.slice(0, 3).map((row) => row.name).join(", "), "3 new"],
    ["Latest Submitted Tools", toolRows.slice(0, 2).map((row) => row.name).join(", "), "Pending review"],
  ];

  return (
    <div className={`min-h-screen ${dark ? "bg-space-950" : "bg-slate-100 text-slate-950"}`}>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%)]" />
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="glass sticky top-6 h-fit rounded-2xl p-4">
          <div className="px-3 py-2">
            <p className="font-display text-xl font-bold text-star-100">AI Galaxy</p>
            <p className="mt-1 font-mono text-xs text-cyan-glow">Admin Console</p>
          </div>
          <nav className="mt-5 space-y-1">
            {nav.map(([label, icon]) => (
              <button
                key={label}
                onClick={() => setSection(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                  section === label ? "bg-white/12 text-white shadow-lg shadow-cyan-glow/10" : "text-star-300 hover:bg-white/6 hover:text-white"
                }`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/8 font-mono text-[10px] text-cyan-glow">{icon}</span>
                {label}
              </button>
            ))}
            <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-200 hover:bg-rose-400/10">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-400/10 font-mono text-[10px]">Exit</span>
              Logout
            </button>
          </nav>
        </aside>

        <main>
          <header className="glass sticky top-6 z-20 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">Enterprise secure workspace</p>
              <h1 className="font-display text-2xl font-bold text-star-100">{section}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-star-100 outline-none focus:border-cyan-glow" placeholder="Search admin..." />
              <button className="rounded-xl border border-white/10 px-3 py-2 text-sm text-star-100 hover:bg-white/5">Notifications</button>
              <button onClick={() => setDark((value) => !value)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-star-100 hover:bg-white/5">
                {dark ? "Dark" : "Light"}
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <img src={profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile?.full_name || user?.email || "Admin")}`} className="h-8 w-8 rounded-full" alt="" />
                <span className="max-w-32 truncate text-xs font-semibold text-star-100">{profile?.full_name || user?.email}</span>
              </div>
            </div>
          </header>

          {toast && <div className="fixed right-5 top-5 z-50 rounded-xl border border-emerald-400/20 bg-emerald-400/15 px-4 py-3 text-sm text-emerald-100 shadow-xl">{toast}</div>}

          <section className="mt-6">
            {section === "Dashboard" && <DashboardView stats={stats} users={userRows} tools={toolRows} />}
            {section === "AI Tools" && <ToolsManager tools={filteredTools} query={toolQuery} setQuery={setToolQuery} status={toolStatus} setStatus={setToolStatus} updateTool={updateTool} deleteTool={(id) => { setToolRows((rows) => rows.filter((row) => row.id !== id)); flash("Tool deleted."); }} />}
            {section === "Users" && <UsersManager users={filteredUsers} query={userQuery} setQuery={setUserQuery} updateUser={updateUser} deleteUser={(id) => { setUserRows((rows) => rows.filter((row) => row.id !== id)); flash("User deleted."); }} />}
            {section === "Analytics" && <AnalyticsView tools={toolRows} />}
            {section === "Settings" && <SettingsView />}
            {!["Dashboard", "AI Tools", "Users", "Analytics", "Settings"].includes(section) && <PlaceholderView title={section} tools={toolRows} />}
          </section>
        </main>
      </div>
    </div>
  );
}

function DashboardView({ stats, users, tools }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, hint]) => <StatCard key={label} label={label} value={value} hint={hint} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent Registrations">
          <DataList rows={users.slice(0, 4).map((user) => [user.name, user.email, user.role, user.status])} />
        </Panel>
        <Panel title="Latest Submitted Tools">
          <DataList rows={tools.slice(0, 4).map((tool) => [tool.name, tool.category, tool.pricing, tool.status])} />
        </Panel>
      </div>
    </div>
  );
}

function ToolsManager({ tools, query, setQuery, status, setStatus, updateTool, deleteTool }) {
  return (
    <Panel title="AI Tools Management" action={<button className="rounded-xl bg-cyan-glow px-4 py-2 text-sm font-bold text-space-950">Add Tool</button>}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-glow" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-white/10 bg-space-900 px-4 py-3 text-sm text-star-100 outline-none">
          {["All", "Pending", "Approved"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase text-star-500"><tr>{["Tool Name", "Logo", "Website", "Description", "Category", "Pricing", "Tags", "Featured", "Status", "Actions"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-white/5">
            {tools.map((tool) => (
              <tr key={tool.id} className="text-star-300">
                <td className="px-3 py-4 font-semibold text-star-100">{tool.name}</td>
                <td className="px-3 py-4"><img src={tool.logoUrl} className="h-9 w-9 rounded-xl bg-white p-1" alt="" /></td>
                <td className="px-3 py-4"><a href={tool.website} className="text-cyan-glow" target="_blank" rel="noreferrer">Open</a></td>
                <td className="max-w-xs px-3 py-4 text-xs">{tool.tagline}</td>
                <td className="px-3 py-4">{tool.category}</td>
                <td className="px-3 py-4">{tool.pricing}</td>
                <td className="px-3 py-4">{tool.tags.join(", ")}</td>
                <td className="px-3 py-4">{tool.featured ? "Yes" : "No"}</td>
                <td className="px-3 py-4"><Badge tone={tool.status === "Approved" ? "green" : "amber"}>{tool.status}</Badge></td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateTool(tool.id, { status: "Approved" }, "Tool approved.")} className="mini-btn">Approve</button>
                    <button onClick={() => updateTool(tool.id, { featured: !tool.featured }, "Featured status updated.")} className="mini-btn">Feature</button>
                    <button onClick={() => updateTool(tool.id, { status: "Pending" }, "Tool moved to edit queue.")} className="mini-btn">Edit</button>
                    <button onClick={() => deleteTool(tool.id)} className="mini-btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function UsersManager({ users, query, setQuery, updateUser, deleteUser }) {
  return (
    <Panel title="User Management">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-glow" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-star-500"><tr>{["Name", "Email", "Registration Date", "Role", "Status", "Actions"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-white/5">
            {users.map((row) => (
              <tr key={row.id} className="text-star-300">
                <td className="px-3 py-4 font-semibold text-star-100">{row.name}</td>
                <td className="px-3 py-4">{row.email}</td>
                <td className="px-3 py-4">{row.date}</td>
                <td className="px-3 py-4"><Badge tone={row.role === "admin" ? "cyan" : "slate"}>{row.role}</Badge></td>
                <td className="px-3 py-4"><Badge tone={row.status === "active" ? "green" : "rose"}>{row.status}</Badge></td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateUser(row.id, { status: row.status === "active" ? "suspended" : "active" }, "User status updated.")} className="mini-btn">Suspend</button>
                    <button onClick={() => updateUser(row.id, { role: row.role === "admin" ? "user" : "admin" }, "User role updated.")} className="mini-btn">Change Role</button>
                    <button onClick={() => deleteUser(row.id)} className="mini-btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AnalyticsView({ tools }) {
  const bars = [58, 72, 64, 88, 93, 81, 99];
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {["Daily Visitors", "Monthly Visitors", "User Registrations", "Popular Categories", "Most Viewed AI Tools", "Traffic Sources"].map((title, index) => (
        <Panel key={title} title={title}>
          <div className="flex h-48 items-end gap-3">
            {bars.map((height, bar) => (
              <div key={bar} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-violet-glow to-cyan-glow" style={{ height: `${Math.max(20, height - index * 5)}%` }} />
                <span className="font-mono text-[10px] text-star-700">{bar + 1}</span>
              </div>
            ))}
          </div>
          {index === 4 && <p className="mt-4 text-sm text-star-500">Top performer: {tools[0]?.name}</p>}
        </Panel>
      ))}
    </div>
  );
}

function SettingsView() {
  const fields = ["Website Name", "Logo", "Footer", "Social Links", "SMTP Email", "API Keys"];
  return (
    <Panel title="Settings">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="block">
            <span className="text-xs font-semibold text-star-300">{field}</span>
            <input className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-glow" placeholder={field} />
          </label>
        ))}
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-star-100">
          Maintenance Mode
          <input type="checkbox" className="h-5 w-5" />
        </label>
      </div>
    </Panel>
  );
}

function PlaceholderView({ title, tools }) {
  return (
    <Panel title={title}>
      <DataList rows={tools.slice(0, 6).map((tool) => [tool.name, tool.category, tool.pricing, tool.featured ? "Featured" : "Standard"])} />
    </Panel>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <article className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1">
      <p className="font-mono text-xs uppercase tracking-widest text-star-500">{label}</p>
      <p className="mt-3 truncate font-display text-2xl font-bold text-star-100">{value}</p>
      <p className="mt-2 text-xs text-cyan-glow">{hint}</p>
    </article>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-star-100">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function DataList({ rows }) {
  return (
    <div className="divide-y divide-white/5">
      {rows.map((row) => (
        <div key={row.join("-")} className="grid gap-2 py-3 text-sm text-star-300 sm:grid-cols-4">
          {row.map((cell) => <span key={cell} className="truncate">{cell}</span>)}
        </div>
      ))}
    </div>
  );
}

function Badge({ tone, children }) {
  const tones = {
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    cyan: "border-cyan-glow/20 bg-cyan-glow/10 text-cyan-glow",
    slate: "border-white/10 bg-white/5 text-star-300",
  };
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
