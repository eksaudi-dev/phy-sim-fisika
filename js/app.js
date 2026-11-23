/* PHY-SIM — Aplikasi Siswa (SPA Hub)
   Router view: login → hub → modul (AC / GEM) → post-test.
   Asesmen: kuis bertingkat 3 level per materi + Post-Test Komprehensif 20 soal. */

import {
  $, $$, escapeHTML, renderMath, shuffle, titleCase, makeDocId, toast, num,
  modalConfirm, closeModal, modalOk,
} from "./utils.js";
import {
  saveSession, loadSession, clearSession, readLocalProgress, writeLocalProgress,
  saveProgress, initOfflineBridge,
  fetchFirestoreProgress, mergeProgress, watchSesi, cachedSesi,
} from "./store.js";
import { sections as AC_CONTENT } from "./data/ac-content.js";
import { sections as GEM_CONTENT } from "./data/gem-content.js";
import { AC_Q, GEM_Q, POSTTEST_Q } from "./data/questions.js";

import { mount as simOsiloskop } from "./sims/osiloskop.js";
import { mount as simFasor } from "./sims/fasor.js";
import { mount as simResonansi } from "./sims/resonansi.js";
import { mount as simGem3d } from "./sims/gem3d.js";
import { mount as simSpektrum } from "./sims/spektrum.js";
import { mount as simIntensitas } from "./sims/intensitas.js";

const SIMS = {
  osiloskop: simOsiloskop, fasor: simFasor, resonansi: simResonansi,
  gem3d: simGem3d, spektrum: simSpektrum, intensitas: simIntensitas,
};

const GROUP7 = "Group 7 — Eksaudi Elianto Munthe · Nazwa Husna Adira · Ruth Tamariska Br Munthe";

const MODULES = {
  ac: { tema: "Arus Bolak-Balik", content: AC_CONTENT, bank: AC_Q, field: "ac" },
  gem: { tema: "Gelombang Elektromagnetik", content: GEM_CONTENT, bank: GEM_Q, field: "gem" },
};

const PASS = 70;
const POSTTEST_TIME = 1800;
const LS_PT_START = "physim_posttest_start";

const state = {
  view: "login",
  module: null,
  section: null,
  quiz: null,          // { mode:'level'|'posttest', module, level, order, answers, pindahTab, done }
  sesi: cachedSesi(),
  mountedSims: new Set(),
};

/* ============================================================
   ROUTER
   ============================================================ */
function show(view) {
  state.view = view;
  if (view !== "module") state.section = null;
  $$(".view").forEach((v) => v.classList.remove("active"));
  const el = $(`#view-${view}`);
  if (!el) return;
  if (view === "module") renderModule();
  if (view === "posttest") renderPosttestGate();
  if (view === "hub") renderHub();
  el.classList.add("active");
  animateView(el);
}

function animateView(el) {
  if (typeof gsap === "undefined") return;
  gsap.fromTo(el.children, { y: 22, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out", clearProps: "all" });
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}

function go(hash) { location.hash = hash; }
window.addEventListener("hashchange", route);

function route() {
  const h = location.hash.replace("#", "");
  const sess = loadSession();
  if (!sess) {
    resetLevelQuiz();
    show("login"); updateTopbar(); return;
  }
  const target = h.startsWith("modul-") && MODULES[h.split("-")[1]]
    ? "module" : h === "posttest" ? "posttest" : h === "login" ? "login" : "hub";

  if (state.quiz) {
    if (!state.quiz.done && target !== "posttest" &&
        !(target === "module" && state.quiz.mode === "level" && state.quiz.module === h.split("-")[1])) {
      resetLevelQuiz();
    }
  }
  if (target === "module") state.module = h.split("-")[1];
  show(target);
  updateTopbar();
}

/* ============================================================
   TOPBAR
   ============================================================ */
function updateTopbar() {
  const sess = loadSession();
  const u = $("#tb-user");
  if (!u) return;
  if (sess) {
    u.innerHTML = `<span class="u-chip">${escapeHTML(sess.nama)}</span>
      <span class="u-chip dark">${escapeHTML(sess.kelas)} · ${escapeHTML(sess.absen)}</span>`;
    $("#btn-logout").classList.remove("hidden");
  } else {
    u.innerHTML = "";
    $("#btn-logout").classList.add("hidden");
  }
}

/* ============================================================
   LOGIN
   ============================================================ */
function initLogin() {
  const inpNama = $("#in-nama");
  inpNama.addEventListener("blur", () => {
    if (inpNama.value.trim()) inpNama.value = titleCase(inpNama.value.trim());
  });
  $("#form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = titleCase(inpNama.value.trim());
    const kelas = $("#in-kelas").value.trim().toUpperCase();
    const absen = $("#in-absen").value.trim();
    if (!nama || !kelas || !absen || +absen < 1 || +absen > 40 || !/^\d+$/.test(absen)) {
      toast("Lengkapi semua data. Nomor absen 01–40.", "err");
      return;
    }
    const docId = makeDocId(kelas, absen);
    saveSession({ nama, kelas, absen: String(+absen).padStart(2, "0"), docId });
    toast("Memulihkan progres…", "cloud", 1500);
    const cloud = await fetchFirestoreProgress(docId);
    mergeProgress(cloud);
    go("hub");
    route();
  });
  $("#btn-logout").addEventListener("click", () => {
    modalConfirm("Keluar Sesi?",
      "<p>Progresmu tetap tersimpan di cloud. Melanjutkan nanti akan memulihkan progres otomatis.</p>",
      "Keluar", () => {
        clearSession();
        state.sesi = cachedSesi();
        go("");
        show("login");
        updateTopbar();
      });
  });
}

/* ============================================================
   HUB
   ============================================================ */
function lvlChips(field) {
  const p = readLocalProgress();
  return [1, 2, 3].map((n) => {
    const done = (p[`${field}_skorLevel${n}`] || 0) >= PASS;
    return `<span class="lvl-chip ${done ? "done" : ""}">L${n}${done ? " ✓" : ""}</span>`;
  }).join("");
}
function levelLulus(field, lvl) {
  const p = readLocalProgress();
  return (p[`${field}_skorLevel${lvl}`] || 0) >= PASS;
}
function fieldProgress(field) {
  return Math.round(([1, 2, 3].filter((n) => levelLulus(field, n)).length / 3) * 100);
}

function renderHub() {
  const p = readLocalProgress();
  const sess = loadSession();

  const posttestUnlocked =
    (levelLulus("ac", 2) || levelLulus("ac", 3)) &&
    (levelLulus("gem", 2) || levelLulus("gem", 3));

  $("#hub-cards").innerHTML = `
    <button class="hub-card c1" data-go="modul-ac">
      <span class="card-no" style="background:var(--cyan)">MODUL 01</span>
      <h3>Arus Bolak-Balik</h3>
      <div class="progress-track"><div class="fill" style="width:${fieldProgress("ac")}%"></div></div>
      <div class="mini-cols">${lvlChips("ac")}</div>
      <span class="mono" style="font-size:11px">Persamaan AC · Rangkaian RLC · Resonansi · 3 Simulasi</span>
    </button>
    <button class="hub-card c2" data-go="modul-gem">
      <span class="card-no" style="background:var(--magenta);color:#fff">MODUL 02</span>
      <h3>Gelombang Elektromagnetik</h3>
      <div class="progress-track"><div class="fill" style="width:${fieldProgress("gem")}%"></div></div>
      <div class="mini-cols">${lvlChips("gem")}</div>
      <span class="mono" style="font-size:11px">Perambatan · Spektrum · Energi · Pemanfaatan · 3 Simulasi</span>
    </button>
    <button class="hub-card c3 ${posttestUnlocked ? "" : "locked"}" data-go="${posttestUnlocked ? "posttest" : ""}" id="card-posttest">
      <span class="card-no" style="background:var(--yellow)">EVALUASI AKHIR</span>
      <h3>Post-Test Komprehensif</h3>
      <div class="mini-cols">
        <span class="lvl-chip ${p.postTest_selesai ? "done" : ""}">${p.postTest_selesai ? `SKOR ${num(p.postTest_skor || 0, 0)}` : "20 SOAL"}</span>
        <span class="lvl-chip">30 MENIT</span>
        <span class="lvl-chip">1× KESEMPATAN</span>
      </div>
      <span class="mono" style="font-size:11px">${posttestUnlocked
        ? (p.postTest_selesai
          ? `Selesai — skor ${num(p.postTest_skor || 0, 0)} (AC ${num(p.postTest_skorAC || 0, 0)} · GEM ${num(p.postTest_skorGEM || 0, 0)})`
          : "Terbuka! Hanya satu kali pengerjaan, batas waktu 30 menit.")
        : "Terkunci — lulus minimal Level 2 pada kedua materi."}</span>
    </button>`;
  $$("[data-go]", $("#hub-cards")).forEach((b) => {
    b.addEventListener("click", () => { if (b.dataset.go) go(b.dataset.go); });
  });

  $("#hub-profil").innerHTML = sess
    ? `<span class="badge badge-dark">${escapeHTML(sess.nama)}</span>
       <span class="badge badge-cyan">${escapeHTML(sess.kelas)}</span>
       <span class="badge">Absen ${escapeHTML(sess.absen)}</span>
       ${navigator.onLine ? '<span class="badge badge-green">CLOUD SINKRON</span>' : '<span class="badge badge-red">OFFLINE</span>'}`
    : "";
}

/* ============================================================
   MODUL MATERI — NAVIGASI & RENDER
   ============================================================ */
function renderModule() {
  const m = MODULES[state.module];
  const shell = $("#module-shell");
  const navId = `nav-${m.field}`;
  if (shell.dataset.module === m.field) {
    scrollToSection(state.section || m.content[0].id);
    return;
  }
  shell.dataset.module = m.field;
  state.section = readLocalProgress()[`${m.field}_lastSection`] || m.content[0].id;

  let bodyHTML = "";
  let navHTML = "";
  m.content.forEach((s) => {
    if (s.id === "pengayaan") {
      bodyHTML += `<section class="module-section" id="sec-asesmen">${asesmenHTML(m)}</section>`;
      navHTML += `<button class="module-nav-btn" data-nav="asesmen">Asesmen (3 Level)</button>`;
    }
    bodyHTML += `<section class="module-section" id="sec-${s.id}"><div class="panel">${s.html}</div></section>`;
    navHTML += `<button class="module-nav-btn" data-nav="${s.id}">${escapeHTML(s.title)}</button>`;
  });
  bodyHTML += `<section class="module-section" id="sec-refleksi">${refleksiHTML(m)}</section>`;
  navHTML += `<button class="module-nav-btn" data-nav="refleksi" style="background:var(--cyan)">Refleksi</button>`;

  shell.innerHTML = `
    <div>
      <span class="kicker">PHY-SIM — ${escapeHTML(m.tema).toUpperCase()}</span>
      <h1 class="page-title with-box" style="margin-bottom:14px">${escapeHTML(m.tema)}</h1>
      <p class="mono" style="font-size:12px;margin-bottom:26px">${GROUP7}</p>
    </div>
    <div class="module-shell">
      <nav class="module-nav" id="${navId}">${navHTML}</nav>
      <div id="module-body">${bodyHTML}</div>
    </div>`;

  $$(".module-nav-btn", shell).forEach((b) => {
    b.addEventListener("click", () => {
      state.section = b.dataset.nav;
      scrollToSection(state.section);
    });
  });
  wireSubtabs(shell);
  wireAccordions(shell);
  wireRefleksiLive(m);
  requestAnimationFrame(() => { mountSimsIn(shell); renderMath(shell); revealMats(shell); });
}

function wireSubtabs(root) {
  $$("[data-subtabs]", root).forEach((group) => {
    const g = group.dataset.subtabs;
    const btns = $$("[data-sub]", group);
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        btns.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        $$(`[data-subpanel="${g}"] > [data-subid]`, root).forEach((pn) => {
          pn.classList.toggle("hidden", pn.dataset.subid !== b.dataset.sub);
        });
      });
    });
  });
}

function wireAccordions(root) {
  $$("[data-acc]", root).forEach((acc) => {
    $(".acc-head", acc).addEventListener("click", () => acc.classList.toggle("open"));
  });
}

function mountSimsIn(root) {
  $$("[data-sim]", root).forEach((host) => {
    const key = host.dataset.sim;
    const token = `${root.dataset.module}:${key}`;
    if (state.mountedSims.has(token)) return;
    if (SIMS[key]) {
      try {
        SIMS[key](host, $(`[data-simtabs="${key}"]`, root) || $(`[data-simtabs="${key}"]`));
        state.mountedSims.add(token);
      } catch (err) {
        host.innerHTML = `<div class="info-box warn-box">Simulasi gagal dimuat: ${escapeHTML(err.message)}</div>`;
      }
    }
  });
}

function scrollToSection(id) {
  if (!id) return;
  state.section = id;
  $$(".module-nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.nav === id));
  $$("#module-body > .module-section").forEach((s) => {
    s.classList.toggle("active", s.id === `sec-${id}`);
  });
  const target = $(`#sec-${id}`);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  writeLocalProgress({ [`${MODULES[state.module].field}_lastSection`]: id });
}

function revealMats(root) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  $$(".mat, .info-box, .eq-banner", root).forEach((el) => {
    gsap.fromTo(el, { y: 16, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "all",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });
}

/* ============================================================
   REFLEKSI
   ============================================================ */
function refleksiHTML(m) {
  return `
  <div class="panel panel-checker">
    <span class="panel-label">Refleksi — ${escapeHTML(m.tema)}</span>
    <div class="mat"><p>Penilaian mandiri: seberapa kuat pemahamanmu terhadap materi
    <b>${escapeHTML(m.tema)}</b> hari ini? Refleksi ini membantumu fokus pada bagian yang perlu didalami.</p></div>
    <div class="refleksi-stars flex mb-2">
      ${[1, 2, 3, 4, 5].map((i) => `<button class="star-btn" data-v="${i}" title="${i} bintang">★</button>`).join("")}
      <input type="hidden" class="refleksi-nilai" value="0">
    </div>
    <div class="refleksi-star-val mono" style="font-size:12px;margin-bottom:10px">Belum dipilih</div>
    <label class="field-label">Bagian konsep yang masih memerlukan pendalaman</label>
    <textarea class="input refleksi-catatan" rows="4" placeholder="Tuliskan bagian yang dirasa sulit…"></textarea>
    <div class="mt-2"><button class="btn btn-dark refleksi-kirim">Kirim Refleksi ke Guru</button></div>
  </div>`;
}

function wireRefleksiLive(m) {
  const sec = $("#sec-refleksi");
  if (!sec) return;
  const stars = $$(".star-btn", sec);
  const hidden = $(".refleksi-nilai", sec);
  const valLabel = $(".refleksi-star-val", sec);

  const setV = (v) => {
    hidden.value = v;
    stars.forEach((x) => x.classList.toggle("on", +x.dataset.v <= v));
    valLabel.textContent = v ? `${v}/5 bintang` : "Belum dipilih";
  };
  stars.forEach((s) => s.addEventListener("click", () => setV(s.dataset.v)));

  const p = readLocalProgress();
  const skala = p[`${m.field}_refleksiSkala`];
  if (skala) {
    setV(skala);
    $(".refleksi-catatan", sec).value = p[`${m.field}_refleksiCatatan`] || "";
    $(".refleksi-kirim", sec).textContent = "Perbarui Refleksi";
  }
  $(".refleksi-kirim", sec).addEventListener("click", async () => {
    const v = +hidden.value || 0;
    const txt = $(".refleksi-catatan", sec).value.trim();
    if (!v) { toast("Pilih tingkat pemahaman (1–5 bintang).", "warn"); return; }
    const res = await saveProgress({
      [`${m.field}_refleksiSkala`]: v,
      [`${m.field}_refleksiCatatan`]: txt,
    });
    if (res && res.ok !== false) toast("Refleksi tersimpan ✓", "ok");
    else toast("Refleksi disimpan lokal — menunggu koneksi.", "warn");
  });
}

/* ============================================================
   ASESMEN — KUIS BERTINGKAT 3 LEVEL
   ============================================================ */
function asesmenHTML(m) {
  const p = readLocalProgress();
  const skn = (n) => p[`${m.field}_skorLevel${n}`];
  const unlocked = (n) => n === 1 || (skn(n - 1) || 0) >= PASS;
  const titles = m.field === "ac"
    ? {
        1: "Konsep Dasar &amp; Grafik AC",
        2: "Penerapan Rumus Rangkaian RLC",
        3: "Analisis HOTS &amp; Resonansi",
      }
    : {
        1: "Konsep Dasar &amp; Urutan Spektrum",
        2: "Penerapan Rumus GEM",
        3: "Analisis Energi &amp; Aplikasi Spektrum",
      };
  return `
  <span class="panel-label">Asesmen — Kuis Bertingkat</span>
  <div class="mat"><p>Tiga level evaluasi formatif materi <b>${escapeHTML(m.tema)}</b> — masing-masing
  <b>5 soal pilihan ganda</b>. Urutan soal dan posisi opsi (A–E) <b>diacak Fisher–Yates</b> setiap sesi.
  Syarat lulus: skor ≥ ${PASS}. Level berikutnya terbuka setelah level sebelumnya lulus.
  Perpindahan tab selama asesmen <b>tercatat</b> sebagai indikator kejujuran akademik.</p></div>
  <div class="quiz-level-picker">
    ${[1, 2, 3].map((n) => {
      const sc = skn(n);
      const lulus = (sc || 0) >= PASS;
      const lock = !unlocked(n);
      return `<div class="level-card ${lock ? "locked" : ""}">
        <span class="badge ${lulus ? "badge-green" : lock ? "badge-locked" : "badge-cyan"}">
          ${lulus ? "LULUS" : lock ? "TERKUNCI" : "SIAP"}</span>
        <h4>Level ${n}</h4>
        <p style="font-size:13px;margin-bottom:12px">${titles[n]} — 5 soal PG</p>
        <button class="btn btn-sm ${lulus ? "" : "btn-dark"}" data-level="${n}" ${lock ? "disabled" : ""}>
          ${sc !== undefined ? `Ulangi (skor ${sc})` : "Mulai"}</button>
      </div>`;
    }).join("")}
  </div>
  <div id="quiz-zone"></div>`;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-level]");
  if (btn && !btn.disabled) startLevelQuiz(+btn.dataset.level);
});

function sesiClosed(msg) {
  modalConfirm("Evaluasi Ditutup", `<p>${msg}</p>`, "Mengerti", null);
}

function startLevelQuiz(level, moduleKey = state.module) {
  const m = MODULES[moduleKey];
  state.section = "asesmen";
  if (!m) return;
  state.module = moduleKey;
  if (!state.sesi[`aktif_${m.field}`]) {
    sesiClosed(`Kuis <b>${escapeHTML(m.tema)}</b> sedang ditutup oleh guru. Tunggu guru membuka aksesnya.`);
    return;
  }
  const items = m.bank[level].map(shuffleOpts);
  state.quiz = {
    mode: "level", module: moduleKey, level,
    order: shuffle(items),
    answers: new Array(items.length).fill(-1),
    pindahTab: 0, done: false,
  };
  renderQuizZone(true);
  watchTabSwitch();
  $("#quiz-zone").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* acak posisi opsi jawaban (jawaban benar mengikuti opsi) */
function shuffleOpts(q) {
  const pairs = q.opts.map((o, i) => ({ o, i }));
  const sh = shuffle(pairs);
  return { ...q, opts: sh.map((x) => x.o), ans: sh.findIndex((x) => x.i === q.ans) };
}

function renderQuizZone() {
  const zoneEl = $("#quiz-zone");
  if (!zoneEl || !state.quiz) return;
  const quiz = state.quiz;
  if (quiz.done) { renderQuizResult(zoneEl); return; }

  const isPost = quiz.mode === "posttest";
  zoneEl.innerHTML = `
    <div class="quiz-topbar">
      <span class="mono">${isPost ? "POST-TEST KOMPREHENSIF" : `KUIS ${MODULES[quiz.module].tema.toUpperCase()} — LEVEL ${quiz.level}`}</span>
      <span class="mono" id="q-counter"></span>
      ${isPost ? '<span class="timer" id="q-timer">30:00</span>' : ""}
    </div>
    ${quiz.order.map((q, qi) => `
      <div class="q-card" data-qi="${qi}">
        <span class="q-no">SOAL ${qi + 1} / ${quiz.order.length}${q.tag ? ` · ${q.tag}` : ""}</span>
        <div class="q-text">${q.q}</div>
        ${q.opts.map((o, oi) => `
          <label class="opt ${quiz.answers[qi] === oi ? "sel" : ""}" data-q="${qi}" data-o="${oi}">
            <input type="radio" name="q${qi}" value="${oi}" ${quiz.answers[qi] === oi ? "checked" : ""}>
            <span>${String.fromCharCode(65 + oi)}. ${o}</span>
          </label>`).join("")}
      </div>`).join("")}
    <div class="quiz-actions">
      <button class="btn btn-green" id="quiz-submit">Kirim Jawaban${isPost ? " & Akhiri Ujian" : ""}</button>
      <button class="btn" id="quiz-cancel">Batalkan</button>
    </div>`;

  renderMath(zoneEl);

  $$(".opt input", zoneEl).forEach((inp) => {
    inp.addEventListener("change", () => {
      const opt = inp.closest(".opt");
      const qi = +opt.dataset.q;
      const oi = +opt.dataset.o;
      quiz.answers[qi] = oi;
      $$(`[data-q="${qi}"]`, zoneEl).forEach((l) => l.classList.toggle("sel", +l.dataset.o === oi));
      paintCounter();
    });
  });
  const paintCounter = () => {
    const cEl = $("#q-counter", zoneEl);
    if (cEl) cEl.textContent = `Terjawab ${quiz.answers.filter((a) => a >= 0).length}/${quiz.order.length}`;
  };
  paintCounter();

  $("#quiz-submit", zoneEl).addEventListener("click", submitQuiz);
  $("#quiz-cancel", zoneEl).addEventListener("click", () => {
    modalConfirm("Batalkan Asesmen?", "<p>Jawaban yang belum dikirim tidak disimpan.</p>", "Batalkan", () => {
      stopTabWatch();
      stopPosttestTimer();
      state.quiz = null;
      renderQuizZone();
    });
  });
}

function submitQuiz() {
  const quiz = state.quiz;
  if (!quiz || quiz.done) return;
  const belum = quiz.answers.filter((a) => a < 0).length;
  if (belum > 0) {
    modalConfirm(`${belum} soal belum dijawab`, "<p>Yakin mengirim sekarang? Soal kosong dinilai salah.</p>", "Kirim Sekarang", finishQuiz);
    return;
  }
  const isPost = quiz.mode === "posttest";
  modalConfirm(
    isPost ? "Kirim Post-Test?" : "Kirim Jawaban?",
    isPost
      ? "<p>Post-Test hanya dapat dikerjakan <b>satu kali</b>. Setelah dikirim, skor tercatat permanen di dashboard guru.</p>"
      : "<p>Konfirmasi pengiriman jawaban untuk dinilai.</p>",
    isPost ? "Ya, Kirim & Selesaikan" : "Kirim",
    finishQuiz
  );
}

function finishQuiz() {
  const quiz = state.quiz;
  if (!quiz || quiz.done) return;
  quiz.done = true;
  stopTabWatch();

  const benar = quiz.order.reduce((sum, q, i) => sum + (quiz.answers[i] === q.ans ? 1 : 0), 0);
  quiz.benar = benar;
  quiz.skor = Math.round((benar / quiz.order.length) * 100);

  const btn = $("#quiz-submit");
  if (btn) { btn.disabled = true; btn.textContent = "Menyimpan ke Cloud..."; }

  if (quiz.mode === "level") {
    const field = quiz.module;
    const p = readLocalProgress();
    const patch = {
      [`${field}_skorLevel${quiz.level}`]: Math.max(quiz.skor, p[`${field}_skorLevel${quiz.level}`] || 0),
      [`${field}_pindahTab`]: (p[`${field}_pindahTab`] || 0) + quiz.pindahTab,
    };
    const lulusLevels = [1, 2, 3].filter((n) =>
      ((n === quiz.level ? Math.max(quiz.skor, p[`${field}_skorLevel${n}`] || 0) : p[`${field}_skorLevel${n}`]) || 0) >= PASS);
    patch[`${field}_levelTertinggi`] = lulusLevels.length ? Math.max(...lulusLevels) : 0;

    saveProgress(patch).then((r) => {
      if (r && !r.ok) toast("Skor disimpan lokal — otomatis dikirim saat online.", "warn");
      refreshAsesmenSection(quiz.module);
      renderQuizZone();
    });
  } else {
    const acIdx = quiz.order.map((q, i) => (q.topic === "ac" ? i : -1)).filter((i) => i >= 0);
    const gemIdx = quiz.order.map((q, i) => (q.topic === "gem" ? i : -1)).filter((i) => i >= 0);
    const benarOf = (idxs) => idxs.reduce((s, i) => s + (quiz.answers[i] === quiz.order[i].ans ? 1 : 0), 0);
    quiz.skorAC = Math.round((benarOf(acIdx) / Math.max(acIdx.length, 1)) * 100);
    quiz.skorGEM = Math.round((benarOf(gemIdx) / Math.max(gemIdx.length, 1)) * 100);
    stopPosttestTimer();
    localStorage.removeItem(LS_PT_START);

    const patch = {
      postTest_skor: quiz.skor,
      postTest_skorAC: quiz.skorAC,
      postTest_skorGEM: quiz.skorGEM,
      postTest_selesai: true,
      postTest_pindahTab: quiz.pindahTab,
      postTest_waktuSelesai: new Date().toLocaleString("id-ID", { hour12: false }),
    };
    saveProgress(patch).then((r) => {
      if (r && !r.ok) toast("Skor Post-Test disimpan lokal — otomatis dikirim saat online.", "warn");
      renderPosttestGate();
      renderQuizZone();
    });
  }
}

/* segarkan kartu level (skor/badge) di seksi Asesmen tanpa memuat ulang seluruh modul */
function refreshAsesmenSection(moduleKey) {
  const m = MODULES[moduleKey];
  const sec = $("#sec-asesmen");
  if (!sec || !m) return;
  sec.innerHTML = asesmenHTML(m);
}

/* Kartu hasil + pembahasan + jembatan remedial */
function renderQuizResult(zoneEl) {
  const quiz = state.quiz;
  const lulus = quiz.skor >= PASS;

  const remedialBox = lulus || quiz.mode === "posttest" ? "" : `
    <div class="info-box warn-box mt-2" style="text-align:left">
      <span class="box-tag">Jembatan Remedial</span>
      <p style="margin:0 0 10px;font-size:14px">Skor di bawah ${PASS}. Pelajari kembali konsep target di bawah ini, lalu ulangi ${
        quiz.mode === "posttest" ? "Post-Test hanya sekali — hubungi guru bila perlu reset" : `Level ${quiz.level}` }.</p>
      <div class="flex">
        ${[...new Set(quiz.order.map((q) => q.ref))].filter((r) => r).map((r) => {
          const sec = MODULES[quiz.module].content.find((s) => s.id === r);
          return `<button class="btn btn-sm" data-rem="${r}">↳ ${sec ? escapeHTML(sec.short || sec.title) : r}</button>`;
        }).join("")}
        ${quiz.mode === "level" ? `<button class="btn btn-sm btn-dark" id="quiz-retry">Ulangi Level ${quiz.level}</button>` : ""}
      </div>
    </div>`;

  zoneEl.innerHTML = `
    <div class="result-hero">
      <span class="panel-label" style="background:${lulus ? "var(--green)" : "var(--red)"};color:${lulus ? "var(--ink)" : "#fff"}">
        ${lulus ? "LULUS" : "BELUM LULUS"}</span>
      <div class="big-score" style="color:${lulus ? "#0a8f0a" : "#c21800"}">${num(quiz.skor, 0)}</div>
      <p class="mono" style="margin:10px 0 4px">${quiz.benar}/${quiz.order.length} jawaban benar${quiz.pindahTab > 0 ? ` · ${quiz.pindahTab} insiden perpindahan tab` : ""}</p>
      ${quiz.mode === "posttest"
        ? `<p class="mono" style="font-size:13px">Sub-tes AC: ${num(quiz.skorAC, 0)} · Sub-tes GEM: ${num(quiz.skorGEM, 0)}</p>` : ""}
      ${quiz.mode === "level" && lulus && quiz.level < 3
        ? `<a class="btn btn-dark mt-2" href="#modul-${quiz.module}" id="quiz-next">Lanjut ke Level ${quiz.level + 1} →</a>` : ""}
      ${remedialBox}
    </div>
    <div class="mt-4">
      <span class="panel-label">Pembahasan Seluruh Soal</span>
      ${quiz.order.map((q, i) => `
        <div class="q-card">
          <span class="q-no">SOAL ${i + 1}${q.tag ? ` · ${q.tag}` : ""}${q.topic ? ` · ${q.topic.toUpperCase()}` : ""}</span>
          <div class="q-text">${q.q}</div>
          ${q.opts.map((o, oi) => {
            const mine = quiz.answers[i] === oi;
            const right = q.ans === oi;
            return `<div class="opt ${right ? "correct" : mine ? "wrong" : ""}">
              <span>${String.fromCharCode(65 + oi)}.</span><span>${o}</span>
              ${mine ? '<span class="badge badge-dark" style="margin-left:auto">PILIHANMU</span>' : ""}
            </div>`;
          }).join("")}
          <div class="expl-box"><b>Pembahasan:</b> ${q.exp}</div>
        </div>`).join("")}
    </div>`;

  renderMath(zoneEl);
  $$("[data-rem]", zoneEl).forEach((b) =>
    b.addEventListener("click", () => {
      state.quiz = null;
      renderQuizZone();
      state.section = b.dataset.rem;
      scrollToSection(b.dataset.rem);
    }));
  const retryBtn = $("#quiz-retry");
  if (retryBtn) retryBtn.addEventListener("click", () => startLevelQuiz(quiz.level, quiz.module));
  const nextBtn = $("#quiz-next");
  if (nextBtn) nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    startLevelQuiz(quiz.level + 1, quiz.module);
  });
}

/* Deteksi perpindahan tab */
function watchTabSwitch() {
  stopTabWatch();
  document.addEventListener("visibilitychange", onTabSwitch);
}
function stopTabWatch() {
  document.removeEventListener("visibilitychange", onTabSwitch);
}
function onTabSwitch() {
  if (document.visibilityState !== "visible") return;
  const target = state.quiz;
  if (!target || target.done) return;
  target.pindahTab += 1;
  toast(`⚠ Perpindahan tab/jendela terdeteksi (${target.pindahTab}×). Insiden ini tercatat pada dashboard guru.`, "warn", 4200);
}

/* ============================================================
   POST-TEST KOMPREHENSIF
   ============================================================ */
function renderPosttestGate() {
  const p = readLocalProgress();
  const zoneEl = $("#posttest-zone");

  if (state.quiz && state.quiz.done && state.quiz.mode === "posttest") {
    zoneEl.innerHTML = `<div id="quiz-zone" class="mt-2"></div>`;
    renderQuizZone();
    return;
  }

  if (p.postTest_selesai) {
    zoneEl.innerHTML = `
      <div class="result-hero">
        <span class="panel-label" style="background:var(--cyan);color:var(--ink)">POST-TEST SELESAI</span>
        <div class="big-score" style="color:#0a8f0a">${num(p.postTest_skor || 0, 0)}</div>
        <p class="mono">Rincian: AC ${num(p.postTest_skorAC || 0, 0)} · GEM ${num(p.postTest_skorGEM || 0, 0)}
        · Selesai ${escapeHTML(p.postTest_waktuSelesai || "")}</p>
        <p class="mono" style="font-size:12px;color:#555">Post-Test hanya dapat dikerjakan 1×. Kendala teknis → hubungi guru untuk <i>Reset Post-Test</i>.</p>
        <a class="btn btn-dark mt-2" href="#hub">⟵ Kembali ke Beranda</a>
      </div>`;
    return;
  }

  const acOK = levelLulus("ac", 2) || levelLulus("ac", 3);
  const gemOK = levelLulus("gem", 2) || levelLulus("gem", 3);
  if (!acOK || !gemOK) {
    zoneEl.innerHTML = `
      <div class="panel panel-checker">
        <span class="panel-label">POST-TEST TERKUNCI</span>
        <div class="mat"><p>Kartu <b>Post-Test Komprehensif</b> terbuka otomatis setelah kamu lulus minimal
        <b>Level 2</b> pada <b>kedua</b> materi: <b>Arus Bolak-Balik</b> <i>dan</i>
        <b>Gelombang Elektromagnetik</b>.</p>
        <div class="flex mt-2">
          <span class="badge ${acOK ? "badge-green" : "badge-red"}">AC — Level 2 ${acOK ? "LULUS ✓" : "BELUM LULUS"}</span>
          <span class="badge ${gemOK ? "badge-green" : "badge-red"}">GEM — Level 2 ${gemOK ? "LULUS ✓" : "BELUM LULUS"}</span>
        </div>
        <div class="flex mt-2">
          <a class="btn btn-sm btn-dark" href="#modul-ac">→ Materi AC</a>
          <a class="btn btn-sm btn-dark" href="#modul-gem">→ Materi GEM</a>
        </div></div>
      </div>`;
    return;
  }

  if (state.quiz && !state.quiz.done && state.quiz.mode === "posttest") {
    zoneEl.innerHTML = `<div id="quiz-zone"></div>
      <div class="mt-4"><a class="btn" href="#hub">⟵ Kembali ke Beranda (ujian tetap berjalan)</a></div>`;
    renderQuizZone();
    startPosttestTimer();
    return;
  }

  zoneEl.innerHTML = `
    <div class="panel panel-cyan">
      <span class="panel-label">POST-TEST KOMPREHENSIF — SIAP</span>
      <ul style="margin:0 0 16px 20px;font-size:15px">
        <li><b>20 soal pilihan ganda</b>: 10 soal Arus Bolak-Balik + 10 soal Gelombang Elektromagnetik (C2–C4).</li>
        <li>Batas waktu <b>30 menit</b>; waktu habis → jawaban dikirim otomatis.</li>
        <li>Urutan soal dan opsi jawaban <b>diacak (Fisher–Yates)</b> setiap sesi.</li>
        <li><b>Hanya dikerjakan 1 kali</b>. Selama ujian jangan berpindah tab/jendela — setiap insiden terekam guru.</li>
      </ul>
      <button class="btn btn-green" id="pt-start">MULAI POST-TEST SEKARANG</button>
    </div>`;
  $("#pt-start").addEventListener("click", startPosttest);
}

function startPosttest() {
  if (!state.sesi.aktif_posttest) {
    sesiClosed("Post-Test Komprehensif sedang ditutup oleh guru. Hubungi guru jika kamu belum sempat mengerjakan.");
    return;
  }
  const items = POSTTEST_Q.map((q) => ({ ...shuffleOpts(q), topic: q.topic, ref: q.ref, tag: q.tag }));
  state.quiz = {
    mode: "posttest",
    order: shuffle(items),
    answers: new Array(items.length).fill(-1),
    pindahTab: 0, done: false,
  };
  localStorage.setItem(LS_PT_START, String(Date.now()));
  renderPosttestGate();
  renderQuizZone();
  watchTabSwitch();
  startPosttestTimer();
  window.scrollTo(0, 0);
}

let ptInterval = null;
function startPosttestTimer() {
  stopPosttestTimer();
  if (!state.quiz || state.quiz.done) return;
  const started = parseInt(localStorage.getItem(LS_PT_START) || "0", 10) || Date.now();
  const deadline = started + POSTTEST_TIME * 1000;
  const tick = () => {
    const el = $("#q-timer");
    const sisa = Math.max(0, Math.round((deadline - Date.now()) / 1000));
    if (el) {
      el.textContent = `${String(Math.floor(sisa / 60)).padStart(2, "0")}:${String(sisa % 60).padStart(2, "0")}`;
      el.classList.toggle("warn", sisa <= 120);
    }
    if (sisa <= 0) {
      stopPosttestTimer();
      toast("⏰ Waktu habis — jawaban terakhir dikirim otomatis.", "warn", 5000);
      if (state.quiz && !state.quiz.done) finishQuiz();
    }
  };
  tick();
  ptInterval = setInterval(tick, 1000);
}
function stopPosttestTimer() {
  if (ptInterval) { clearInterval(ptInterval); ptInterval = null; }
}

function resetLevelQuiz() {
  if (state.quiz && !state.quiz.done && state.quiz.mode === "level") {
    stopTabWatch();
    state.quiz = null;
  }
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  initLogin();
  wireModal();
  initOfflineBridge(() => toast("Sinkronisasi otomatis ke cloud berhasil ✓", "ok"));

  window.addEventListener("online", () => { netDot(true); toast("Koneksi internet pulih ✓", "ok"); });
  window.addEventListener("offline", () => { netDot(false); toast("Sedang offline — progres disimpan lokal.", "warn"); });
  netDot(navigator.onLine);

  watchSesi((s) => {
    state.sesi = s;
    if (state.view === "hub") renderHub();
  });

  if (loadSession()) route(); else show("login");
  updateTopbar();

  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 0.85 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}

function wireModal() {
  $(".modal-ok").addEventListener("click", modalOk);
  $(".modal-close").addEventListener("click", closeModal);
}

document.addEventListener("DOMContentLoaded", boot);
