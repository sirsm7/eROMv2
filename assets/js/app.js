// assets/js/app.js
import { supa } from "../../src/api/supabaseClient.js";

/* ========= Konstanta bilik & kategori (fixed ikut arahan) ========= */
const ROOM_OPTIONS = [
  "PKG Ganun - Bilik Kursus (30 orang)",
  "PKG Melekek - Bilik Kuliah 1 (20 orang)",
  "PKG Masjid Tanah - Bilik Seri Cempaka (24 orang)",
  "PKG Masjid Tanah - Bilik Seri Melur (18 orang)",
  "PKG Masjid Tanah - Bilik Pendidikan Digital (12 orang)",
  "Bilik Mesyuarat PPDAG di SK Alor Gajah 1 (40 orang)",
  "Bilik Mesyuarat Utama PPDAG (73 orang)",
  "Bilik Mesyuarat Kecil PPDAG (15 orang)",
  "Makmal Komputer PPDAG (31 orang)",
  "Bilik Seminar PPDAG (22 orang)",
  "Bilik Temuduga PPDAG (4 orang)",
  "Bilik Runding Cara PPDAG (4 orang)",
  "Kafeteria PPDAG (30 orang)"
];
const CATEGORY_OPTIONS = [
  "Mesyuarat / Taklimat",
  "Bengkel / Kursus",
  "Lain-Lain"
];

/* ========= Sektor -> Nama (kekalkan dari versi sebelumnya) ========= */
const NAMA_MENGIKUT_SEKTOR = {
  "Pengurusan Tertinggi": ["Tuan Haji Ab Malek Bin Kasim (B.K.T)","En. Azhar Bin Md Nor (B.C.M)","En. Abd Jabar Bin Md Yusup (P.J.K)","En. Muhammad Hamka Bin Dollah","En. Bashir Bin Abu Bakar"],
  "School Improvement Partner (SIP+)": ["En. Amran Bin Abdul Sukor","En. Abd. Razak Bin Adam","Pn. Rafidah Binti Abd Rahim"],
  "Sektor Perancangan": ["En. Saifullah Bin Abdul Wahab","En. Hairoldin Rahim Bin Taya"],
  "Sektor Pembelajaran": ["En. Hairuljaki Bin Omar","Pn. Zuraini Binti Bakri","Ustazah Pauziah Binti Othman","En. Razman Bin Mohammad","En. Mohd Anis Bin Abdul Majid","Pn. Norasiah Binti Ahmad","Pn. Wan Norhayati Binti Wan Ibrahim","Pn. Sabiah Binti Ninggal","Pn. Puteri Hanizah Binti Megat Amaddin","Pn. Khairul Bariah Binti Ismail","Pn. Rohana Binti Jantan","En. Fakrul Izhar Bin Ramlee","Ustaz Mahadi Bin Suboh","Ustaz Kamarul Zaman Bin Sahat","En. Mohd Shahril Amri B. Mohamed Shahar","En. Mohd Eirwan Bin Halim","Pn. Mariyam Binti Ahmad","En. Wan Norarif Bin Wan Muhammad","Pn. Nor Jamilahton Holija'ah Bt Ariffin","En. Munzir Bin Md Rosnan","En. Mohd Rizal Bin Maslah","Pn. Faezah Binti Ali","En. Mohd Izwan Bin Othman","En. Mohd Kamarul Hafiz Bin Abdul Rashid","En. Malik Abdullah Bin Adanan","Pn. Mas Azahwati Binti Ab Aziz"],
  "Sektor Pengurusan Sekolah": ["Pn. Addelennoor Binti Abu","Pn. Siti Noorus Sa'adah Binti Md Ramli","En. Muhammad Hafiz Bin Hamdan","En. Mazli Bin Malek","En. Kadin Bin Abu @ Sim Ah Tong","En. Nor Afandi Bin Safar","En. Adnan Bin Isenin","Pn. Kavitha A/P Kannan","Pn. Irmadila Binti Mat Ismail","Pn. Masayu Binti Kari"],
  "Sektor Pembangunan Murid": ["En. Ismail Asib Bin Md Amin","En. Mohammad Misbahuddin Bin Abu Mansor"],
  "Sektor Pentaksiran & Peperiksaan": ["En. Mohd Rahdi Bin Ahmad","En. Zaidi Bin Jaafar"],
  "Psikologi & Kaunseling": ["En. Mohd Saberi Bin Minhat @ Bulat"],
  "Sektor Pengurusan": ["Pn. Asmalaili Binti Ahmad Sanusi","Pn. Fahizah Binti Mohd Yusoff","Cik Nurul Jannah Binti Mohd Nasir","Pn. Nor Fizana Binti Md Idris","Pn. Nurul Ain Binti Mohd Zaini","Pn. Intan Liyana Binti Khamis","En. Md Zaki Zabani Bin Mohd Nor","Pn. Faizzah Binti Zulkefli","En. Mustafa Bin Musa","En. Rozamni Bin Muhamad","Pn. Katijah Binti Mohd Ali","En. Zasmeini Bin Zaimun","Pn. Suzanawati Binti Mohd Said","Pn. Kamsiah Binti Hashim","Pn. Hartiniwatie Binti Abang","Pn. Rosedah Binti Muhamad","Pn. Noor 'Izzati Binti Johari","En. Mohd Arifin Bin Kamarudin","Pn. Siti Rajunah Binti Ab. Rahman","Pn. Fairus Binti Zainal","En. Hanizah Binti Minhat","Cik Siti Aishah Binti Md Hassan","Cik Nurain Nabihah Binti Nasaruddin","En. Mohd Fauzi Bin Mohamed Ali","En. Muhammad Nasiruddin Bin Muei","En. Muhammad Fadhli Mustaqim Bin Mazlan","En. Muhammad Afiq Bin Yang Rosdi","Pn. Haslina Binti Beeran Kutty"]
};

/* ========= Utiliti & SweetAlert ========= */
const Toast = Swal.mixin({ toast:true, position:'top', showConfirmButton:false, timer:2200, timerProgressBar:true });
const $ = id => document.getElementById(id);
const pad2 = n => String(n).padStart(2,'0');
const formatMonthLabel = (y,m)=> new Intl.DateTimeFormat('ms-MY',{month:'long',year:'numeric'}).format(new Date(y,m-1,1));
const toYMD = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const firstDay = (y,m)=> `${y}-${pad2(m)}-01`;
const lastDay  = (y,m)=> toYMD(new Date(Date.UTC(y,m,0)));
const todayYMD = ()=> toYMD(new Date());
function toastOk(t){Toast.fire({icon:'success',title:t});}
function toastInfo(t){Toast.fire({icon:'info',title:t});}
function toastWarn(t){Toast.fire({icon:'warning',title:t});}
function modalLoading(title='Memproses...'){ Swal.fire({ title, allowOutsideClick:false, didOpen:()=>Swal.showLoading() }); }
function modalClose(){ Swal.close(); }
function modalError(title, text){ Swal.fire(title||'Ralat', text||'Terjadi ralat yang tidak dijangka.', 'error'); }
async function modalConfirm(title, text){ const r=await Swal.fire({ title, text, icon:'question', showCancelButton:true, confirmButtonText:'Teruskan', cancelButtonText:'Batal' }); return r.isConfirmed; }
function markInvalid(el){ el.classList.add('invalid'); setTimeout(()=>el.classList.remove('invalid'), 1200); el.focus(); }
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function addDaysYMD(ymd,n){ const [y,m,d]=ymd.split('-').map(Number); const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()+n); return toYMD(dt); }

/* ========= Keadaan UI ========= */
let state = { isAdmin:false, year:null, month:null, room:'', days:[], selectedDate:null, range:{from:null,to:null}, rangeMode:false };
let ov = { year:null, month:null, days:[], view:'calendar', filterRoom:'' };
let ADMIN_PASSWORD = '';

/* ========= API wrapper (Supabase) ========= */
async function getInit(){
  const rooms = [...ROOM_OPTIONS];
  const categories = [...CATEGORY_OPTIONS];
  const sektor = Object.keys(NAMA_MENGIKUT_SEKTOR);
  return { rooms, categories, sektor };
}

/* ====== [6 JAM] GANTI: getMonthView — “Penuh” jika ada slot ≥ 6 jam ====== */
async function getMonthView({ room, year, month }){
  const from = firstDay(year, month), to = lastDay(year, month);
  const { data, error } = await supa
    .from('v_bookings_active')
    .select('tarikh, masa_mula, masa_tamat, kategori, tujuan')
    .eq('bilik', room)
    .gte('tarikh', from).lte('tarikh', to)
    .order('tarikh', { ascending:true }).order('masa_mula', { ascending:true });
  if (error) throw error;

  const byDate = new Map();
  (data||[]).forEach(r=>{
    const list = byDate.get(r.tarikh) || [];
    list.push({ start:r.masa_mula, end:r.masa_tamat, category:r.kategori, note:r.tujuan||'' });
    byDate.set(r.tarikh, list);
  });

  const mins = (t)=>{ const [h,m]=String(t).split(':').map(Number); return h*60+m; };

  const days = [];
  const last = Number(to.slice(-2));
  for(let d=1; d<=last; d++){
    const ymd = `${year}-${pad2(month)}-${pad2(d)}`;
    const bookings = byDate.get(ymd) || [];

    // penuh jika ada mana-mana booking ≥ 360 minit
    const hasLong = bookings.some(b => (mins(b.end) - mins(b.start)) >= 360);
    const status = bookings.length === 0 ? 'green' : (hasLong ? 'red' : 'orange');

    days.push({ date: ymd, weekday: (new Date(ymd).getDay()), isPast: ymd < todayYMD(), status, bookings });
  }
  return { days };
}

/* ====== [6 JAM] GANTI: getMonthRoomsOverview — kira merah ikut slot ≥ 6 jam ====== */
async function getMonthRoomsOverview({ year, month }){
  const from = firstDay(year, month), to = lastDay(year, month);
  const { data, error } = await supa
    .from('v_bookings_active')
    .select('tarikh,bilik,masa_mula,masa_tamat')   // perlu masa untuk kira 6 jam
    .gte('tarikh', from).lte('tarikh', to);
  if (error) throw error;

  const mins = (t)=>{ const [h,m]=String(t).split(':').map(Number); return h*60+m; };

  // "date|room" -> status ('red' jika ada mana-mana tempahan >=6 jam, selain itu 'orange')
  const perRoomPerDay = new Map();
  (data||[]).forEach(r=>{
    const key = `${r.tarikh}|${r.bilik}`;
    const long = (mins(r.masa_tamat) - mins(r.masa_mula)) >= 360;
    const prev = perRoomPerDay.get(key);
    const next = prev === 'red' ? 'red' : (long ? 'red' : 'orange');
    perRoomPerDay.set(key, next);
  });

  const map = new Map();
  const last = Number(to.slice(-2));
  for(let d=1; d<=last; d++){
    const ymd = `${year}-${pad2(month)}-${pad2(d)}`;
    const rooms = [];
    let red=0, orange=0;
    perRoomPerDay.forEach((status, key)=>{
      const [date, room] = key.split('|');
      if (date !== ymd) return;
      if (status==='red') red++; else orange++;
      rooms.push({ room, status });
    });
    map.set(ymd, { rooms, counts:{red,orange}, date: ymd });
  }
  return { days: [...map.values()] };
}

async function adminCheck(pw){
  const { data, error } = await supa.rpc('fn_admin_check', { pw });
  if (error) throw error;
  return { ok: !!data, isAdmin: !!data };
}
async function createBooking(args){
  const { data, error } = await supa.rpc('fn_create_booking', {
    p_room: args.room, p_date: args.date, p_start: args.start, p_end: args.end,
    p_category: args.category, p_note: args.note, p_sektor: args.sektor, p_nama: args.nama
  });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || 'Gagal menyimpan');
  return data;
}
async function createBookingRange(args){
  const { data, error } = await supa.rpc('fn_create_booking_range', {
    p_room: args.room, p_start_date: args.startDate, p_end_date: args.endDate,
    p_start: args.start, p_end: args.end, p_category: args.category,
    p_note: args.note, p_sektor: args.sektor, p_nama: args.nama
  });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || 'Gagal menyimpan julat');
  return data;
}
async function listUpcomingBookings({ room }){
  const today = todayYMD();
  const { data, error } = await supa
    .from('v_bookings_active')
    .select('booking_id, tarikh, masa_mula, masa_tamat, bilik, kategori, tujuan, nama_penempah, sektor')
    .eq('bilik', room)
    .gte('tarikh', today)
    .order('tarikh',{ascending:true})
    .order('masa_mula',{ascending:true});
  if (error) throw error;
  return {
    items: (data||[]).map(r=>({
      id: r.booking_id, date: r.tarikh, start: r.masa_mula, end: r.masa_tamat,
      room: r.bilik, category: r.kategori, note: r.tujuan, nama: r.nama_penempah, sektor: r.sektor
    }))
  };
}
async function batalTempahanBulk({ ids, reason, adminPassword }){
  const { data, error } = await supa.rpc('fn_batal_tempahan_bulk', {
    p_ids: ids, p_admin_password: adminPassword, p_reason: reason
  });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || 'Gagal batal');
  return { updated: data.updated|0 };
}

/* ========= Bootstrapping ========= */
window.addEventListener('unhandledrejection', e => { modalClose(); Toast.fire({icon:'error', title: e.reason?.message || 'Ralat tidak dijangka.'}); });
window.addEventListener('load', bootstrap);

async function bootstrap(){
  const now = new Date();
  state.year = now.getFullYear(); state.month = now.getMonth()+1;
  ov.year = now.getFullYear(); ov.month = now.getMonth()+1;

  setupUI();

  modalLoading('Memuat data awal...');
  try{
    const boot = await getInit();
    hydrateSelect($('roomSelect'), ['Sila Pilih Bilik', ...boot.rooms], true);
    hydrateSelect($('category'), boot.categories);
    hydrateSelect($('sektor'), ['— Pilih Sektor —', ...Object.keys(NAMA_MENGIKUT_SEKTOR)], true);
    hydrateSelect($('adminRoom'), ['Sila Pilih Bilik', ...ROOM_OPTIONS], true);
    populateOvRoomFilter();
    lockAdmin();
    populateNamaOptions();
    toggleCalendarHint();
    await loadOverview(true);
    modalClose();
    toastOk('Aplikasi sedia digunakan');
  }catch(err){
    modalClose();
    modalError('Gagal memuat', err.message);
  }
}

/* ========= UI helpers ========= */
function hydrateSelect(sel, items, includeFirstAsPlaceholder=false){
  sel.innerHTML=''; items.forEach((v,i)=> sel.appendChild(new Option(v, includeFirstAsPlaceholder && i===0 ? '' : v)));
}
function setupUI(){
  $('monthLabel').textContent = formatMonthLabel(state.year, state.month);
  $('ovMonthLabel').textContent = formatMonthLabel(ov.year, ov.month);

  $('tabTempahanBtn').addEventListener('click', ()=> switchTab('tempahan'));
  $('tabKalendarBtn').addEventListener('click', ()=> switchTab('kalendar'));
  $('tabAdminBtn').addEventListener('click', ()=> switchTab('admin'));

  $('roomSelect').addEventListener('change', onRoomSelectChange);
  $('btnRefresh').addEventListener('click', ()=>{ resetUI(); toastInfo('Antara muka ditetapkan semula'); });
  $('btnBook').addEventListener('click', onBook);
  $('pickedDate').addEventListener('change', onPickedDateChange);
  $('toggleRangeOff').addEventListener('click', ()=>setRangeMode(false));
  $('toggleRangeOn').addEventListener('click', ()=>setRangeMode(true));
  $('fromDate').addEventListener('change', onRangeChange);
  $('toDate').addEventListener('change', onRangeChange);
  $('grid').addEventListener('click', onGridClick);
  $('sektor').addEventListener('change', populateNamaOptions);

  setupMonthNavigator({ stateObj: state, prevBtn:'btnPrev', nextBtn:'btnNext', label:'monthLabel', onShift: ()=>{ if(state.room) refreshMonth(true); } });
  setupMonthNavigator({ stateObj: ov,    prevBtn:'ovPrev', nextBtn:'ovNext', label:'ovMonthLabel', onShift: ()=> loadOverview(true) });

  $('btnViewCalendar').addEventListener('click', ()=>switchOverviewView('calendar'));
  $('btnViewTable').addEventListener('click', ()=>switchOverviewView('table'));

  $('ovRoomFilter').addEventListener('change', ()=>{ ov.filterRoom = $('ovRoomFilter').value; renderOvTable(); });

  $('btnAdminLogin').addEventListener('click', onAdminLogin);
  $('btnAdminLoad').addEventListener('click', loadAdminUpcoming);
  $('btnBulkCancel').addEventListener('click', onBulkCancel);
}
function setupMonthNavigator({ stateObj, prevBtn, nextBtn, label, onShift }) {
  $(prevBtn).addEventListener('click', () => shiftMonth(-1));
  $(nextBtn).addEventListener('click', () => shiftMonth(1));
  function shiftMonth(delta) {
    let y = stateObj.year, m = stateObj.month + delta;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    stateObj.year = y; stateObj.month = m;
    $(label).textContent = formatMonthLabel(y, m);
    onShift();
  }
}
function switchTab(name){
  const map={tempahan:{btn:'tabTempahanBtn',pane:'tabTempahan'},kalendar:{btn:'tabKalendarBtn',pane:'tabKalendar'},admin:{btn:'tabAdminBtn',pane:'tabAdmin'}};
  Object.keys(map).forEach(k=>{ const {btn,pane}=map[k]; $(btn).classList.toggle('active',k===name); $(pane).classList.toggle('active',k===name); });
  if(name==='kalendar' && (!ov.days || !ov.days.length)){ loadOverview(true); }
}
function lockAdmin(){ state.isAdmin=false; ADMIN_PASSWORD=''; $('adminLoginBox').style.display='block'; $('adminPanel').style.display='none'; $('adminWho').textContent='Belum log masuk'; }
function unlockAdmin(){ state.isAdmin=true; $('adminLoginBox').style.display='none'; $('adminPanel').style.display='block'; }
function toggleCalendarHint(){ $('noRoomHint').style.display = state.room ? 'none' : 'block'; }
function populateNamaOptions(){
  const sekVal=$('sektor').value, namaSel=$('nama'); namaSel.innerHTML='';
  const list=NAMA_MENGIKUT_SEKTOR[sekVal];
  if(!sekVal || !list){ namaSel.appendChild(new Option('— Sila pilih sektor dahulu —','')); namaSel.disabled=true; return; }
  namaSel.disabled=false; namaSel.appendChild(new Option('— Pilih nama —','')); list.forEach(n=> namaSel.appendChild(new Option(n,n)));
}
function populateOvRoomFilter(){ const sel=$('ovRoomFilter'); sel.innerHTML='<option value="">— Semua Bilik —</option>'; ROOM_OPTIONS.forEach(r=> sel.appendChild(new Option(r,r))); }

function resetUI(){
  const now=new Date(); state.year=now.getFullYear(); state.month=now.getMonth()+1; $('monthLabel').textContent=formatMonthLabel(state.year,state.month);
  state.days=[]; $('grid').innerHTML=''; document.querySelectorAll('.tile.sel').forEach(el=>el.classList.remove('sel'));
  $('roomSelect').value=''; state.room=''; toggleCalendarHint();
  resetBookingForm(true);
  $('adminRoom').value=''; $('adminList').innerHTML='';
  lockAdmin();
  switchTab('tempahan'); window.scrollTo({top:0,behavior:'smooth'});
}
function resetBookingForm(clearFields){
  setRangeMode(false);
  $('pickedDate').required=true; $('fromDate').required=false; $('toDate').required=false;
  $('rangeCounter').style.display='none'; $('rangeCounter').textContent='';
  if (clearFields){
    ['pickedDate','fromDate','toDate','startTime','endTime','note'].forEach(id => $(id).value='');
    const sek=$('sektor'); if(sek && sek.options.length) sek.selectedIndex=0;
    populateNamaOptions();
  }
  state.selectedDate=null; state.range={from:null,to:null};
}
function setRangeMode(on){
  state.rangeMode=!!on;
  $('toggleRangeOff').classList.toggle('active',!on);
  $('toggleRangeOn').classList.toggle('active',on);
  $('pickedDate').closest('div').style.display = on ? 'none' : 'block';
  $('fromDateWrap').style.display = on ? 'block' : 'none';
  $('toDateWrap').style.display = on ? 'block' : 'none';
  $('rangeCounter').style.display = on ? 'inline-block' : 'none';
  state.selectedDate=null; $('pickedDate').value='';
  state.range={from:null,to:null}; $('fromDate').value=''; $('toDate').value='';
  document.querySelectorAll('#grid .tile.sel').forEach(el=>el.classList.remove('sel'));
  highlightRangeTiles(); updateRangeCounter();
}

/* ========= Kalendar bilik ========= */
function onRoomSelectChange(){ state.room=$('roomSelect').value; resetBookingForm(false); toggleCalendarHint(); if(state.room){ refreshMonth(true); } else { $('grid').innerHTML=''; } }
async function refreshMonth(showLoading){
  if(!state.room){ toggleCalendarHint(); return; }
  if(showLoading) modalLoading('Memuat kalendar...');
  try{
    const res = await getMonthView({ room: state.room, year: state.year, month: state.month });
    state.days = res.days || [];
    renderCalendar(); highlightSelectedTile(); highlightRangeTiles(); updateRangeCounter();
    if(showLoading){ modalClose(); toastOk('Kalendar dikemas kini'); }
  }catch(err){ if(showLoading) modalClose(); modalError('Gagal memuat kalendar', err.message); }
}
// ===== GANTIKAN keseluruhan fungsi renderCalendar() dengan ini =====
function renderCalendar(){
  const grid = $('grid');
  grid.innerHTML = '';

  if (!state.days.length) return;

  // Tarikh hari ini (YYYY-MM-DD)
  const today = todayYMD();

  // Cari index hari pertama yang bukan lampau
  const startIdx = state.days.findIndex(d => d.date >= today);
  if (startIdx === -1) return; // tiada hari masa depan dalam bulan ini

  const daysToRender = state.days.slice(startIdx);

  // Kira offset kosong ikut hari pertama yang dirender, bukan 1hb
  const firstDayToRender = daysToRender[0];
  const weekdayOffset = (new Date(firstDayToRender.date).getDay() + 6) % 7; // 0 = Isnin

  const frag = document.createDocumentFragment();

  for (let i = 0; i < weekdayOffset; i++) {
    const x = document.createElement('div');
    x.className = 'blank';
    frag.appendChild(x);
  }

  for (const dayData of daysToRender) {
    frag.appendChild(buildTile(dayData));
  }

  grid.appendChild(frag);

  // Jika pilihan tarikh sebelum hari ini, kosongkan
  if (state.selectedDate && state.selectedDate < today) {
    state.selectedDate = null;
  }
  highlightSelectedTile();
  highlightRangeTiles();
  updateRangeCounter();
}

function onGridClick(ev){
  const tile = ev.target.closest('.tile'); if(!tile || tile.classList.contains('disabled')) return;
  const dayData = state.days.find(d => d.date === tile.dataset.date);
  if (dayData && dayData.status === 'red') { toastWarn('Bilik ini telah penuh pada tarikh tersebut.'); return; }
  if(state.rangeMode){
    const clickedDate = tile.dataset.date;
    if(!state.range.from){ state.range.from = clickedDate; toastInfo('Tarikh mula dipilih'); }
    else if(!state.range.to){ if(clickedDate < state.range.from){ state.range.to = state.range.from; state.range.from = clickedDate; } else { state.range.to = clickedDate; } toastOk('Julat tarikh ditetapkan'); }
    else { state.range = {from: clickedDate, to: null}; toastInfo('Pilih tarikh akhir'); }
    $('fromDate').value = state.range.from || '';
    $('toDate').value = state.range.to || '';
    highlightRangeTiles(); updateRangeCounter(); onRangeChange();
  } else {
    document.querySelectorAll('#grid .tile.sel').forEach(el=>el.classList.remove('sel'));
    tile.classList.add('sel');
    state.selectedDate=tile.dataset.date;
    $('pickedDate').value=state.selectedDate;
    toastInfo(`Tarikh dipilih: ${state.selectedDate}`);
  }
}
function onPickedDateChange(){
  state.selectedDate = $('pickedDate').value || null;
  if (!state.selectedDate) { highlightSelectedTile(); return; }
  const day = state.days.find(x=>x.date===state.selectedDate);
  if(day && day.status==='red'){ toastWarn('Tarikh ini penuh. Pilih tarikh lain.'); $('pickedDate').value=''; state.selectedDate=null; }
  highlightSelectedTile();
}
function highlightSelectedTile(){
  document.querySelectorAll('#grid .tile.sel').forEach(el=>el.classList.remove('sel'));
  if(!state.selectedDate) return;
  const el=document.querySelector(`#grid .tile[data-date="${state.selectedDate}"]`); if(el) el.classList.add('sel');
}
function highlightRangeTiles(){
  document.querySelectorAll('#grid .tile.range').forEach(el=>el.classList.remove('range'));
  if(!state.range.from || !state.range.to) return;
  let d = state.range.from;
  while (d <= state.range.to){
    const el=document.querySelector(`#grid .tile[data-date="${d}"]`); if(el) el.classList.add('range');
    d = addDaysYMD(d, 1);
  }
}
function onRangeChange(){
  state.range.from=$('fromDate').value||null; state.range.to=$('toDate').value||null;
  if(state.range.from && state.range.to && state.range.from > state.range.to){ toastWarn('Tarikh Dari mesti sebelum atau sama dengan Tarikh Hingga'); }
  highlightRangeTiles(); updateRangeCounter();
}
function updateRangeCounter(){
  if(!state.rangeMode){ $('rangeCounter').textContent=''; return;}
  let d=state.range.from, n=0; if(!state.range.from||!state.range.to){ $('rangeCounter').textContent='Akan ditempah: 0 hari bekerja'; return; }
  while(d<=state.range.to){
    const wk=[0,6].includes(new Date(d+'T00:00:00').getDay());
    const past=d<todayYMD();
    if(!wk && !past) n++;
    d=addDaysYMD(d,1);
  }
  $('rangeCounter').textContent=`Akan ditempah: ${n} hari bekerja`;
}

/* ========= Tempahan ========= */
async function onBook(){
  const inputs = {
    room: $('roomSelect').value, start: $('startTime').value, end: $('endTime').value,
    category: $('category').value, note: $('note').value.trim(), nama: $('nama').value.trim(), sektor: $('sektor').value
  };
  if(!inputs.room){ markInvalid($('roomSelect')); return toastWarn('Sila pilih bilik'); }
  if(!inputs.start){ markInvalid($('startTime')); return toastWarn('Sila pilih masa mula'); }
  if(!inputs.end){ markInvalid($('endTime')); return toastWarn('Sila pilih masa tamat'); }
  if(!inputs.category){ markInvalid($('category')); return toastWarn('Sila pilih kategori'); }
  if(!inputs.note){ markInvalid($('note')); return toastWarn('Isi tujuan / ringkasan'); }
  if(!inputs.sektor){ markInvalid($('sektor')); return toastWarn('Sila pilih sektor'); }
  if(!inputs.nama){ markInvalid($('nama')); return toastWarn('Sila pilih nama penempah'); }

  const ok = await modalConfirm('Sahkan tempahan?', state.rangeMode ? 'Anda akan merekod tempahan berturut mengikut julat tarikh.' : 'Anda akan merekod satu tempahan pada tarikh dipilih.');
  if(!ok) return;

  $('btnBook').disabled = true;
  modalLoading('Menyimpan tempahan...');
  try {
    if (state.rangeMode) {
      const startDate = $('fromDate').value;
      const endDate   = $('toDate').value;
      if (!startDate){ modalClose(); markInvalid($('fromDate')); return toastWarn('Isi Tarikh Dari'); }
      if (!endDate){ modalClose(); markInvalid($('toDate')); return toastWarn('Isi Tarikh Hingga'); }
      const res = await createBookingRange({ ...inputs, startDate, endDate });
      modalClose(); toastOk(`Disimpan: ${res.savedCount||0} hari`); if(res.skipped?.length) toastInfo(`Diabaikan: ${res.skipped.length} hari tidak sah`);
    } else {
      const date = $('pickedDate').value;
      if (!date){ modalClose(); markInvalid($('pickedDate')); return toastWarn('Pilih Tarikh Dipilih'); }
      await createBooking({ ...inputs, date });
      modalClose(); toastOk('Tempahan disimpan');
    }
    if(state.room) await refreshMonth(false);
    await loadOverview(false);
  } catch(err){
    modalClose(); modalError('Gagal menyimpan', err.message);
  } finally {
    $('btnBook').disabled = false;
  }
}

/* ========= Rumusan ========= */
async function loadOverview(showLoading){
  try{
    if(showLoading) modalLoading('Memuat rumusan...');
    const res = await getMonthRoomsOverview({ year: ov.year, month: ov.month });
    ov.days = Array.isArray(res.days) ? res.days : [];
    renderOverview();
    if(showLoading){ modalClose(); toastOk('Rumusan dikemas kini'); }
  }catch(err){ if(showLoading) modalClose(); modalError('Gagal memuat rumusan', err.message); }
}
function switchOverviewView(view){
  ov.view = (view === 'table') ? 'table' : 'calendar';
  $('btnViewCalendar').classList.toggle('active', ov.view==='calendar');
  $('btnViewTable').classList.toggle('active', ov.view==='table');
  $('ovCalendarWrap').style.display = ov.view==='calendar' ? 'block' : 'none';
  $('ovTableWrap').style.display = ov.view==='table' ? 'block' : 'none';
  renderOverview();
}
function renderOverview(){
  if (ov.view === 'calendar') { renderOvCalendar(); renderOvSummary(); }
  else { renderOvTable(); }
}
function renderOvCalendar(){
  const grid = $('ovGrid'); grid.innerHTML='';
  const lastDayOfMonth = new Date(ov.year, ov.month, 0).getDate();
  const firstDow = (new Date(ov.year, ov.month - 1, 1).getDay() + 6) % 7; // 0=Isnin
  for(let i=0;i<firstDow;i++){ const x=document.createElement('div'); x.className='blank'; grid.appendChild(x); }
  const dayMap = new Map((ov.days||[]).map(d => [d.date, d]));
  for(let d=1; d<=lastDayOfMonth; d++){
    const ymd = `${ov.year}-${pad2(ov.month)}-${pad2(d)}`;
    const dayData = dayMap.get(ymd);
    const tile = document.createElement('div'); tile.className = 'tile';
    const top = document.createElement('div'); top.className='date'; top.textContent = d;
    if (dayData && (dayData.counts?.red || dayData.counts?.orange)) {
      const cnt = document.createElement('span'); cnt.className='counts';
      cnt.textContent = `Penuh:${dayData.counts.red||0} | Separa:${dayData.counts.orange||0}`;
      top.appendChild(cnt);
    }
    tile.appendChild(top);
    const body = document.createElement('div'); body.className='body';
    if (dayData?.rooms?.length){
      const list = document.createElement('div'); list.className='listRooms';
      dayData.rooms.forEach(it=>{
        const pill = document.createElement('span'); pill.className = `pill ${it.status}`; pill.textContent = it.room; list.appendChild(pill);
      });
      body.appendChild(list);
    }
    tile.appendChild(body);
    grid.appendChild(tile);
  }
}
function renderOvSummary(){
  const list = $('ovSummaryList'); list.innerHTML='';
  const counter = new Map();
  (ov.days||[]).forEach(d=> (d.rooms||[]).forEach(r=> counter.set(r.room, (counter.get(r.room)||0) + 1)));
  const rows = ROOM_OPTIONS.map(room => [room, counter.get(room)||0]).sort((a,b)=> (b[1]-a[1]) || a[0].localeCompare(a[0],'ms'));
  list.innerHTML = rows.map(([room,c])=> `• ${room} (${c} tempahan)`).join('<br>');
  $('ovSummaryWrap').style.display='block';
}
function renderOvTable(){
  const tbody = $('ovTableBody'); tbody.innerHTML='';
  const rows = []; (ov.days||[]).forEach(d=>{ (d.rooms||[]).forEach(r=> rows.push({date:d.date, room:r.room, status:r.status})); });
  const filtered = ov.filterRoom ? rows.filter(r=>r.room===ov.filterRoom) : rows;
  filtered.sort((a,b)=> a.date.localeCompare(b.date) || (a.status==='red'?-1:1) || a.room.localeCompare(a.room,'ms'));
  const frag=document.createDocumentFragment();
  filtered.forEach(x=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${x.date}</td><td>${x.room}</td><td><span class="tag ${x.status==='red'?'red':'orange'}">${x.status==='red'?'Penuh':'Separa Penuh'}</span></td>`; frag.appendChild(tr); });
  tbody.appendChild(frag);
}

/* ========= Admin ========= */
async function onAdminLogin(){
  const { value: pw } = await Swal.fire({ title:'Kata laluan pentadbir', input:'password', inputPlaceholder:'Masukkan kata laluan', inputAttributes:{autocapitalize:'off',autocorrect:'off'}, confirmButtonText:'Sahkan', showCancelButton:true });
  if (!pw) return;
  modalLoading('Mengesahkan akses...');
  try{
    const chk = await adminCheck(pw); modalClose();
    if (chk?.ok) { ADMIN_PASSWORD = pw; unlockAdmin(); toastOk('Akses pentadbir diaktifkan'); }
    else { Toast.fire({icon:'error', title:'Kata laluan salah'}); }
  }catch(err){ modalClose(); modalError('Gagal log masuk', err.message); }
}
async function loadAdminUpcoming(){
  const room = $('adminRoom').value;
  if(!state.isAdmin){ return toastWarn('Log masuk pentadbir dahulu'); }
  if(!room){ $('adminList').innerHTML='<div class="small">Sila pilih bilik untuk memuatkan senarai tempahan akan datang.</div>'; return; }
  $('adminList').innerHTML='<div class="small">Memuatkan data...</div>';
  try{
    const res = await listUpcomingBookings({ room });
    const items = res.items || [];
    if(!items.length){ $('adminList').innerHTML='<div class="small">Tiada tempahan akan datang untuk bilik ini.</div>'; return; }
    const html = ['<table><thead><tr><th style="width:34px"><input type="checkbox" id="chkAll"></th><th style="width:120px">Tarikh</th><th style="width:120px">Masa</th><th>Bilik</th><th style="width:160px">Kategori</th><th>Tujuan</th><th style="width:160px">Penempah</th></tr></thead><tbody>'];
    for(const it of items){
      html.push(`<tr>
        <td><input type="checkbox" class="chkCancel" data-id="${it.id}"></td>
        <td>${it.date}</td>
        <td>${(it.start||'')+'–'+(it.end||'')}</td>
        <td>${it.room||''}</td>
        <td>${it.category||''}</td>
        <td>${escapeHtml(it.note||'')}</td>
        <td>${escapeHtml(it.nama||'')}<div class="small">${it.sektor||''}</div></td>
      </tr>`);
    }
    html.push('</tbody></table>');
    $('adminList').innerHTML = html.join('');
    $('chkAll').addEventListener('change', e=> document.querySelectorAll('.chkCancel').forEach(cb=> cb.checked=e.target.checked));
    toastOk('Senarai dimuat');
  }catch(err){
    $('adminList').innerHTML='<div class="small" style="color:#dc2626">Gagal memuatkan data.</div>';
    modalError('Ralat memuat senarai', err.message);
  }
}
async function onBulkCancel(){
  if(!state.isAdmin){ return toastWarn('Log masuk pentadbir dahulu'); }
  const checks=[...document.querySelectorAll('.chkCancel:checked')];
  if(!checks.length) return toastInfo('Tiada tempahan dipilih untuk dibatalkan');
  const ids = checks.map(x=>x.dataset.id);
  const { value: reason } = await Swal.fire({ title:'Sebab Pembatalan?', input:'text', inputPlaceholder:'Contoh: Pertindihan acara', showCancelButton:true, inputValidator: v=>!v && 'Sebab pembatalan wajib diisi.' });
  if (!reason) return;
  const ok = await modalConfirm('Sahkan pembatalan?', `Anda akan membatalkan ${ids.length} tempahan terpilih.`); if(!ok) return;
  modalLoading('Melaksanakan pembatalan...');
  try{
    const res = await batalTempahanBulk({ ids, reason, adminPassword: ADMIN_PASSWORD });
    modalClose(); toastOk(`Dibatalkan: ${res.updated} tempahan`);
    await loadAdminUpcoming(); if(state.room) await refreshMonth(false); await loadOverview(false);
  }catch(err){ modalClose(); modalError('Gagal membatalkan', err.message); }
}
