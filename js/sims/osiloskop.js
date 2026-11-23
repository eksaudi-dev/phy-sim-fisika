/* SIMULASI 1 — Osiloskop Virtual AC
   Layar gelap kisi hijau; kurva V(t) biru terang & I(t) kuning-oranye berjalan.
   Kontrol: Vmax (10–310 V), f (10–100 Hz), beda fase φ, Play/Pause. */

import { simFrame, darkScreen, greenGrid, setReadouts, slider, playBtn, label, makeLoop } from "./frame.js";
import { num, $ } from "../utils.js";

export function mount(host) {
  const frame = simFrame(host, {
    h: 380,
    controlsHTML: `<div id="osk-controls"></div>
      <div class="sim-caption" style="margin:10px 0 4px">Panel Pembacaan Real-Time</div>
      <div class="readout-grid" id="osk-read"></div>`,
  });
  const ctrl = $("#osk-controls", host);
  const read = $("#osk-read", host);

  const sV = slider(ctrl, { id: "osk-V", label: "Tegangan Maksimum V<sub>max</sub>", min: 10, max: 310, step: 1, value: 220, unit: "V" });
  const sF = slider(ctrl, { id: "osk-f", label: "Frekuensi f", min: 10, max: 100, step: 1, value: 50, unit: "Hz" });
  const sPhi = slider(ctrl, { id: "osk-phi", label: "Beda Fase φ (I terhadap V)", min: -180, max: 180, step: 5, value: 60, unit: "°" });
  const btn = playBtn(ctrl, "osk-play");

  const IMAX = 4; // arus amplitudo tetap (skala tampilan), Ampere
  let tSim = 0;
  let last = performance.now();

  const loop = makeLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (loop.playing) tSim += dt * 0.45; // penampak visual ~0.45 siklus/detik
    draw(performance.now());
  });

  function draw(now) {
    const { ctx, w, h } = frame;
    const Vm = parseFloat(sV.value);
    const f = parseFloat(sF.value);
    const phi = (parseFloat(sPhi.value) * Math.PI) / 180;
    const w0 = 2 * Math.PI * f;

    darkScreen(ctx, w, h);
    greenGrid(ctx, w, h, 26);

    const midY = h / 2;
    const ampV = ((h / 2) - 26) / 310;
    const ampI = ((h / 2) - 26) / 8;

    const waves = (wMax, phiOff, color, lw, amp) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const tt = (x / w) * 4.4 + tSim; // 2.2 siklus × 2 penuh
        const y = midY - amp * wMax * Math.sin(2 * Math.PI * (tt / 2) * 1 - phiOff);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    waves(Vm, 0, "#00b7ff", 2.6, ampV);                       // V(t) biru terang
    waves(IMAX, phi, "#ffa500", 2.6, ampI);                   // I(t) kuning-oranye

    label(ctx, `V(t)  Vm=${num(Vm, 0)} V`, 12, 20, "#00b7ff", 12);
    label(ctx, `I(t)  Im=${num(IMAX, 0)} A  φ=${num(parseFloat(sPhi.value), 0)}°`, 12, 38, "#ffa500", 12);
    label(ctx, `${num(f, 0)} Hz  |  ${loop.playing ? "RUN" : "FREEZE"}`, w - 12, 20, "#39ff14", 12, "right");

    const Vef = Vm / Math.SQRT2;
    const Vpp = 2 * Vm;
    const Vrr = (2 * Vm) / Math.PI;
    const T = f > 0 ? 1 / f : 0;
    setReadouts(read, [
      ["V<sub>ef</sub> (RMS)", `${num(Vef)} V`],
      ["V<sub>pp</sub>", `${num(Vpp, 0)} V`],
      ["V<sub>rata-rata</sub>", `${num(Vrr)} V`],
      ["ω", `${num(w0, 0)} rad/s`],
      ["T", `${num(T, 3)} s`],
      ["I<sub>ef</sub>", `${num(IMAX / Math.SQRT2)} A`],
    ]);
  }

  btn.addEventListener("click", () => {
    loop.toggle();
    btn.textContent = loop.playing ? "⏸ Pause" : "▶ Play";
    draw(performance.now());
  });
  draw(performance.now());
  loop.play();
  host._redraw = draw;
  host._loop = loop;
}
