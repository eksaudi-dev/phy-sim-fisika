/* SIMULASI 2 — Lab Fasor & Rangkaian RLC
   Tab 1–3: diagram fasor berputar CCW + proyeksi gelombang sinusoidal real-time.
   Tab 4: RLC seri dengan 4 slider + fasor resultan + badge sifat rangkaian. */

import { simFrame, darkScreen, setReadouts, slider, label, makeLoop, arrow } from "./frame.js";
import { num, $, $$ } from "../utils.js";

const VMAX = 100;

export function mount(host, simTabsEl) {
  let curTab = "r";
  let state = null;
  let tSim = 0;
  let last = performance.now();

  const loop = makeLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (loop.playing) tSim += dt;
    render();
  });

  function ensureUI(tab) {
    const frame = state.frame;
    if (tab === "rlc") {
      frame.controls.innerHTML = `
        <div id="fasor-rlc-ctrl"></div>
        <div class="sim-caption" style="margin:10px 0 4px">Hasil Perhitungan Real-Time</div>
        <div class="readout-grid" id="fasor-read"></div>`;
      const c = $("#fasor-rlc-ctrl", host);
      state.sR = slider(c, { id: "fs-R", label: "Hambatan R", min: 10, max: 200, step: 1, value: 60, unit: "Ω" });
      state.sL = slider(c, { id: "fs-L", label: "Induktansi L", min: 10, max: 500, step: 5, value: 200, unit: "mH", k: 0.001 });
      state.sC = slider(c, { id: "fs-C", label: "Kapasitansi C", min: 1, max: 100, step: 1, value: 50, unit: "μF", k: 1e-6 });
      state.sF = slider(c, { id: "fs-f", label: "Frekuensi f", min: 10, max: 200, step: 1, value: 50, unit: "Hz" });
      [state.sR, state.sL, state.sC, state.sF].forEach((el) => el.addEventListener("input", updateRLC));
      updateRLC();
    } else {
      frame.controls.innerHTML = `
        <div id="fasor-x-ctrl"></div>
        <div class="sim-caption" style="margin:10px 0 4px">Panel Data</div>
        <div class="readout-grid" id="fasor-read"></div>`;
      const desc = {
        r: "Resistor murni: V dan I <b>sefase</b> (φ = 0°).",
        l: "Induktor murni: <b>tegangan</b> mendahului arus 90°.",
        c: "Kapasitor murni: <b>arus</b> mendahului tegangan 90°.",
      }[tab];
      frame.controls.insertAdjacentHTML("afterbegin", `<p style="font-size:13px;margin-bottom:6px">${desc}</p>`);
      const c = $("#fasor-x-ctrl", host);
      state.sF = slider(c, { id: "fs-f2", label: "Frekuensi f (kecepatan putar visual)", min: 1, max: 10, step: 0.1, value: 3, unit: "rad/s", k: 1 });
      updateSimple(tab);
    }
    frame.onResize(() => {});
    render();
  }

  function updateSimple(tab) { render(); void tab; }

  function updateRLC() {
    const R = parseFloat(state.sR.value);
    const L = parseFloat(state.sL.value) * 1e-3;
    const C = parseFloat(state.sC.value) * 1e-6;
    const f = parseFloat(state.sF.value);
    const XL = 2 * Math.PI * f * L;
    const XC = 1 / (2 * Math.PI * f * C);
    const Z = Math.sqrt(R * R + (XL - XC) ** 2);
    const phi = Math.atan2(XL - XC, R);
    const Ief = VMAX / Math.SQRT2 / Z;
    setReadouts($("#fasor-read", host), [
      ["X<sub>L</sub>", `${num(XL, 1)} Ω`],
      ["X<sub>C</sub>", XC > 1e6 ? "∞" : `${num(XC, 1)} Ω`],
      ["Z", `${num(Z, 1)} Ω`],
      ["φ", `${num((phi * 180) / Math.PI, 1)}°`],
      ["cos φ", `${num(Math.cos(phi), 3)}`],
      ["I<sub>ef</sub>", `${num(Ief, 3)} A`],
    ]);
    const badge = $("#fasor-badge", host);
    let cls = "badge-res", txt = "RESISTIF";
    if (Math.abs(XL - XC) > 0.5) {
      if (XL > XC) { cls = "badge-inductive"; txt = "INDUKTIF (φ > 0°)"; }
      else { cls = "badge-capacitive"; txt = "KAPASITIF (φ < 0°)"; }
    }
    if (badge) { badge.className = `badge ${cls}`; badge.textContent = txt; }
  }

  function render() {
    const { ctx, w, h } = state.frame;
    const half = Math.floor(w / 2);
    darkScreen(ctx, w, h);
    const cx = half / 2;
    const cy = h / 2;
    const Rp = Math.min(half, h) / 2 - 34;

    if (curTab === "rlc") {
      drawRLC(ctx, cx, cy, Rp, w, h);
    } else {
      const lagMap = { r: 0, l: -Math.PI / 2, c: Math.PI / 2 };
      const th = (state.sF ? parseFloat(state.sF.value) : 3) * tSim;
      drawPhasorPair(ctx, cx, cy, Rp, th, lagMap[curTab], curTab);
      // panel kanan: proyeksi sinusoidal
      const px = cx + half / 2;
      drawProjection(ctx, px, cy, (half / 2) - 16, h, th, lagMap[curTab]);
    }
  }

  function drawPhasorPair(ctx, cx, cy, R, th, iPhase, tab) {
    ctx.strokeStyle = "rgba(57,255,20,0.18)";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(57,255,20,0.1)";
    ctx.beginPath(); ctx.arc(cx, cy, R / 2, 0, Math.PI * 2); ctx.stroke();

    const thetaV = th;
    const thetaI = th + iPhase;
    const xv = [cx + R * Math.cos(-thetaV), cy + R * Math.sin(-thetaV)];
    const xi = [cx + R * Math.cos(-thetaI), cy + R * Math.sin(-thetaI)];

    arrow(ctx, cx, cy, xv[0], xv[1], "#00b7ff", 4);
    arrow(ctx, cx, cy, xi[0], xi[1], "#ffa500", 4);
    label(ctx, "V", xv[0] + 8 * Math.sign(Math.cos(-thetaV) || 1), xv[1] - 6, "#00b7ff", 14);
    label(ctx, "I", xi[0] + 8 * Math.sign(Math.cos(-thetaI) || 1), xi[1] - 6, "#ffa500", 14);
    const dphase = ((iPhase * 180) / Math.PI).toLocaleString("id-ID", { maximumFractionDigits: 0 });
    label(ctx, `Δφ = ${dphase}°  | ωt = ${num(((th * 180) / Math.PI) % 360, 0)}°`, 10, 20, "#9fffb3", 12);
    void tab;
  }

  function drawProjection(ctx, cx, cy, W, h, th, iPhase) {
    ctx.strokeStyle = "rgba(57,255,20,0.35)";
    ctx.beginPath(); ctx.moveTo(cx, cy - h / 2 + 12); ctx.lineTo(cx, cy + h / 2 - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + W, cy); ctx.stroke();

    const plot = (phaseOff, color, ampFrac) => {
      const A = (h / 2 - 24) * ampFrac;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const angle = th - (x / W) * (Math.PI * 2.4) + phaseOff;
        const y = cy - A * Math.sin(angle);
        x === 0 ? ctx.moveTo(cx + x, y) : ctx.lineTo(cx + x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    };
    plot(0, "#00b7ff", 0.8);
    plot(-iPhase, "#ffa500", 0.8);
    label(ctx, "V(t)", cx + 4, cy - (h / 2 - 16) * 0.8 - 6, "#00b7ff", 11);
    label(ctx, "I(t)", cx + 4, cy + (h / 2 - 16) * 0.8 + 16, "#ffa500", 11);
  }

  function drawRLC(ctx, cx, cy, R, w, h) {
    const Rv = parseFloat(state.sR.value);
    const L = parseFloat(state.sL.value) * 1e-3;
    const C = parseFloat(state.sC.value) * 1e-6;
    const f = parseFloat(state.sF.value);
    const XL = 2 * Math.PI * f * L;
    const XC = 1 / (2 * Math.PI * f * C);
    const Z = Math.sqrt(Rv * Rv + (XL - XC) ** 2) || 1;
    const Ipk = VMAX / Z;
    const VR = Ipk * Rv, VL = Ipk * XL, VC = Ipk * XC;

    // skala fasor: ambil max |VR,VL,VC,Vt| ke radius
    const Vt = Math.hypot(VR, VL - VC);
    const k = R / Math.max(VR, VL, VC, Vt, 1);
    const rot = (2 * Math.PI) * (tSim % 1e6); // rotasi visual

    ctx.strokeStyle = "rgba(57,255,20,0.18)";
    ctx.beginPath(); ctx.arc(cx, cy, k * 40, 0, Math.PI * 2); ctx.stroke();

    const vec = (mag, ang, color, txt) => {
      const x2 = cx + k * mag * Math.cos(ang + rot), y2 = cy - k * mag * Math.sin(ang + rot);
      arrow(ctx, cx, cy, x2, y2, color, 3.4);
      label(ctx, txt, x2 + 6 * Math.sign(Math.cos(ang + rot) || 1), y2 - 6, color, 12);
    };
    vec(VR, 0, "#00b7ff", `VR=${num(VR, 0)}V`);
    vec(VL, Math.PI / 2, "#39ff14", `VL=${num(VL, 0)}V`);
    vec(VC, -Math.PI / 2, "#ff2ea6", `VC=${num(VC, 0)}V`);
    vec(Vt, Math.atan2(VL - VC, VR), "#ffd400", "Vt");
    label(ctx, `f=${num(f, 0)}Hz  XL=${num(XL, 1)}  XC=${num(XC, 1)}  Z=${num(Z, 1)}Ω`, 10, 20, "#9fffb3", 11);
    void w; void h;
  }

  /* --- inisialisasi berdasarkan sub-tab yang diklik --- */
  function activate(tab) {
    curTab = tab;
    state = state || {};
    state.frame = state.frame || simFrame(host, { h: 420 },);
    if (!state.frame) return;
    if (!loop.playing) { loop.play(); }
    ensureUI(tab);
  }

  if (simTabsEl) {
    const tabs = $$("[data-stab]", simTabsEl);
    tabs.forEach((b) => {
      b.addEventListener("click", () => {
        tabs.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        activate(b.dataset.stab);
      });
    });
  }

  // badge sifat rangkaian (untuk tab RLC)
  const extra = document.createElement("div");
  extra.className = "flex mt-2";
  extra.innerHTML = `<span style="font-family:var(--font-mono);font-size:12px">SIFAT RANGKAIAN:</span><span id="fasor-badge" class="badge badge-res">RESISTIF</span>`;
  host.appendChild(extra);

  activate("r");
  return { loop };
}
