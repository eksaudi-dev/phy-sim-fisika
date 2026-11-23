/* PHY-SIM — lapisan persistensi lokal & jembatan Firestore
   Pola: SEMUA tulisan skor/refleksi melewati saveProgress(), yang:
   1) langsung menulis ke localStorage (sumber kebenaran cadangan),
   2) mencoba kirim ke Firestore,
   3) bila jaringan gagal -> antrean pendingSync:true, dikirim otomatis saat event 'online'. */

import { db } from "./firebase-config.js";
import {
  doc, getDoc, setDoc, onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const LS_SESSION = "physim_session";
const LS_PROGRESS = "physim_progress";
const LS_PENDING = "physim_pendingSync";

/* ---------------- Sesi siswa ---------------- */
export function saveSession(sess) { localStorage.setItem(LS_SESSION, JSON.stringify(sess)); }
export function loadSession() {
  try { return JSON.parse(localStorage.getItem(LS_SESSION)); } catch { return null; }
}
export function clearSession() {
  localStorage.removeItem(LS_SESSION);
  localStorage.removeItem(LS_PROGRESS);
}

/* ---------------- Progres (bentuk sama dengan dokumen Firestore) ---------------- */
export function readLocalProgress() {
  try { return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; } catch { return {}; }
}
export function writeLocalProgress(patch) {
  const cur = readLocalProgress();
  Object.assign(cur, patch);
  localStorage.setItem(LS_PROGRESS, JSON.stringify(cur));
  return cur;
}

/* ---------------- Pengiriman ke Firestore + antrean offline ---------------- */
function stamp() {
  return new Date().toLocaleString("id-ID", { hour12: false });
}

async function pushToFirestore(docId, patch) {
  const payload = { ...patch, waktuUpdate: stamp() };
  await setDoc(doc(db, "hasil_kuis", docId), payload, { merge: true });
}

export async function saveProgress(patch) {
  const sess = loadSession();
  if (!sess) return;
  const local = writeLocalProgress({ ...patch, waktuUpdate: stamp() });

  if (navigator.onLine === false) {
    queueOffline(local);
    return { ok: false, offline: true };
  }
  try {
    await pushToFirestore(sess.docId, patch);
    flushOffline().catch(() => {});
    return { ok: true };
  } catch {
    queueOffline(local);
    return { ok: false, offline: true };
  }
}

function queueOffline(payload) {
  const sess = loadSession();
  if (!sess) return;
  localStorage.setItem(LS_PENDING, JSON.stringify({ docId: sess.docId, payload }));
  document.dispatchEvent(new CustomEvent("physim:pending", { detail: payload }));
}

/** Kirim ulang seluruh antrean offline ke Firestore. */
export async function flushOffline() {
  const raw = localStorage.getItem(LS_PENDING);
  if (!raw) return { sent: false };
  const { docId, payload } = JSON.parse(raw);
  if (!docId) return { sent: false };
  await pushToFirestore(docId, payload);
  localStorage.removeItem(LS_PENDING);
  return { sent: true };
}

/** Pasang listener sinyal online + interval percobaan ulang periodik. */
export function initOfflineBridge(onChange) {
  const tryFlush = () => flushOffline()
    .then((r) => { if (r && r.sent) onChange && onChange(); })
    .catch(() => {});
  window.addEventListener("online", tryFlush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tryFlush();
  });
  setInterval(tryFlush, 60000);
  tryFlush();
}

/* ---------------- Muat progres dari Firestore (recovery lintas perangkat) ---------------- */
export async function fetchFirestoreProgress(docId) {
  try {
    const snap = await getDoc(doc(db, "hasil_kuis", docId));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

/** Salin progres Firestore ke localStorage hanya bila field-nya lebih maju. */
export function mergeProgress(cloud) {
  if (!cloud) return readLocalProgress();
  const keys = [
    "ac_skorLevel1", "ac_skorLevel2", "ac_skorLevel3", "ac_levelTertinggi",
    "gem_skorLevel1", "gem_skorLevel2", "gem_skorLevel3", "gem_levelTertinggi",
    "postTest_selesai",
  ];
  const cur = readLocalProgress();
  const patch = {};
  keys.forEach((k) => {
    if (cloud[k] !== undefined && ((typeof cloud[k] === "boolean" && cloud[k] === true) || (typeof cloud[k] === "number" && (cur[k] || 0) < cloud[k]))) {
      patch[k] = cloud[k];
    }
  });
  if (cloud.postTest_skor !== undefined) patch.postTest_skor = cloud.postTest_skor;
  if (cloud.postTest_skorAC !== undefined) patch.postTest_skorAC = cloud.postTest_skorAC;
  if (cloud.postTest_skorGEM !== undefined) patch.postTest_skorGEM = cloud.postTest_skorGEM;
  if (cloud.ac_refleksiSkala !== undefined) patch.ac_refleksiSkala = cloud.ac_refleksiSkala;
  if (cloud.gem_refleksiSkala !== undefined) patch.gem_refleksiSkala = cloud.gem_refleksiSkala;
  if (cloud.ac_refleksiCatatan) patch.ac_refleksiCatatan = cloud.ac_refleksiCatatan;
  if (cloud.gem_refleksiCatatan) patch.gem_refleksiCatatan = cloud.gem_refleksiCatatan;
  return writeLocalProgress(patch);
}

/* ---------------- Pengaturan sesi evaluasi (dari guru) ---------------- */
const LS_SESI = "physim_sesi_evaluasi_cache";
const SESSI_DEFAULT = { aktif_ac: true, aktif_gem: true, aktif_posttest: true };

export function cacheSesi(s) {
  localStorage.setItem(LS_SESI, JSON.stringify(s));
}
export function cachedSesi() {
  try { return JSON.parse(localStorage.getItem(LS_SESI)) || { ...SESSI_DEFAULT }; }
  catch { return { ...SESSI_DEFAULT }; }
}

/** Langganan real-time pengaturan/sesi_evaluasi; balik unsub. */
export function watchSesi(cb) {
  try {
    return onSnapshot(doc(db, "pengaturan", "sesi_evaluasi"), (snap) => {
      const s = snap.exists() ? snap.data() : { ...SESSI_DEFAULT };
      cacheSesi(s);
      cb(s);
    }, () => cb({ ...SESSI_DEFAULT, offline: true }));
  } catch {
    cb(cachedSesi());
    return () => {};
  }
}
