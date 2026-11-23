/* SIMULASI 4 — Visualisasi Gelombang Elektromagnetik 3D (proyeksi isometrik)
   E berosilasi vertikal (biru/merah), B horizontal-sumbu z (hijau), merambat ke kanan. */

import { simFrame, darkScreen, setReadouts, slider, playBtn, label, arrow, FIS, makeLoop } from "./frame.js";
import { num, sci, $ } from "../utils.js";

export function mount(host) {
  const frame = simFrame(host, {
    h: 420,
    controlsHTML: `<div id="g3-ctrl"></div>
      <div class="sim-caption" style="margin:10px 0 4px">Panel Kalkulasi Real-Time</div>
      <div class="readout-grid" id="g3-read"></div>`,
  });
  const c = $("#g3-ctrl", host);
  const sE = slider(c, { id: "g3-E", label: "Amplitudo Medan Listrik E<sub>max</sub>", min: 0.5, max: 5, step: 0.1, value: 2, unit: "V/m" });
  const sF = slider(c, { id: "g3-f", label: "Frekuensi f (×10⁸ Hz)", min: 0.25, max: 2, step: 0.05, value: 0.75, unit: "Hz" });
  const btn = playBtn(c, "g3-play");

  let tSim = 0;
  let last = performance.now();

  // proyeksi isometrik sederhana: (x,y,z) -> layar
  const proj = (x, y2, z, cx, cy, sx, sy, sz) => ({
    sx: cx + x * sx + z * sz * 0.45,
    sy: cy - y2 * sy - z * sz * 0.2,
  });

  const loop = makeLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (loop.playing) tSim += dt;
    draw(performance.now());
  });

  function draw(now) {
    const { ctx, w, h } = frame;
    const E = parseFloat(sE.value);
    const f = parseFloat(sF.value);          // dalam satuan 1e8 Hz
    const fReal = f * 1e8;
    const lambda = FIS.c / fReal;            // λ real (m)
    const B = E / FIS.c;                     // Bmax (T)
    const lamVis = Math.max(0.9, Math.min(6, lambda)); // panjang visual

    darkScreen(ctx, w, h);

    const cx = w * 0.06;
    const cy = h * 0.55;
    const axisLen = w * 0.88;
    const visL = 5.2;             // sumbu dari 0..visL "meter visual"
    const sx = axisLen / visL;
    const sy = (h * 0.3) / 5;     // amplitudo maksimum tampilan (E=5)
    const sz = 18;

    // sumbu x
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + axisLen, cy); ctx.stroke();
    arrow(ctx, cx, cy, cx + axisLen + 10, cy, "rgba(255,255,255,0.55)", 2);
    label(ctx, "x (arah rambat)", cx + axisLen - 110, cy - 10, "#fff", 11);

    // sumbu y
    arrow(ctx, cx, cy, cx, cy - h * 0.36, "rgba(180,200,255,0.5)", 2);
    label(ctx, "y", cx - 16, cy - h * 0.34, "#bcd0ff", 12);
    // sumbu z (kiri bawah diagonal)
    const zUp = proj(0, 0, 1, cx, cy, sx, sy, sz);
    arrow(ctx, cx, cy, zUp.sx - 2, zUp.sy + 26, "rgba(160,255,160,0.5)", 2);
    label(ctx, "z", zUp.sx - 20, zUp.sy + 40, "#a0ffa0", 12);

    // panjang gelombang visual
    const k = (2 * Math.PI) / lamVis;
    const om = 2 * Math.PI * f; // visual ω (skala tayang)

    // bidang gelombang: deretan vektor
    const N = Math.max(32, Math.floor(axisLen / 26));
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * visL;
      const ph = k * x - om * tSim;
      const e = E * Math.sin(ph);
      const b = B * Math.sin(ph);

      const Bvis = 3; // panjang tampilan B maksimum (px * proporsi)
      const bScaled = (b / Math.max(B, 1e-12)) * Bvis;

      // garis penghubung titik medan (skala senar)
      if (i % 2 === 0) {
        // vektor E (vertikal y)
        const p0 = proj(x, 0, 0, cx, cy, sx, sy, sz);
        const arrowColor = e >= 0 ? "#42a5ff" : "#ff5555";
        const p1 = proj(x, e * eScale(sy, E, 1), 0, cx, cy, sx, sy, sz);
        if (Math.abs(e) > 0.02) arrow(ctx, p0.sx, p0.sy, p1.sx, p1.sy, arrowColor, 2.2);
        // vektor B (sepanjang -z utk E+ ; ikut E×B)
        const zz = -bScaled; // B oleh -z saat E +y (E×B = +x)
        const p2 = proj(x, 0, zz, cx, cy, sx, sy, sz);
        if (Math.abs(b) > 1e-13) arrow(ctx, p0.sx, p0.sy, p2.sx, p2.sy, "#39ff14", 1.8);
      }
    }

    // legenda + garis panjang gelombang
    label(ctx, `E(x,t) = ${(E).toFixed(1).replace(".", ",")} sin(kx−ωt)`, 12, 20, "#42a5ff", 12);
    label(ctx, `B(x,t) proporsional, sefase dengan E`, 12, 38, "#39ff14", 12);
    if (lamVis <= visL) {
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const x1 = proj(2.4, 5, 0, cx, cy, sx, sy, sz);
      const x2 = proj(2.4 + lamVis, 5, 0, cx, cy, sx, sy, sz);
      ctx.moveTo(x1.sx, x1.sy - 14); ctx.lineTo(x2.sx, x2.sy - 14);
      ctx.setLineDash([]);
      ctx.stroke();
      label(ctx, `λ = ${sci(lambda)} m`, (x1.sx + x2.sx) / 2 - 40, x1.sy - 20, "#fff", 11);
    }
    label(ctx, `${loop.playing ? "RUN" : "PAUSE"}  |  f = ${sci(fReal)} Hz`, w - 10, 20, "#ffd400", 12, "right");

    setReadouts($("#g3-read", host), [
      ["B<sub>max</sub> = E/c", `${sci(B)} T`],
      ["λ = c / f", `${sci(lambda)} m`],
      ["k = 2π/λ", `${sci(2 * Math.PI / lambda)} rad/m`],
      ["ω = 2πf", `${sci(2 * Math.PI * fReal)} rad/s`],
    ]);
    void now;
  }

  btn.addEventListener("click", () => {
    loop.toggle();
    btn.textContent = loop.playing ? "⏸ Pause" : "▶ Play";
    draw(performance.now());
  });
  [sE, sF].forEach((s) => s.addEventListener("input", draw));
  draw(performance.now());
  loop.play();
}

function eScale(sy, E, maxE) { return sy * (E / maxE); }
