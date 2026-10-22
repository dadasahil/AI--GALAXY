export default function ToolLogo({ tool, size = "md" }) {
  const sizeClass = size === "lg" ? "h-16 w-16 rounded-2xl text-lg" : "h-11 w-11 rounded-xl text-sm";

  return (
    <div className={`grid shrink-0 place-items-center overflow-hidden border border-white/10 bg-white text-space-950 shadow-lg shadow-cyan-glow/5 ${sizeClass}`}>
      {tool.logoUrl ? (
        <img
          src={tool.logoUrl}
          alt={`${tool.name} logo`}
          className="h-3/5 w-3/5 object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(event) => {
            if (tool.fallbackLogoUrl && event.currentTarget.src !== tool.fallbackLogoUrl) {
              event.currentTarget.src = tool.fallbackLogoUrl;
            }
          }}
        />
      ) : (
        <span className="font-display font-bold">{tool.name.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
