/* SIMULASI 5 — Eksplorator Spektrum Elektromagnetik
   Pita logaritmik 1e4–1e20 Hz, 7 zona klikabel, slider frekuensi log,
   ilustrasi ukuran λ, panel detail + energi foton (J & eV), kurva transmisi atmosfer. */

import { simFrame, setReadouts, slider, label, FIS } from "./frame.js";
import { num, sci, $ } from "../utils.js";

const ZONA = [
  { id: "radio",   nama: "Radio",     lo: 1e4, hi: 3e8,  warna: "#7a4dff", sumber: "Rangkaian osilator LC",
    lam: "λ > 1 m", ukuran: "Gedung", transmisi: 0.75 },
  { id: "mikro",   nama: "Mikro",     lo: 3e8,  hi: 3e11, warna: "#0091ff", sumber: "Tabung magnetron & klystron",
    lam: "10⁻³–1 m", ukuran: "Manusia", transmisi: 0.85 },
  { id: "ir",      nama: "Inframerah", lo: 3e11, hi: 4.3e14, warna: "#ff3d00", sumber: "Getaran termal molekul (T > 0 K)",
    lam: "7×10⁻⁷–10⁻³ m", ukuran: "Jari tangan", transmisi: 0.7 },
  { id: "cahaya",  nama: "Cahaya",    lo: 4.3e14, hi: 7.5e14, warna: "linear-gradient(90deg,#ff0000,#ff8f00,#ffee00,#00c000,#0060ff,#8a00ff)", sumber: "Transisi elektron atom",
    lam: "400–700 nm", ukuran: "Serangga", transmisi: 0.8 },
  { id: "uv",      nama: "UV",        lo: 7.5e14, hi: 3e16,  warna: "#8a2be2", sumber: "Radiasi matahari, lampu lucutan merkuri",
    lam: "10⁻⁸–4×10⁻⁷ m", ukuran: "Bakteri", transmisi: 0.1 },
  { id: "x",       nama: "Sinar-X",   lo: 3e16,  hi: 3e19,  warna: "#20e0d0", sumber: "Tumbukan elektron pada logam berat (tabung Rontgen)",
    lam: "10⁻¹¹–10⁻⁸ m", ukuran: "Molekul", transmisi: 0.25 },
  { id: "gamma",   nama: "Gamma",     lo: 3e19,  hi: 1e20,  warna: "#ff2ea6", sumber: "Inti atom radioaktif, reaksi nuklir",
    lam: "λ < 10⁻¹¹ m", ukuran: "Inti atom", transmisi: 0.5 },
];

const lmin = Math.log10(1e4), lmax = Math.log10(1e20);
const xOfF = (f, W) => ((Math.log10(Math.max(f, 1e4)) - lmin) / (lmax - lmin)) * W;
const fOfX = (x, W) => Math.pow(10, lmin + (x / W) * (lmax - lmin));

export function mount(host) {
  const frame = simFrame(host, {
    h: 300,
    controlsHTML: `<div id="sp-ctrl"></div>
      <div class="sim-caption" style="margin:10px 0 4px">Detail Zona Terpilih</div>
      <div class="readout-grid" id="sp-read"></div>
      <div id="sp-detail" class="info-box" style="margin-top:12px"></div>`,
  });
  const c = $("#sp-ctrl", host);
  const sL = slider(c, { id: "sp-f", label: "Frekuensi (skala logaritmik)", min: 4, max: 20, step: 0.02, value: 8 });

  let sel = "mikro";

  function zonaAt(f) {
    return ZONA.find((z) => f >= z.lo && f < z.hi) || ZONA[ZONA.length - 1];
  }

  function draw() {
    const { ctx, w, h } = frame;
    const f = Math.pow(10, parseFloat(sL.value));
    ctx.fillStyle = "#0d0d12";
    ctx.fillRect(0, 0, w, h);

    const bandTop = 30, bandH = 44;
    const W = w - 24;

    // blok zona
    ZONA.forEach((z) => {
      const x1 = 12 + xOfF(z.lo, W);
      const x2 = 12 + xOfF(z.hi, W);
      const active = sel === z.id;
      const grad = z.warna.startsWith("linear-gradient") ? "#8a00ff" : z.warna;
      ctx.fillStyle = grad;
      ctx.globalAlpha = active ? 1 : 0.45;
      ctx.fillRect(x1, bandTop, Math.max(2, x2 - x1), bandH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = active ? "#fff" : "#000";
      ctx.lineWidth = active ? 3 : 1.5;
      ctx.strokeRect(x1, bandTop, x2 - x1, bandH);
      if (x2 - x1 > 46) {
        ctx.font = `700 ${Math.min(12, (x2 - x1) / 6)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = active ? "#fff" : "rgba(255,255,255,0.85)";
        ctx.fillText(z.nama.toUpperCase(), x1 + 4, bandTop + bandH / 2 + 4);
      }
    });

    // penanda frekuensi bergerak
    const xm = 12 + xOfF(f, W);
    ctx.strokeStyle = "#ffd400";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(xm, bandTop - 8); ctx.lineTo(xm, bandTop + bandH + 8); ctx.stroke();
    label(ctx, sci(f), xm + 4, bandTop - 12, "#ffd400", 11);

    // kurva transmisi atmosfer (perkiraan)
    ctx.strokeStyle = "rgba(57,255,20,0.85)";
    ctx.beginPath();
    const gTop = bandTop + bandH + 40, gH = h - gTop - 46;
    ctx.moveTo(12, gTop + gH);
    for (let px = 0; px <= W; px += 4) {
      const fv = fOfX(px, W);
      const z = zonaAt(fv);
      const y = gTop + gH * (1 - z.transmisi);
      ctx.lineTo(12 + px, y);
    }
    ctx.stroke();
    label(ctx, "Transmisi atmosfer (perkiraan)", 18, gTop - 6, "#39ff14", 11);
    label(ctx, "← frek. rendah", 12, h - 10, "#888", 10);
    label(ctx, "frek. tinggi →", w - 12, h - 10, "#888", 10, "right");
    label(ctx, "Skala grafik: logaritmik 10⁴ – 10²⁰ Hz", w - 12, 20, "#666", 10, "right");
  }

  function detail() {
    const zv = ZONA.find((z) => z.id === sel);
    const f = Math.pow(10, parseFloat(sL.value));
    const lam = FIS.c / f;
    const Ef = FIS.h * f;
    const eV = Ef / FIS.e;
    setReadouts($("#sp-read", host), [
      ["Zona", zv.nama],
      ["λ saat f", `${sci(lam)} m`],
      ["E foton", `${sci(Ef, 3)} J`],
      ["E foton", `${num(eV, 3)} eV`],
    ]);
    $("#sp-detail", host).innerHTML = `
      <span class="box-tag" style="background:${zv.id === "cahaya" ? "#8a00ff" : zv.warna}">${zv.nama}</span>
      <p style="margin:0;font-size:14px"><b>Perbandingan ukuran λ:</b> ${zv.ukuran} &nbsp;|&nbsp;
      <b>Rentang:</b> ${zv.lam} &nbsp;|&nbsp; <b>Sumber:</b> ${zv.sumber} &nbsp;|&nbsp;
      <b>Pancaran radar kurva hijau</b> menunjukkan seberapa besar gelombang zona ini menembus atmosfer
      (dipantulkan/diserap atmosfer bila rendah).</p>`;
  }

  sL.addEventListener("input", () => { sel = zonaAt(Math.pow(10, parseFloat(sL.value))).id; draw(); detail(); });

  frame.canvas.addEventListener("click", (ev) => {
    const r = frame.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left - 12;
    const W = r.width - 24;
    const f = fOfX(x / 1, W);
    const z = zonaAt(f);
    sel = z.id;
    sL.value = Math.log10(z.lo + (z.hi - z.lo) * 0.3).toFixed(2);
    sL._paint();
    draw(); detail();
  });

  frame.canvas.style.cursor = "crosshair";
  draw(); detail();
  host._redraw = draw;
  window.addEventListener("resize", draw);
}
