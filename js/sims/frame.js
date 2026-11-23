/* PHY-SIM — kerangka umum wadah simulasi canvas */

import { fitCanvas, $ } from "../utils.js";

export { makeLoop } from "../utils.js";

/** Bangun struktur DOM standar di dalam host: [kontrol | kanvas | readouts]. */
export function simFrame(host, { h = 380, controlsHTML = "", readoutsHTML = "" } = {}) {
  host.classList.add("sim-root");
  host.innerHTML = `
    <div class="sim-layout">
      <div class="sim-controls">
        ${controlsHTML}
        <div class="readout-grid"></div>
      </div>
      <div class="sim-stage">
        <canvas style="width:100%"></canvas>
        <div class="sim-extra" style="margin-top:14px"></div>
      </div>
    </div>
    ${readoutsHTML ? `<div class="sim-bottom" style="margin-top:14px">${readoutsHTML}</div>` : ""}
  `;
  const cv = $("canvas", host);
  const ctx = cv.getContext("2d");

  const sizing = () => {
    const wCss = host.clientWidth || 600;
    const hCss = Math.min(h, Math.max(240, Math.round(wCss * 0.62)));
    fitCanvas(cv, ctx, wCss, hCss);
    if (host._onresize) host._onresize(wCss, hCss);
  };
  sizing();
  window.addEventListener("resize", sizing);

  return {
    host, canvas: cv, ctx,
    controls: $(".sim-controls", host),
    readouts: $(".readout-grid", host),
    stage: $(".sim-stage", host),
    extra: $(".sim-extra", host),
    get w() { return cv.clientWidth; },
    get h() { return cv.clientHeight; },
    onResize(fn) { host._onresize = fn; },
  };
}

/** Peta readout sederhana: pasangan [key, markupNilai] */
export function setReadouts(zoneEl, items) {
  zoneEl.innerHTML = items
    .map(([k, v]) => `<div class="readout"><span class="k">${k}</span><span class="v">${v}</span></div>`)
    .join("");
}

/* ---------- primitif gambar layar gelap bergaya osiloskop ---------- */
export function darkScreen(ctx, w, h) {
  ctx.fillStyle = "#02110a";
  ctx.fillRect(0, 0, w, h);
}
export function greenGrid(ctx, w, h, step = 26) {
  ctx.strokeStyle = "rgba(57,255,20,0.14)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 0; y <= h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
  // garis tengah lebih terang
  ctx.strokeStyle = "rgba(57,255,20,0.35)";
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
  ctx.stroke();
}
export function arrow(ctx, x1, y1, x2, y2, color, width = 3) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const hl = Math.min(12, len * 0.35);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ux * hl - uy * hl * 0.5, y2 - uy * hl + ux * hl * 0.5);
  ctx.lineTo(x2 - ux * hl + uy * hl * 0.5, y2 - uy * hl - ux * hl * 0.5);
  ctx.closePath();
  ctx.fill();
}
export function label(ctx, text, x, y, color = "#9fffb3", size = 11, align = "left") {
  ctx.font = `${size}px "JetBrains Mono", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}

/* Konstanta fisika */
export const FIS = {
  c: 3e8,                 // m/s
  mu0: 4 * Math.PI * 1e-7,
  eps0: 8.85e-12,
  h: 6.63e-34,
  e: 1.602e-19,
};

/* slider builder */
export function slider(host, { id, label, min, max, step, value, unit = "", k = "1" }) {
  const wrap = document.createElement("div");
  wrap.className = "slider-row";
  wrap.innerHTML = `
    <div class="slider-label"><span>${label}</span><span class="val" id="${id}-val"></span></div>
    <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}">
  `;
  host.appendChild(wrap);
  const input = $(`#${id}`, wrap);
  const val = $(`#${id}-val`, wrap);
  const fmt = (v) => `${(v * k).toLocaleString("id-ID", { maximumFractionDigits: 3 })}${unit ? ` ${unit}` : ""}`;
  const paint = () => { val.textContent = fmt(parseFloat(input.value)); };
  input.addEventListener("input", paint);
  paint();
  input._paint = paint;
  input._fmt = fmt;
  return input;
}

export function playBtn(host, id) {
  const b = document.createElement("button");
  b.className = "btn btn-sm btn-dark";
  b.id = id;
  b.textContent = "⏸ Pause";
  host.appendChild(b);
  return b;
}
