/* SIMULASI 6 — Kalkulator & Visualisasi Intensitas Energi GEM
   Hukum kuadrat terbalik: mesir garis fluks pada muka bola + hitung ū, I, Emax, Bmax. */

import { simFrame, darkScreen, setReadouts, slider, label, FIS } from "./frame.js";
import { num, sci, $ } from "../utils.js";

export function mount(host) {
  const frame = simFrame(host, {
    h: 400,
    controlsHTML: `<div id="it-ctrl"></div>
      <div class="sim-caption" style="margin:10px 0 4px">Panel Kalkulasi Real-Time</div>
      <div class="readout-grid" id="it-read"></div>`,
  });
  const c = $("#it-ctrl", host);
  const sP = slider(c, { id: "it-P", label: "Daya Sumber Pemancar P", min: 10, max: 1000, step: 10, value: 300, unit: "W" });
  const sR = slider(c, { id: "it-r", label: "Jarak Sensor r", min: 0.5, max: 20, step: 0.5, value: 3, unit: "m" });

  const modeInfo = document.createElement("p");
  modeInfo.style.cssText = "font-size:13px;margin-top:8px";
  modeInfo.innerHTML = "Mesir garis fluks melebar saat jarak <b>r</b> bertambah — intensitas turun mengikuti $I = P/(4\\pi r^2)$ (hukum kuadrat terbalik).";
  frame.controls.appendChild(modeInfo);

  function draw() {
    const { ctx, w, h } = frame;
    const P = parseFloat(sP.value);
    const r = parseFloat(sR.value);
    const I = P / (4 * Math.PI * r * r);
    const uu = I / FIS.c;                    // ū = I/c
    const Emax = Math.sqrt(2 * FIS.mu0 * FIS.c * I);
    const Bmax = Emax / FIS.c;

    darkScreen(ctx, w, h);

    // sumber di kiri; muka gelombang bola digambar sbg setengah lingkaran
    const cx = 46, cy = h / 2;
    const Rmax = Math.min(w - 110, h * 0.86);
    const rPx = 24 + (r / 20) * Rmax;

    // mesir fluks (garis dari sumber ke muka bola)
    const n = 18;
    ctx.lineWidth = 1.4;
    for (let i = 0; i <= n; i++) {
      const ang = -Math.PI / 2 + (i / n) * Math.PI;
      const dens = Math.min(1, I / 40) * 0.75 + 0.08; // kepadatan visual ∝ kuat
      ctx.strokeStyle = `rgba(57,255,20,${denza(dens, ang)})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const x2 = cx + rPx * Math.cos(ang);
      const y2 = cy + rPx * Math.sin(ang);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // muka gelombang (setengah bola)
    ctx.strokeStyle = "#ffd400";
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(cx, cy, rPx, -Math.PI / 2, Math.PI / 2); ctx.stroke();

    // sumber
    ctx.fillStyle = "#ff6b00";
    ctx.beginPath(); ctx.arc(cx, cy, 7 + (P / 1000) * 6, 0, Math.PI * 2); ctx.fill();
    label(ctx, `P = ${num(P, 0)} W`, cx - 20, cy - 14, "#ff6b00", 12);

    // sensor
    const sxA = cx + rPx;
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(sxA - 5, cy - 26, 10, 52);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(sxA - 5, cy - 26, 10, 52);
    label(ctx, "sensor", sxA - 22, cy - 34, "#00e5ff", 11);

    // jarak
    label(ctx, `r = ${num(r, 1)} m`, cx + rPx / 2 - 24, h - 26, "#fff", 12);
    label(ctx, `I = ${sci(I, 3)} W/m²`, w - 14, 26, "#39ff14", 13, "right");
    label(ctx, `I ∝ 1/r²  →  kepadatan garis fluks menurun dengan jarak`, 14, h - 8, "#778", 10);

    setReadouts($("#it-read", host), [
      ["I = P/4πr²", `${sci(I, 3)} W/m²`],
      ["ū = I/c", `${sci(uu, 3)} J/m³`],
      ["E<sub>max</sub>", `${sci(Emax, 3)} V/m`],
      ["B<sub>max</sub>", `${sci(Bmax, 3)} T`],
    ]);
  }

  const denza = (dens) => 0.15 + dens * 0.75;
  [sP, sR].forEach((s) => s.addEventListener("input", draw));
  if (typeof window.renderMathInElement === "function") {
    window.renderMathInElement(modeInfo, { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
  }
  draw();
  host._redraw = draw;
  window.addEventListener("resize", draw);
}
