/* SIMULASI 3 — Kurva Resonansi Seri RLC
   Kurva lonceng I(f); garis putus fr; titik indikator menyala hijau saat fr tercapai. */

import { simFrame, darkScreen, setReadouts, slider, label, FIS } from "./frame.js";
import { num, $ } from "../utils.js";

const VMAX = 10; // tegangan efektif sumber simulasi (V)

export function mount(host) {
  const frame = simFrame(host, {
    h: 420,
    controlsHTML: `<div id="res-ctrl"></div>
      <div class="sim-caption" style="margin:10px 0 4px">Panel Data Rangkaian</div>
      <div class="readout-grid" id="res-read"></div>`,
  });
  const c = $("#res-ctrl", host);
  const sL = slider(c, { id: "rs-L", label: "Induktansi L", min: 10, max: 500, step: 5, value: 200, unit: "mH", k: 0.001 });
  const sC = slider(c, { id: "rs-C", label: "Kapasitansi C", min: 1, max: 100, step: 1, value: 50, unit: "μF", k: 1e-6 });
  const sR = slider(c, { id: "rs-R", label: "Hambatan R", min: 10, max: 200, step: 1, value: 40, unit: "Ω" });
  const sF = slider(c, { id: "rs-f", label: "Frekuensi sumber f (titik indikator)", min: 1, max: 2000, step: 1, value: 50, unit: "Hz" });

  const ringkasan = document.createElement("div");
  ringkasan.className = "info-box hidden";
  ringkasan.innerHTML = `<span class="box-tag">Resonansi Tercapai</span>
    <div class="flex" style="gap:18px"><span class="badge badge-green">X<sub>L</sub> = X<sub>C</sub></span>
    <span class="badge badge-cyan">Z = R</span><span class="badge badge-green">cos φ = 1</span>
    <span class="badge badge-yellow">I MAKSIMUM</span></div>
    <p style="margin:10px 0 0;font-size:14px">Rangkaian bersifat <b>murni resistif</b>: impedansi minimum
    $Z_{\\min}=R$, arus maksimum $I_{\\max}=V/R$, sudut fase $\\varphi=0^{\\circ}$.</p>`;
  frame.extra.appendChild(ringkasan);

  function calc() {
    const L = parseFloat(sL.value) * 1e-3;
    const C = parseFloat(sC.value) * 1e-6;
    const R = parseFloat(sR.value);
    const f = parseFloat(sF.value);
    const fr = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const XL = 2 * Math.PI * f * L;
    const XC = 1 / (2 * Math.PI * f * C);
    const Z = Math.sqrt(R * R + (XL - XC) ** 2);
    const I = VMAX / Z;
    return { L, C, R, f, fr, XL, XC, Z, I };
  }

  function draw() {
    const { ctx, w, h } = frame;
    const d = calc();
    darkScreen(ctx, w, h);

    const padL = 64, padB = 40, padT = 26, padR = 18;
    const W = w - padL - padR, H = h - padT - padB;
    const fMax = Math.max(d.fr * 2.5, 60);
    const Imax = VMAX / d.R; // puncak lonceng (R terkecil -> puncak tertinggi)

    // sumbu
    ctx.strokeStyle = "rgba(57,255,20,0.4)";
    ctx.beginPath();
    ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + H); ctx.lineTo(padL + W, padT + H);
    ctx.stroke();
    label(ctx, "I (A)", padL - 8, padT + 2, "#9fffb3", 12, "right");
    label(ctx, "f (Hz)", padL + W - 6, padT + H + 26, "#9fffb3", 12, "right");

    const xOf = (f) => padL + (f / fMax) * W;
    const yOf = (I) => padT + H - (I / Imax) * H * 0.92;

    // kurva lonceng I(f)
    const atRes = Math.abs(d.f - d.fr) / d.fr < 0.02 && Math.abs(d.f - d.fr) < 2;
    const peakColor = atRes ? "#39ff14" : "#00b7ff";
    ctx.strokeStyle = peakColor;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    const N = 260;
    for (let i = 0; i <= N; i++) {
      const fx = (i / N) * fMax;
      const XL = 2 * Math.PI * fx * d.L;
      const XC = 1 / (2 * Math.PI * fx * d.C);
      const Z = Math.sqrt(d.R ** 2 + (XL - XC) ** 2);
      const I = VMAX / Z;
      const X = xOf(fx), Y = yOf(I);
      i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
    }
    ctx.stroke();
    ctx.lineWidth = 1;

    // titik puncak
    ctx.fillStyle = peakColor;
    ctx.shadowColor = peakColor;
    ctx.shadowBlur = atRes ? 18 : 0;
    ctx.beginPath();
    ctx.arc(xOf(d.fr), yOf(Imax), atRes ? 8 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // garis putus penanda fr
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "rgba(255,212,0,0.75)";
    ctx.beginPath();
    ctx.moveTo(xOf(d.fr), padT + H);
    ctx.lineTo(xOf(d.fr), padT + 4);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, `fr=${num(d.fr, 1)}Hz`, xOf(d.fr) + 6, padT + 16, "#ffd400", 12);

    // indikator titik kerja
    ctx.fillStyle = atRes ? "#39ff14" : "#ffffff";
    ctx.beginPath();
    ctx.arc(xOf(d.f), yOf(d.I), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // nilai puncak di sumbu
    label(ctx, num(Imax, 2), padL - 10, yOf(Imax) + 4, "#9fffb3", 10, "right");
    label(ctx, num(fMax, 0), padL + W, padT + H + 16, "#9fffb3", 10, "right");

    setReadouts($("#res-read", host), [
      ["f<sub>r</sub> teori", `${num(d.fr, 1)} Hz`],
      ["X<sub>L</sub>", `${num(d.XL, 1)} Ω`],
      ["X<sub>C</sub>", d.XC > 1e5 ? "∞" : `${num(d.XC, 1)} Ω`],
      ["Z", `${num(d.Z, 1)} Ω`],
      ["I", `${num(d.I, 3)} A`],
      ["cos φ", num(d.R / d.Z, 3)],
    ]);

    ringkasan.classList.toggle("hidden", !atRes);
    if (typeof window.renderMathInElement === "function" && atRes && !ringkasan._rendered) {
      window.renderMathInElement(ringkasan, { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
      ringkasan._rendered = true;
    }
    void FIS;
  }

  [sL, sC, sR, sF].forEach((s) => s.addEventListener("input", draw));
  draw();
  host._redraw = draw;
  window.addEventListener("resize", draw);
}
