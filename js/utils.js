/* PHY-SIM — utilitas umum (tanpa dependensi Firebase) */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/** Format angka gaya Indonesia: koma desimal, titik ribuan. */
export function num(v, d = 2) {
  if (!isFinite(v)) return "∞";
  return Number(v)
    .toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
}

/** Notasi ilmiah: 8.85×10⁻¹² -> "8,85 × 10⁻¹²" (string HTML biasa, superscript via <sup>) */
export function sci(v, d = 2) {
  if (v === 0) return "0";
  if (!isFinite(v)) return "∞";
  const e = Math.floor(Math.log10(Math.abs(v)));
  if (e >= -3 && e <= 4) return num(v, Math.max(0, d));
  const m = v / Math.pow(10, e);
  const sup = String(e).replace("-", "⁻").replace(/[0123456789]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]);
  return `${num(m, d)} × 10${sup}`;
}

/**
 * Fisher-Yates Shuffle — mengembalikan salinan array baru yang teracak.
 * Semua pengacakan soal & opsi jawaban memakai fungsi ini.
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Title Case sederhana (huruf pertama tiap kata). */
export function titleCase(s) {
  return s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/** Normalisasi kelas -> token docId, mis. "XII IPA 1" -> "XII-IPA-1" */
export function kelasToToken(kelas) {
  return kelas.trim().toUpperCase().replace(/\s+/g, "-");
}

/** docId = Kelas_NomorAbsen */
export function makeDocId(kelas, absen) {
  return `${kelasToToken(kelas)}_${String(absen).padStart(2, "0")}`;
}

/** Render semua matematika KaTeX di dalam elemen (butuh window.renderMathInElement auto-render). */
export function renderMath(scope) {
  if (typeof window.renderMathInElement === "function") {
    window.renderMathInElement(scope, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }
  return scope;
}

const zone = document.createElement("div");
zone.id = "toast-zone";
document.body.appendChild(zone);

export function toast(msg, kind = "ok", ms = 3200) {
  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  el.textContent = msg;
  zone.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 320);
  }, ms);
  return el;
}

let confirmCb = null;
export function modalConfirm(title, bodyHTML, okLabel = "Lanjutkan", cb = null) {
  const back = $("#modal-backdrop");
  $(".modal-title", back).innerHTML = title;
  $(".modal-body", back).innerHTML = bodyHTML;
  const ok = $(".modal-ok", back);
  ok.textContent = okLabel;
  confirmCb = cb;
  back.classList.add("show");
  renderMath(back);
}
export function closeModal() {
  $("#modal-backdrop").classList.remove("show");
  confirmCb = null;
}
export function modalOk() {
  if (confirmCb) confirmCb();
  closeModal();
}

/** Canvas: sesuaikan ukuran fisik dengan DPR agar tajam di layar retina. */
export function fitCanvas(cv, ctx, wCss, hCss) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(wCss * dpr);
  cv.height = Math.round(hCss * dpr);
  cv.style.width = `${wCss}px`;
  cv.style.height = `${hCss}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** Pengelola loop requestAnimationFrame per simulasi (overlap-safe + pause otomatis). */
export function makeLoop(drawFn) {
  let raf = null;
  let playing = false;
  const tick = (t) => {
    drawFn(t);
    if (playing) raf = requestAnimationFrame(tick);
  };
  return {
    play() { if (playing) return; playing = true; raf = requestAnimationFrame(tick); },
    pause() { playing = false; if (raf !== null) cancelAnimationFrame(raf); raf = null; },
    toggle() { playing ? this.pause() : this.play(); return playing; },
    get playing() { return playing; },
  };
}
