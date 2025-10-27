// assets/js/app.js
// Modul utama SPA eROM@AG
// Pastikan import supabaseClient
import { supabase } from "../../src/api/supabaseClient.js";

// Utiliti SweetAlert2 sedia ada
// ... utiliti asal anda ...

// ================================================
// Inisialisasi Tab dan UI Sedia Ada
// ================================================

// ... kod asal tab, kalendar, tempahan, rumusan ...

// ================================================
// PENTADBIR: Log masuk, Senarai, Batal (sedia ada)
// ================================================

// Fungsi sedia ada:
// - adminLogin()
// - adminReloadList()
// - renderAdminList(items)
// - adminBulkCancel()

// ------------------------------------------------
// [PATCH ADMIN EDIT] Tambah: Edit Rekod Pentadbir
// ------------------------------------------------

/**
 * Keadaan ringkas untuk panel edit.
 */
const AdminEditState = {
  current: null, // objek rekod yang sedang diedit
};

/**
 * Dapatkan rujukan elemen panel edit.
 */
function $adminEditEls() {
  return {
    panel: document.getElementById("admin-edit-panel"),
    id: document.getElementById("edit-booking-id"),
    tarikh: document.getElementById("edit-tarikh"),
    bilik: document.getElementById("edit-bilik"),
    masaMula: document.getElementById("edit-masa-mula"),
    masaTamat: document.getElementById("edit-masa-tamat"),
    kategori: document.getElementById("edit-kategori"),
    tujuan: document.getElementById("edit-tujuan"),
    sektor: document.getElementById("edit-sektor"),
    namaPenempah: document.getElementById("edit-nama-penempah"),
    btnSave: document.getElementById("btn-admin-save-edit"),
    btnCancel: document.getElementById("btn-admin-cancel-edit"),
  };
}

/**
 * Sumber pilihan bilik dan sektor sedia ada.
 * Guna senarai sama seperti tab Tempahan.
 * Asumsikan anda sudah ada pembolehubah ROOM_OPTIONS, SEKTOR_OPTIONS, dan NAMA_MENGIKUT_SEKTOR.
 */
function hydrateEditSelectors() {
  const { bilik, sektor, namaPenempah } = $adminEditEls();

  // Isi bilik
  bilik.innerHTML = "";
  ROOM_OPTIONS.forEach((r) => {
    const op = document.createElement("option");
    op.value = r;
    op.textContent = r;
    bilik.appendChild(op);
  });

  // Isi sektor
  sektor.innerHTML = "";
  SEKTOR_OPTIONS.forEach((s) => {
    const op = document.createElement("option");
    op.value = s;
    op.textContent = s;
    sektor.appendChild(op);
  });

  // Dinamik nama penempah ikut sektor
  sektor.addEventListener("change", () => {
    const sel = sektor.value;
    const names = NAMA_MENGIKUT_SEKTOR[sel] || [];
    namaPenempah.innerHTML = "";
    names.forEach((n) => {
      const op = document.createElement("option");
      op.value = n;
      op.textContent = n;
      namaPenempah.appendChild(op);
    });
  });
}

/**
 * Buka panel edit dengan data rekod.
 * @param {object} rec objek rekod dari v_bookings_active
 */
function adminOpenEdit(rec) {
  const els = $adminEditEls();
  hydrateEditSelectors();

  AdminEditState.current = rec;
  els.id.value = rec.booking_id; // field dalam view
  els.tarikh.value = rec.tarikh; // format YYYY-MM-DD
  els.bilik.value = rec.bilik;
  els.masaMula.value = rec.masa_mula; // format HH:MM
  els.masaTamat.value = rec.masa_tamat;
  els.kategori.value = rec.kategori || "";
  els.tujuan.value = rec.tujuan || "";
  els.sektor.value = rec.sektor || SEKTOR_OPTIONS[0];

  // Isi nama penempah selepas set sektor
  const names = NAMA_MENGIKUT_SEKTOR[els.sektor.value] || [];
  els.namaPenempah.innerHTML = "";
  names.forEach((n) => {
    const op = document.createElement("option");
    op.value = n;
    op.textContent = n;
    els.namaPenempah.appendChild(op);
  });
  els.namaPenempah.value = rec.nama_penempah || names[0] || "";

  els.panel.classList.remove("hidden");
}

/**
 * Tutup panel edit dan kosongkan state.
 */
function adminCloseEdit() {
  const els = $adminEditEls();
  els.panel.classList.add("hidden");
  AdminEditState.current = null;
  els.id.value = "";
}

/**
 * Validasi ringkas input edit.
 */
function validateEditInputs() {
  const els = $adminEditEls();
  const required = [els.tarikh, els.bilik, els.masaMula, els.masaTamat, els.sektor, els.namaPenempah];
  let ok = true;
  required.forEach((el) => {
    el.classList.remove("invalid");
    if (!el.value) {
      ok = false;
      el.classList.add("invalid");
    }
  });
  if (els.masaMula.value && els.masaTamat.value && els.masaMula.value >= els.masaTamat.value) {
    ok = false;
    els.masaMula.classList.add("invalid");
    els.masaTamat.classList.add("invalid");
  }
  return ok;
}

/**
 * Simpan perubahan melalui RPC fn_admin_update_booking.
 */
async function adminSaveEdit() {
  const els = $adminEditEls();
  if (!AdminEditState.current) return;

  if (!validateEditInputs()) {
    Swal.fire({ icon: "warning", title: "Isi medan wajib", text: "Sila semak tarikh, masa, sektor dan nama." });
    return;
  }

  const adminPw = document.getElementById("admin-password")?.value || "";
  if (!adminPw) {
    Swal.fire({ icon: "info", title: "Kata laluan diperlukan", text: "Sila log masuk pentadbir dahulu." });
    return;
  }

  const params = {
    p_admin_password: adminPw,
    p_booking_id: els.id.value,
    p_tarikh: els.tarikh.value,
    p_bilik: els.bilik.value,
    p_masa_mula: els.masaMula.value,
    p_masa_tamat: els.masaTamat.value,
    p_kategori: els.kategori.value || null,
    p_tujuan: els.tujuan.value || null,
    p_sektor: els.sektor.value,
    p_nama_penempah: els.namaPenempah.value,
  };

  const loading = Swal.fire({ title: "Menyimpan...", didOpen: () => Swal.showLoading(), allowOutsideClick: false });
  try {
    const { data, error } = await supabase.rpc("fn_admin_update_booking", params);
    if (error) throw error;

    // data dijangka jsonb: { ok: boolean, data?: {...}, error?: code }
    if (!data?.ok) {
      const code = data?.error || "GAGAL_TIDAK_DIJANGKA";
      throw new Error(code);
    }

    // Berjaya
    await Swal.fire({ icon: "success", title: "Disimpan", timer: 900, showConfirmButton: false });
    adminCloseEdit();

    // Segarkan senarai admin dan paparan lain yang bergantung
    await adminReloadList();
    // Jika anda ada fungsi segar kalendar bilik aktif dan rumusan, panggil semula di sini
    if (typeof refreshActiveRoomCalendar === "function") await refreshActiveRoomCalendar();
    if (typeof refreshRumusan === "function") await refreshRumusan();
  } catch (e) {
    Swal.fire({ icon: "error", title: "Gagal simpan", text: e.message || "Ralat tidak dijangka" });
  } finally {
    loading.then(() => {});
  }
}

/**
 * Suntik butang Edit pada setiap baris senarai admin.
 * Anggap renderAdminList(items) sedia ada membina jadual dengan kolum tindakan.
 * Kita patch secara minimum: tambah butang Edit tanpa ubah logik lain.
 */
function renderAdminList(items) {
  const root = document.getElementById("admin-list");
  root.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    root.innerHTML = `<p class="muted">Tiada tempahan akan datang.</p>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Pilih</th>
        <th>Tarikh</th>
        <th>Bilik</th>
        <th>Masa</th>
        <th>Tujuan</th>
        <th>Penempah</th>
        <th>Tindakan</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");

  items.forEach((rec) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" class="chk-cancel" data-id="${rec.booking_id}"/></td>
      <td>${rec.tarikh}</td>
      <td>${rec.bilik}</td>
      <td>${rec.masa_mula}–${rec.masa_tamat}</td>
      <td>${rec.tujuan || "-"}</td>
      <td>${rec.nama_penempah || "-"}</td>
      <td>
        <button class="btn-ghost btn-edit" data-id="${rec.booking_id}">Edit</button>
      </td>
    `;
    // Tambah handler Edit
    tr.querySelector(".btn-edit").addEventListener("click", () => adminOpenEdit(rec));
    tbody.appendChild(tr);
  });

  root.appendChild(table);
}

// Pasang handler panel edit
(function initAdminEditHandlers() {
  const { btnSave, btnCancel } = $adminEditEls();
  if (btnSave && btnCancel) {
    btnSave.addEventListener("click", adminSaveEdit);
    btnCancel.addEventListener("click", adminCloseEdit);
  }
})();

// ================================================
// Kod sedia ada lain tidak diubah
// ================================================

// Pastikan fungsi berikut wujud sedia ada:
// - adminReloadList()
// - refreshActiveRoomCalendar()   // jika ada
// - refreshRumusan()              // jika ada
