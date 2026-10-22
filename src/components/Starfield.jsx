import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function makeStar(width, height, layer) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: rand(0.18, layer === 3 ? 1.45 : 1),
    alpha: rand(0.18, 0.82),
    phase: Math.random() * TAU,
    twinkle: rand(0.006, 0.022),
    drift: rand(0.006, 0.028) * layer,
    layer,
    color: Math.random() > 0.86 ? "#67e8f9" : Math.random() > 0.76 ? "#c4b5fd" : "#f8fbff",
  };
}

function makeMeteor(width, height) {
  return {
    x: rand(-width * 0.25, width * 1.1),
    y: rand(-height * 0.45, height * 0.22),
    length: rand(100, 280),
    speed: rand(4.8, 9.6),
    angle: rand(0.58, 0.82),
    wait: rand(20, 360),
    width: rand(0.9, 2),
    color: Math.random() > 0.46 ? "#22d3ee" : "#a78bfa",
  };
}

function makeDust(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: rand(0.25, 1.3),
    alpha: rand(0.035, 0.16),
    phase: Math.random() * TAU,
    vx: rand(-0.018, 0.018),
    vy: rand(0.004, 0.032),
  };
}

function makePlanet(width, height, index) {
  const base = Math.min(width, height);
  const presets = [
    { x: 0.82, y: 0.25, r: 0.062, a: "#7dd3fc", b: "#172554", glow: "rgba(34,211,238,0.28)" },
    { x: 0.15, y: 0.72, r: 0.047, a: "#f0abfc", b: "#3b0764", glow: "rgba(217,70,239,0.24)" },
    { x: 0.72, y: 0.74, r: 0.029, a: "#c4b5fd", b: "#1e1b4b", glow: "rgba(139,92,246,0.22)" },
  ];
  const p = presets[index];
  return {
    ...p,
    x: width * p.x,
    y: height * p.y,
    r: Math.max(18, base * p.r),
    phase: Math.random() * TAU,
    speed: rand(0.018, 0.042),
    depth: rand(0.05, 0.14),
  };
}

function makeRock(width, height) {
  const size = rand(1.7, 5.8);
  return {
    x: rand(-30, width + 30),
    y: rand(-30, height + 30),
    size,
    vx: rand(-0.035, 0.035),
    vy: rand(-0.02, 0.03),
    angle: Math.random() * TAU,
    spin: rand(-0.004, 0.004),
    alpha: rand(0.1, 0.28),
    points: Array.from({ length: 7 }, () => rand(size * 0.55, size * 1.18)),
  };
}

function radial(ctx, x, y, radius, stops) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  stops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function drawPlanet(ctx, planet, time, px, py) {
  const x = planet.x + px * planet.depth;
  const y = planet.y + py * planet.depth + Math.sin(time * planet.speed + planet.phase) * 7;
  const r = planet.r;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * planet.speed * 0.45);

  radial(ctx, 0, 0, r * 2.45, [
    [0, planet.glow],
    [0.48, "rgba(124,58,237,0.06)"],
    [1, "rgba(0,0,0,0)"],
  ]);

  ctx.shadowColor = planet.a;
  ctx.shadowBlur = r * 0.34;
  const body = ctx.createRadialGradient(-r * 0.38, -r * 0.42, 2, 0, 0, r);
  body.addColorStop(0, "#ffffff");
  body.addColorStop(0.13, planet.a);
  body.addColorStop(0.62, planet.b);
  body.addColorStop(1, "#020617");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(1, r * 0.03);
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, i * r * 0.16, r * 0.78, r * 0.055, i * 0.02, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRock(ctx, rock, width, height, reduceMotion) {
  ctx.save();
  ctx.translate(rock.x, rock.y);
  ctx.rotate(rock.angle);
  ctx.globalAlpha = rock.alpha;
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  rock.points.forEach((radius, index) => {
    const angle = (index / rock.points.length) * TAU;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;

  if (!reduceMotion) {
    rock.x += rock.vx;
    rock.y += rock.vy;
    rock.angle += rock.spin;
    if (rock.x < -30) rock.x = width + 30;
    if (rock.x > width + 30) rock.x = -30;
    if (rock.y < -30) rock.y = height + 30;
    if (rock.y > height + 30) rock.y = -30;
  }
}

function drawGalaxy(ctx, width, height, time, px, py) {
  const x = width * 0.52 + px * 0.06;
  const y = height * 0.42 + py * 0.05;
  const r = Math.min(width, height) * 0.18;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.38 + time * 0.012);
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.34;
  for (let arm = 0; arm < 4; arm += 1) {
    ctx.strokeStyle = arm % 2 ? "rgba(34,211,238,0.22)" : "rgba(167,139,250,0.24)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let a = 0; a < TAU * 1.35; a += 0.11) {
      const radius = r * (a / (TAU * 1.35));
      const angle = a + arm * (TAU / 4);
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * radius * 0.34;
      if (a === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }
  radial(ctx, 0, 0, r * 0.28, [
    [0, "rgba(255,255,255,0.42)"],
    [0.4, "rgba(34,211,238,0.16)"],
    [1, "rgba(0,0,0,0)"],
  ]);
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let width = 0;
    let height = 0;
    let raf;
    let stars = [];
    let meteors = [];
    let dust = [];
    let planets = [];
    let rocks = [];
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const starCount = Math.min(2600, Math.max(950, Math.floor(area * 0.00155)));
      stars = Array.from({ length: starCount }, (_, index) => {
        const layer = index > starCount * 0.72 ? 3 : index > starCount * 0.38 ? 2 : 1;
        return makeStar(width, height, layer);
      });
      meteors = Array.from({ length: Math.max(7, Math.floor(width / 170)) }, () => makeMeteor(width, height));
      dust = Array.from({ length: Math.min(320, Math.max(110, Math.floor(area * 0.0002))) }, () => makeDust(width, height));
      planets = Array.from({ length: 3 }, (_, index) => makePlanet(width, height, index));
      rocks = Array.from({ length: Math.min(30, Math.max(12, Math.floor(area * 0.000024))) }, () => makeRock(width, height));
    }

    function drawBase(time, px, py) {
      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "#02030a");
      base.addColorStop(0.28, "#06122c");
      base.addColorStop(0.62, "#100824");
      base.addColorStop(1, "#02030a");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      radial(ctx, width * 0.22 + px * 0.025, height * 0.16 + py * 0.02, Math.max(width, height) * 0.54, [
        [0, "rgba(34,211,238,0.15)"],
        [0.4, "rgba(37,99,235,0.06)"],
        [1, "rgba(0,0,0,0)"],
      ]);
      radial(ctx, width * 0.76 - px * 0.035, height * 0.18, Math.max(width, height) * 0.45, [
        [0, "rgba(139,92,246,0.17)"],
        [0.48, "rgba(217,70,239,0.055)"],
        [1, "rgba(0,0,0,0)"],
      ]);
      radial(ctx, width * 0.52 + Math.sin(time * 0.05) * 18, height * 0.84, Math.max(width, height) * 0.42, [
        [0, "rgba(14,165,233,0.08)"],
        [0.42, "rgba(124,58,237,0.055)"],
        [1, "rgba(0,0,0,0)"],
      ]);

      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.36, 0, width * 0.5, height * 0.36, Math.max(width, height) * 0.82);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.72, "rgba(0,0,0,0.22)");
      vignette.addColorStop(1, "rgba(0,0,0,0.78)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }

    function drawStars(time, px, py) {
      for (const star of stars) {
        const x = (star.x + px * star.layer * 0.046 + width) % width;
        const y = (star.y + py * star.layer * 0.036 + scrollY * star.layer * 0.025 + height) % height;
        const pulse = reduceMotion ? 0.76 : 0.58 + Math.sin(time * star.twinkle + star.phase) * 0.34;
        const alpha = Math.max(0.08, Math.min(1, star.alpha * pulse));

        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, TAU);
        ctx.fill();

        if (star.r > 1.16 && alpha > 0.54) {
          ctx.globalAlpha = alpha * 0.22;
          ctx.fillRect(x - star.r * 2.4, y - 0.25, star.r * 4.8, 0.5);
          ctx.fillRect(x - 0.25, y - star.r * 2.4, 0.5, star.r * 4.8);
        }

        if (!reduceMotion) {
          star.y += star.drift;
          if (star.y > height + 4) star.y = -4;
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawDust(time) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const particle of dust) {
        ctx.globalAlpha = particle.alpha * (0.68 + Math.sin(time * 0.42 + particle.phase) * 0.32);
        ctx.fillStyle = Math.random() > 0.992 ? "#67e8f9" : "#dbeafe";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, TAU);
        ctx.fill();
        if (!reduceMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y > height + 4) particle.y = -4;
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawMeteors() {
      if (reduceMotion) return;
      for (let i = 0; i < meteors.length; i += 1) {
        const meteor = meteors[i];
        if (meteor.wait > 0) {
          meteor.wait -= 1;
          continue;
        }

        const dx = Math.cos(meteor.angle) * meteor.length;
        const dy = Math.sin(meteor.angle) * meteor.length;
        const trail = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - dx, meteor.y - dy);
        trail.addColorStop(0, "rgba(255,255,255,0.92)");
        trail.addColorStop(0.12, meteor.color === "#22d3ee" ? "rgba(34,211,238,0.78)" : "rgba(167,139,250,0.78)");
        trail.addColorStop(1, "rgba(34,211,238,0)");

        ctx.strokeStyle = trail;
        ctx.lineWidth = meteor.width;
        ctx.shadowColor = meteor.color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - dx, meteor.y - dy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        meteor.x += meteor.speed;
        meteor.y += meteor.speed * Math.sin(meteor.angle);
        if (meteor.x > width + meteor.length || meteor.y > height + meteor.length) meteors[i] = makeMeteor(width, height);
      }
    }

    function drawFrame(now) {
      const time = now * 0.001;
      scrollY += ((window.scrollY || 0) - scrollY) * 0.045;
      const px = pointerX * width * 0.028;
      const py = pointerY * height * 0.028;

      drawBase(time, px, py);
      drawGalaxy(ctx, width, height, time, px, py);
      drawStars(time, px, py);
      drawDust(time);
      planets.forEach((planet) => drawPlanet(ctx, planet, time, px, py));
      rocks.forEach((rock) => drawRock(ctx, rock, width, height, reduceMotion));
      drawMeteors();

      raf = requestAnimationFrame(drawFrame);
    }

    function onPointerMove(event) {
      pointerX += (event.clientX / Math.max(width, 1) - 0.5 - pointerX) * 0.08;
      pointerY += (event.clientY / Math.max(height, 1) - 0.5 - pointerY) * 0.08;
    }

    function onMotionChange(event) {
      reduceMotion = event.matches;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);
    raf = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
