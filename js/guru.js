/* PHY-SIM — Dashboard Pantauan Guru
   Proteksi PIN · sakelar kontrol sesi live · statistik kelas ·
   tabel rekap real-time (onSnapshot) · filter & pencarian · export CSV · reset post-test. */

import { db } from "./firebase-config.js";
import {
  collection, doc, onSnapshot, setDoc, deleteField,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { $, $$, escapeHTML, toast, num, modalConfirm, closeModal, modalOk } from "./utils.js";

/* GANTI PIN default guru berikut sebelum deployment */
const DEFAULT_PIN = "123456";
const LS_PIN = "physim_guru_pin";

function getPin() { return localStorage.getItem(LS_PIN) || DEFAULT_PIN; }

let students = [];          // hasil_kuis snapshot array
let sesi = { aktif_ac: true, aktif_gem: true, aktif_posttest: true };
let unsubSesi = null;
let unsubStudents = null;

/* ================== PIN GATE ================== */
function initGate() {
  const form = $("#pin-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#pin-input").value === getPin()) {
      sessionStorage.setItem("physim_guru_auth", "1");
      openDashboard();
    } else {
      $("#pin-err").textContent = "PIN salah — akses ditolak.";
      $("#pin-input").value = "";
    }
  });
  if (sessionStorage.getItem("physim_guru_auth") === "1") openDashboard();
}

function openDashboard() {
  $("#gate").classList.add("hidden");
  $("#dash").classList.remove("hidden");
  wireLive();
  wireControls();
}

/* ================== LIVE WIRING ================== */
function wireLive() {
  unsubSesi = onSnapshot(doc(db, "pengaturan", "sesi_evaluasi"), (snap) => {
    sesi = snap.exists() ? snap.data() : { aktif_ac: true, aktif_gem: true, aktif_posttest: true };
    paintSwitches();
  }, () => toast("Gagal memuat pengaturan sesi — periksa konfigurasi Firebase.", "err", 6000));

  unsubStudents = onSnapshot(collection(db, "hasil_kuis"), (snap) => {
    students = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    paintStats();
    paintKelasFilter();
    paintTable();
    $("#live-ind").textContent = `● LIVE — ${students.length} siswa`;
    $("#live-ind").style.color = "var(--green)";
  }, (err) => toast(`Firestore error: ${err.code}`, "err", 6000));
}

function wireControls() {
  $$("[data-switch]").forEach((sw) => {
    sw.addEventListener("change", async () => {
      const key = sw.dataset.switch;
      const val = sw.checked;
      sw.disabled = true;
      try {
        await setDoc(doc(db, "pengaturan", "sesi_evaluasi"), {
          [key]: val,
          updatedAt: new Date().toLocaleString("id-ID", { hour12: false }),
        }, { merge: true });
        toast(`Sesi ${key.replace("aktif_", "").toUpperCase()} ${val ? "DIBUKA" : "DITUTUP"} ✓`, "ok");
      } catch (e) {
        toast(`Gagal menyimpan sakelar: ${e.message}`, "err", 5000);
        sw.checked = !val;
      }
      sw.disabled = false;
    });
  });

  $("#f-kelas").addEventListener("change", paintTable);
  $("#f-status").addEventListener("change", paintTable);
  $("#f-nama").addEventListener("input", paintTable);
  $("#btn-csv").addEventListener("click", exportCSV);
  $("#btn-logout").addEventListener("click", () => {
    sessionStorage.removeItem("physim_guru_auth");
    location.reload();
  });
  $("#btn-pin").addEventListener("click", () => {
    modalConfirm("Ganti PIN Guru", `
      <label class="field-label" style="color:#7fd">PIN Baru (min. 4 karakter)</label>
      <input class="input" id="new-pin" type="password" maxlength="12">`, "Simpan PIN Baru", () => {
      const v = $("#new-pin").value.trim();
      if (v.length >= 4) { localStorage.setItem(LS_PIN, v); toast("PIN guru diperbarui ✓", "ok"); }
      else toast("PIN terlalu pendek.", "err");
    });
    const np = $("#new-pin");
    if (np) np.focus();
  });
}

function paintSwitches() {
  $$("[data-switch]").forEach((sw) => { sw.checked = !!sesi[sw.dataset.switch]; });
  $$("[data-state]").forEach((el) => {
    const on = !!sesi[el.dataset.state];
    el.textContent = on ? "AKTIF ✓" : "DITUTUP ✕";
    el.style.color = on ? "var(--green)" : "var(--red)";
  });
}

function paintKelasFilter() {
  const sel = $("#f-kelas");
  const cur = sel.value || "all";
  const kelas = [...new Set(students.map((s) => s.kelas).filter(Boolean))].sort();
  sel.innerHTML = `<option value="all">Semua Kelas</option>` +
    kelas.map((k) => `<option value="${escapeHTML(k)}">${escapeHTML(k)}</option>`).join("");
  if (kelas.includes(cur)) sel.value = cur;
}

/* ================== STATISTIK ================== */
function skorLevel(s, f, n) { return s[`${f}_skorLevel${n}`]; }

function rataRata(field) {
  const vals = students
    .map((s) => {
      const sc = [1, 2, 3].map((n) => skorLevel(s, field, n)).filter((v) => typeof v === "number");
      return sc.length ? Math.max(...sc) : null;
    })
    .filter((v) => v !== null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function paintStats() {
  const rata = (v) => (v === null ? "—" : num(v, 1));
  $("#st-jml").textContent = students.length;
  $("#st-ac").textContent = rata(rataRata("ac"));
  $("#st-gem").textContent = rata(rataRata("gem"));
  const pts = students.filter((s) => s.postTest_selesai).map((s) => s.postTest_skor).filter((v) => typeof v === "number");
  $("#st-pt").textContent = pts.length ? num(pts.reduce((a, b) => a + b, 0) / pts.length, 1) : "—";
}

/* ================== TABEL REKAP ================== */
function filterRows() {
  const kelas = $("#f-kelas").value;
  const status = $("#f-status").value;
  const q = $("#f-nama").value.trim().toLowerCase();
  return students
    .filter((s) => (kelas === "all" ? true : s.kelas === kelas))
    .filter((s) => {
      if (status === "all") return true;
      if (status === "selesai") return !!s.postTest_selesai;
      if (status === "terbuka") {
        const lulus = (f) => (s[`${f}_skorLevel2`] >= 70 || s[`${f}_skorLevel3`] >= 70);
        return lulus("ac") && lulus("gem") && !s.postTest_selesai;
      }
      if (status === "belum") {
        const lulus = (f) => (s[`${f}_skorLevel2`] >= 70 || s[`${f}_skorLevel3`] >= 70);
        return !(lulus("ac") && lulus("gem"));
      }
      return true;
    })
    .filter((s) => (q ? (s.namaLengkap || s.nama || "").toLowerCase().includes(q) : true))
    .sort((a, b) => (a.kelas || "").localeCompare(b.kelas || "") || (+a.nomorAbsen || 0) - (+b.nomorAbsen || 0));
}

function cellScore(v) {
  if (typeof v !== "number") return '<td class="num" style="color:#556">–</td>';
  const col = v >= 70 ? "var(--green)" : "var(--red)";
  return `<td class="num" style="color:${col};font-weight:700">${v}</td>`;
}

function paintTable() {
  const rows = filterRows();
  const tb = $("#tbody");
  if (!rows.length) {
    tb.innerHTML = `<tr><td colspan="16" style="text-align:center;color:#556;padding:28px">Belum ada data siswa yang cocok.</td></tr>`;
    return;
  }
  tb.innerHTML = rows.map((s, i) => {
    const pindahTotal = (s.ac_pindahTab || 0) + (s.gem_pindahTab || 0) + (s.postTest_pindahTab || 0);
    const nama = s.namaLengkap || s.nama || "(tanpa nama)";
    const refl = (f) => {
      const sc = s[`${f}_refleksiSkala`];
      const ct = s[`${f}_refleksiCatatan`];
      return `${sc ? "★".repeat(sc) : "–"}${ct ? `<br><small style="color:#7fd">${escapeHTML(ct)}</small>` : ""}`;
    };
    return `<tr>
      <td class="num">${i + 1}</td>
      <td style="min-width:150px"><b style="color:#fff">${escapeHTML(nama)}</b></td>
      <td class="num">${escapeHTML(s.kelas || "–")}</td>
      <td class="num">${escapeHTML(String(s.nomorAbsen || "–"))}</td>
      ${cellScore(skorLevel(s, "ac", 1))}
      ${cellScore(skorLevel(s, "ac", 2))}
      ${cellScore(skorLevel(s, "ac", 3))}
      ${cellScore(skorLevel(s, "gem", 1))}
      ${cellScore(skorLevel(s, "gem", 2))}
      ${cellScore(skorLevel(s, "gem", 3))}
      ${cellScore(s.postTest_selesai ? s.postTest_skor : null)}
      <td class="num" style="color:${pindahTotal > 0 ? "var(--yellow)" : "#556"};font-weight:700">${pindahTotal}</td>
      <td style="min-width:190px;font-size:12px">${refl("ac")}<hr style="border-color:#224;margin:6px 0">${refl("gem")}</td>
      <td class="num" style="font-size:11px;color:#89f">${escapeHTML(String(s.waktuUpdate || "–"))}</td>
      <td class="num">${s.postTest_selesai
        ? `<button class="btn btn-sm btn-red" data-reset="${s.id}">Reset Post-Test</button>`
        : '<span class="mono" style="font-size:11px;color:#556">—</span>'}</td>
    </tr>`;
  }).join("");

  $$("[data-reset]", tb).forEach((b) =>
    b.addEventListener("click", () => {
      const sid = b.dataset.reset;
      const s = students.find((x) => x.id === sid);
      modalConfirm(
        `Reset Post-Test — ${escapeHTML(s?.namaLengkap || sid)}?`,
        "<p>Skor Post-Test siswa ini dihapus sehingga ia dapat mengerjakan ulang satu kali. Gunakan hanya untuk kendala teknis darurat.</p>",
        "Ya, Reset Sekarang",
        () => resetPostTest(sid)
      );
    }));
}

async function resetPostTest(docId) {
  try {
    await setDoc(doc(db, "hasil_kuis", docId), {
      postTest_skor: deleteField(),
      postTest_skorAC: deleteField(),
      postTest_skorGEM: deleteField(),
      postTest_selesai: false,
      postTest_pindahTab: deleteField(),
      postTest_waktuSelesai: deleteField(),
    }, { merge: true });
    toast("Post-Test di-reset ✓", "ok");
  } catch (e) {
    toast(`Gagal reset: ${e.message}`, "err", 5000);
  }
}

/* ================== EXPORT CSV ================== */
function exportCSV() {
  const rows = filterRows();
  if (!rows.length) { toast("Tidak ada baris untuk diekspor.", "warn"); return; }
  const head = ["No", "Nama Lengkap", "Kelas", "Absen",
    "AC L1", "AC L2", "AC L3", "AC Level Tertinggi",
    "GEM L1", "GEM L2", "GEM L3", "GEM Level Tertinggi",
    "Post-Test", "Total Pindah Tab", "Refleksi AC (Skala)", "Refleksi AC (Catatan)",
    "Refleksi GEM (Skala)", "Refleksi GEM (Catatan)", "Waktu Pembaruan"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [head.join(";")];
  rows.forEach((s, i) => {
    lines.push([
      i + 1, s.namaLengkap || s.nama || "", s.kelas || "", s.nomorAbsen || "",
      s.ac_skorLevel1 ?? "", s.ac_skorLevel2 ?? "", s.ac_skorLevel3 ?? "", s.ac_levelTertinggi ?? "",
      s.gem_skorLevel1 ?? "", s.gem_skorLevel2 ?? "", s.gem_skorLevel3 ?? "", s.gem_levelTertinggi ?? "",
      s.postTest_selesai ? (s.postTest_skor ?? "") : "Belum",
      (s.ac_pindahTab || 0) + (s.gem_pindahTab || 0) + (s.postTest_pindahTab || 0),
      s.ac_refleksiSkala ?? "", s.ac_refleksiCatatan ?? "",
      s.gem_refleksiSkala ?? "", s.gem_refleksiCatatan ?? "",
      s.waktuUpdate ?? "",
    ].map(esc).join(";"));
  });
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `physisim_rekap_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`${rows.length} baris diekspor ke CSV ✓`, "ok");
}

/* ================== BOOT ================== */
document.addEventListener("DOMContentLoaded", () => {
  initGate();
  wireModal();
});

function wireModal() {
  $(".modal-ok").addEventListener("click", modalOk);
  $(".modal-close").addEventListener("click", closeModal);
}
