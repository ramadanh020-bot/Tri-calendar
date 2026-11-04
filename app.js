// ============================================================
// CALENDAR DATA
// ============================================================
const ethMonths = { en: ["Meskerem","Tikimt","Hidar","Tahsas","Tir","Yekatit","Megabit","Miazia","Ginbot","Sene","Hamle","Nehase","Pagume"], am: ["መስከረም","ጥቅምት","ኅዳር","ታኅሣሥ","ጥር","የካቲት","መጋቢት","ሚያዝያ","ግንቦት","ሰኔ","ሐምሌ","ነሐሴ","ጳጉሜ"] };
const ethDays = { en: ["Ehud","Sanyo","Maksanyo","Rebu","Hamus","Arb","Kidame"], am: ["እሑድ","ሰኞ","ማክሰኞ","ረቡዕ","ሐሙስ","ዓርብ","ቅዳሜ"] };
const hijriMonths = { en: ["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Shaban","Ramadan","Shawwal","Dhu al-Qadah","Dhu al-Hijjah"], ar: ["مُحَرَّم","صَفَر","رَبيع الأوّل","رَبيع الثّاني","جُمادى الأولى","جُمادى الآخِرة","رَجَب","شَعْبان","رَمَضان","شَوّال","ذو القَعْدة","ذو الحِجّة"] };
const hijriDays = { en: ["Al-Ahad","Al-Ithnayn","Ath-Thulatha","Al-Arba'a","Al-Khamis","Al-Jumu'ah","As-Sabt"], ar: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"] };
const gregMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const gregDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const ethiopianHolidays = [
  { ethMonth: 1, ethDay: 1, name: "Enkutatash (New Year)", nameAm: "እንቁጣጣሽ" },
  { ethMonth: 1, ethDay: 17, name: "Meskel (Finding of True Cross)", nameAm: "መስቀል" },
  { ethMonth: 4, ethDay: 29, name: "Genna (Christmas)", nameAm: "ገና" },
  { ethMonth: 5, ethDay: 11, name: "Timket (Epiphany)", nameAm: "ጥምቀት" },
  { ethMonth: 6, ethDay: 23, name: "Adwa Victory Day", nameAm: "የዓድዋ ድል በዓል" },
  { ethMonth: 8, ethDay: 27, name: "Patriots' Victory Day", nameAm: "የአርበኞች ቀን" },
  { ethMonth: 9, ethDay: 20, name: "Derg Downfall Day", nameAm: "ደርግ የወደቀበት ቀን" },
  { ethMonth: 10, ethDay: 20, name: "National Day", nameAm: "ብሔራዊ ቀን" }
];

const hijriHolidays = [
  { hijriMonth: 1, hijriDay: 1, name: "Islamic New Year", nameAr: "رأس السنة الهجرية" },
  { hijriMonth: 3, hijriDay: 12, name: "Mawlid (Prophet's Birthday)", nameAr: "المولد النبوي" },
  { hijriMonth: 10, hijriDay: 1, name: "Eid al-Fitr", nameAr: "عيد الفطر" },
  { hijriMonth: 12, hijriDay: 10, name: "Eid al-Adha", nameAr: "عيد الأضحى" }
];

let uiLang = 'en';
let priority = 'ethiopian';
let fromCalendar = 'gregorian';

const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabicNumerals(num) { return String(num).replace(/\d/g, d => arabicDigits[d]); }
function localizeNumber(num, calendarType) { return (uiLang === 'ar' && calendarType === 'hijri') ? toArabicNumerals(num) : String(num); }

function getEthMonthName(i) { return ethMonths[uiLang === 'am' ? 'am' : 'en'][i]; }
function getEthDayName(dow) { return ethDays[uiLang === 'am' ? 'am' : 'en'][dow]; }
function getHijriMonthName(i) { return hijriMonths[uiLang === 'ar' ? 'ar' : 'en'][i]; }
function getHijriDayName(dow) { return hijriDays[uiLang === 'ar' ? 'ar' : 'en'][dow]; }
function getGregMonthName(i) { return gregMonths[i]; }
function getGregDayName(dow) { return gregDays[dow]; }
function hijriNeedsRTL() { return uiLang === 'ar'; }
function ethNeedsEthiopicFont() { return uiLang === 'am'; }

// ============================================================
// JDN MATH
// ============================================================
function gregorianToJDN(y, m, d) { const a = Math.floor((14 - m) / 12); const yy = y + 4800 - a; const mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045; }
function jdnToGregorian(jdn) { const a = jdn + 32044; const b = Math.floor((4 * a + 3) / 146097); const c = a - Math.floor(146097 * b / 4); const d = Math.floor((4 * c + 3) / 1461); const e = c - Math.floor(1461 * d / 4); const m = Math.floor((5 * e + 2) / 153); return { day: e - Math.floor((153 * m + 2) / 5) + 1, month: m + 3 - 12 * Math.floor(m / 10), year: 100 * b + d - 4800 + Math.floor(m / 10) }; }
function ethiopianToJDN(y, m, d) { const jdOffset = 1723856; const n = 30 * (m - 1) + d - 1; return jdOffset + 365 + 365 * (y - 1) + Math.floor(y / 4) + n; }
function jdnToEthiopian(jdn) { const jdOffset = 1723856; const r = (jdn - jdOffset) % 1461; const n = (r % 365) + 365 * Math.floor(r / 1460); const year = 4 * Math.floor((jdn - jdOffset) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460); const month = Math.floor(n / 30) + 1; const day = (n % 30) + 1; return { year, month, day }; }

const HIJRI_ANCHOR_YEAR = 1447; const HIJRI_ANCHOR_MONTH = 1; const HIJRI_ANCHOR_DAY = 1; const HIJRI_ANCHOR_JDN = gregorianToJDN(2025, 6, 26);
function isHijriLeapYear(year) { return ((11 * year + 14) % 30) < 11; }
function getHijriMonthDays(year, month) { if (month === 12) return isHijriLeapYear(year) ? 30 : 29; return month % 2 === 1 ? 30 : 29; }
function hijriToJDN(year, month, day) {
  let days = 0;
  if (year >= HIJRI_ANCHOR_YEAR) {
    for (let y = HIJRI_ANCHOR_YEAR; y < year; y++) days += isHijriLeapYear(y) ? 355 : 354;
    for (let m = 1; m < month; m++) days += getHijriMonthDays(year, m);
    days += day - 1;
  } else {
    for (let y = year; y < HIJRI_ANCHOR_YEAR; y++) days -= isHijriLeapYear(y) ? 355 : 354;
    for (let m = 1; m < HIJRI_ANCHOR_MONTH; m++) days -= getHijriMonthDays(HIJRI_ANCHOR_YEAR, m);
    days -= HIJRI_ANCHOR_DAY - 1;
    for (let m = 1; m < month; m++) days += getHijriMonthDays(year, m);
    days += day - 1;
  }
  return HIJRI_ANCHOR_JDN + days;
}
function jdnToHijri(jdn) {
  let diff = jdn - HIJRI_ANCHOR_JDN; let year = HIJRI_ANCHOR_YEAR; let month = HIJRI_ANCHOR_MONTH; let day;
  if (diff >= 0) {
    while (true) { const yearDays = isHijriLeapYear(year) ? 355 : 354; if (diff < yearDays) break; diff -= yearDays; year++; }
    while (true) { const monthDays = getHijriMonthDays(year, month); if (diff < monthDays) break; diff -= monthDays; month++; if (month > 12) { month = 1; year++; } }
    day = diff + 1;
  } else {
    while (diff < 0) { month--; if (month < 1) { month = 12; year--; } const monthDays = getHijriMonthDays(year, month); diff += monthDays; }
    day = diff + 1;
  }
  if (day < 1) day = 1; if (day > 30) day = 30; if (month < 1) month = 1; if (month > 12) month = 12;
  return { year, month, day };
}

function getHijriMonthLength(year, month) { return getHijriMonthDays(year, month); }
function getEthiopianMonthLength(year, month) { return month === 13 ? ((year % 4 === 3) ? 6 : 5) : 30; }

// ============================================================
// EASTER & HOLIDAYS
// ============================================================
function computeOrthodoxEaster(gregYear) {
  const a = gregYear % 4; const b = gregYear % 7; const c = gregYear % 19;
  const d = (19 * c + 15) % 30; const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31); const day = ((d + e + 114) % 31) + 1;
  return jdnToGregorian(gregorianToJDN(gregYear, month, day) + 13);
}

function getHolidaysForMonth(calendarType, year, month) {
  const holidays = []; let startJdn, daysInMonth;
  if (calendarType === 'gregorian') { startJdn = gregorianToJDN(year, month, 1); daysInMonth = new Date(year, month, 0).getDate(); }
  else if (calendarType === 'ethiopian') { startJdn = ethiopianToJDN(year, month, 1); daysInMonth = getEthiopianMonthLength(year, month); }
  else { startJdn = hijriToJDN(year, month, 1); daysInMonth = getHijriMonthLength(year, month); }
  const endJdn = startJdn + daysInMonth - 1;

  const ethYearsInRange = new Set();
  for (let j = startJdn; j <= endJdn; j++) ethYearsInRange.add(jdnToEthiopian(j).year);
  ethYearsInRange.forEach(ethYear => {
    ethiopianHolidays.forEach(h => {
      const hJdn = ethiopianToJDN(ethYear, h.ethMonth, h.ethDay);
      if (hJdn >= startJdn && hJdn <= endJdn) holidays.push({ name: h.name, nameAm: h.nameAm, date: hJdn, type: 'ethiopian' });
    });
  });

  const gregYearsInRange = new Set();
  for (let j = startJdn; j <= endJdn; j++) gregYearsInRange.add(jdnToGregorian(j).year);
  gregYearsInRange.forEach(gy => {
    const easter = computeOrthodoxEaster(gy);
    const easterJdn = gregorianToJDN(easter.year, easter.month, easter.day);
    const goodFridayJdn = easterJdn - 2;
    if (easterJdn >= startJdn && easterJdn <= endJdn) holidays.push({ name: 'Fasika (Easter)', nameAm: 'ፋሲካ', date: easterJdn, type: 'ethiopian' });
    if (goodFridayJdn >= startJdn && goodFridayJdn <= endJdn) holidays.push({ name: 'Siklet (Good Friday)', nameAm: 'ስቅለት', date: goodFridayJdn, type: 'ethiopian' });
  });

  const hijriYearsInRange = new Set();
  for (let j = startJdn; j <= endJdn; j++) hijriYearsInRange.add(jdnToHijri(j).year);
  hijriYearsInRange.forEach(hy => {
    hijriHolidays.forEach(h => {
      const hJdn = hijriToJDN(hy, h.hijriMonth, h.hijriDay);
      if (hJdn >= startJdn && hJdn <= endJdn) holidays.push({ name: h.name, nameAr: h.nameAr, date: hJdn, type: 'hijri' });
    });
  });

  const seen = new Set();
  return holidays.filter(h => { const key = h.date + '|' + h.name; if (seen.has(key)) return false; seen.add(key); return true; }).sort((a, b) => a.date - b.date);
}

function getCorrespondingMonths(calendarType, year, month) {
  let startJdn, daysInMonth;
  if (calendarType === 'gregorian') { startJdn = gregorianToJDN(year, month, 1); daysInMonth = new Date(year, month, 0).getDate(); }
  else if (calendarType === 'ethiopian') { startJdn = ethiopianToJDN(year, month, 1); daysInMonth = getEthiopianMonthLength(year, month); }
  else { startJdn = hijriToJDN(year, month, 1); daysInMonth = getHijriMonthLength(year, month); }
  const endJdn = startJdn + daysInMonth - 1;

  const firstGreg = jdnToGregorian(startJdn), lastGreg = jdnToGregorian(endJdn);
  const firstEth = jdnToEthiopian(startJdn), lastEth = jdnToEthiopian(endJdn);
  const firstHijri = jdnToHijri(startJdn), lastHijri = jdnToHijri(endJdn);
  const result = {};

  if (calendarType === 'gregorian') result.gregorian = null;
  else if (firstGreg.month === lastGreg.month && firstGreg.year === lastGreg.year) result.gregorian = `${getGregMonthName(firstGreg.month - 1)} ${firstGreg.year}`;
  else if (firstGreg.year === lastGreg.year) result.gregorian = `${getGregMonthName(firstGreg.month - 1)} – ${getGregMonthName(lastGreg.month - 1)} ${lastGreg.year}`;
  else result.gregorian = `${getGregMonthName(firstGreg.month - 1)} ${firstGreg.year} – ${getGregMonthName(lastGreg.month - 1)} ${lastGreg.year}`;

  if (calendarType === 'ethiopian') result.ethiopian = null;
  else if (firstEth.month === lastEth.month && firstEth.year === lastEth.year) result.ethiopian = `${getEthMonthName(firstEth.month - 1)} ${firstEth.year} E.C.`;
  else if (firstEth.year === lastEth.year) result.ethiopian = `${getEthMonthName(firstEth.month - 1)} – ${getEthMonthName(lastEth.month - 1)} ${lastEth.year} E.C.`;
  else result.ethiopian = `${getEthMonthName(firstEth.month - 1)} ${firstEth.year} – ${getEthMonthName(lastEth.month - 1)} ${lastEth.year} E.C.`;

  if (calendarType === 'hijri') result.hijri = null;
  else if (firstHijri.month === lastHijri.month && firstHijri.year === lastHijri.year) result.hijri = `${getHijriMonthName(firstHijri.month - 1)} ${localizeNumber(firstHijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`;
  else if (firstHijri.year === lastHijri.year) result.hijri = `${getHijriMonthName(firstHijri.month - 1)} – ${getHijriMonthName(lastHijri.month - 1)} ${localizeNumber(lastHijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`;
  else result.hijri = `${getHijriMonthName(firstHijri.month - 1)} ${localizeNumber(firstHijri.year, 'hijri')} – ${getHijriMonthName(lastHijri.month - 1)} ${localizeNumber(lastHijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`;

  return result;
}

// ============================================================
// TODAY & CONVERTER UI
// ============================================================
function renderToday() {
  if (!document.getElementById('td-eth')) return;
  const now = new Date();
  const jdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const eth = jdnToEthiopian(jdn), hijri = jdnToHijri(jdn), dow = now.getDay();

  const ethEl = document.getElementById('td-eth');
  ethEl.textContent = `${eth.day} ${getEthMonthName(eth.month - 1)} ${eth.year}`;
  ethEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont());

  const ethDayEl = document.getElementById('td-eth-day');
  if (ethDayEl) { ethDayEl.textContent = getEthDayName(dow); ethDayEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont()); }

  const hijriEl = document.getElementById('td-hijri');
  hijriEl.textContent = `${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)} ${localizeNumber(hijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`;
  hijriEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr');

  const hijriDayEl = document.getElementById('td-hijri-day');
  if (hijriDayEl) { hijriDayEl.textContent = getHijriDayName(dow); hijriDayEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr'); }

  const gregEl = document.getElementById('td-greg');
  if (gregEl) { gregEl.textContent = `${getGregMonthName(now.getMonth())} ${now.getDate()}, ${now.getFullYear()}`; }
  
  const gregDayEl = document.getElementById('td-greg-day');
  if (gregDayEl) { gregDayEl.textContent = getGregDayName(dow); }

  updateColumnLabels();
}

function updateColumnLabels() {
  if (!document.querySelector('#today-ethiopian .cal-label')) return;
  const labels = { en: { eth: 'Ethiopian', hijri: 'Hijri', greg: 'Gregorian' }, am: { eth: 'ኢትዮጵያ', hijri: 'Hijri', greg: 'Gregorian' }, ar: { eth: 'Ethiopian', hijri: 'هجري', greg: 'Gregorian' } };
  const L = labels[uiLang];
  document.querySelector('#today-ethiopian .cal-label').textContent = L.eth;
  document.querySelector('#today-hijri .cal-label').textContent = L.hijri;
  document.querySelector('#today-gregorian .cal-label').textContent = L.greg;
}

function populateMonthDropdown() {
  const sel = document.getElementById('conv-month');
  if (!sel) return;
  sel.innerHTML = '';
  let months = fromCalendar === 'gregorian' ? gregMonths : fromCalendar === 'ethiopian' ? ethMonths[uiLang === 'am' ? 'am' : 'en'] : hijriMonths[uiLang === 'ar' ? 'ar' : 'en'];
  months.forEach((m, i) => { const opt = document.createElement('option'); opt.value = i + 1; opt.textContent = m; sel.appendChild(opt); });
}

function convertDate() {
  if (!document.getElementById('conv-day')) return;
  const day = parseInt(document.getElementById('conv-day').value) || 1;
  const month = parseInt(document.getElementById('conv-month').value) || 1;
  const year = parseInt(document.getElementById('conv-year').value) || 2026;

  let jdn = fromCalendar === 'gregorian' ? gregorianToJDN(year, month, day) : fromCalendar === 'ethiopian' ? ethiopianToJDN(year, month, day) : hijriToJDN(year, month, day);
  const greg = jdnToGregorian(jdn), eth = jdnToEthiopian(jdn), hijri = jdnToHijri(jdn);

  const ethEl = document.getElementById('cd-eth');
  if (ethEl) { ethEl.textContent = `${eth.day} ${getEthMonthName(eth.month - 1)} ${eth.year} E.C.`; ethEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont()); }
  const gregEl = document.getElementById('cd-greg');
  if (gregEl) gregEl.textContent = `${getGregMonthName(greg.month - 1)} ${greg.day}, ${greg.year}`;
  const hijriEl = document.getElementById('cd-hijri');
  if (hijriEl) { hijriEl.textContent = `${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)} ${localizeNumber(hijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`; hijriEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr'); }
}

// ============================================================
// PRINTABLE CALENDAR UI
// ============================================================
function getCurrentPeriodForPriority() {
  const now = new Date(), jdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
  if (priority === 'ethiopian') { const eth = jdnToEthiopian(jdn); return { year: eth.year, month: eth.month }; }
  if (priority === 'hijri') { const hijri = jdnToHijri(jdn); return { year: hijri.year, month: hijri.month }; }
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function populatePrintYearDropdown() {
  const sel = document.getElementById('print-year');
  if (!sel) return;
  sel.innerHTML = ''; const current = getCurrentPeriodForPriority();
  for (let y = current.year - 5; y <= current.year + 5; y++) {
    const opt = document.createElement('option'); opt.value = y; opt.textContent = y;
    if (y === current.year) opt.selected = true; sel.appendChild(opt);
  }
  sel.onchange = () => { populatePrintMonthDropdown(true); renderPrintView(); };
}

function populatePrintMonthDropdown(keepMonth) {
  const sel = document.getElementById('print-month');
  if (!sel) return;
  const prevMonth = keepMonth ? sel.value : null; sel.innerHTML = '';
  let months = priority === 'ethiopian' ? ethMonths[uiLang === 'am' ? 'am' : 'en'] : priority === 'hijri' ? hijriMonths[uiLang === 'ar' ? 'ar' : 'en'] : gregMonths;
  const current = getCurrentPeriodForPriority();
  for (let i = 0; i < (priority === 'ethiopian' ? 13 : 12); i++) {
    const opt = document.createElement('option'); opt.value = i + 1; opt.textContent = months[i];
    if (prevMonth && parseInt(prevMonth) === i + 1) opt.selected = true;
    else if (!prevMonth && current.month === i + 1) opt.selected = true;
    sel.appendChild(opt);
  }
  sel.onchange = () => renderPrintView();
}

function renderPrintView() {
  const yearSel = document.getElementById('print-year'), monthSel = document.getElementById('print-month');
  if (!yearSel || !monthSel) return;
  const gridYear = parseInt(yearSel.value), gridMonth = parseInt(monthSel.value);
  if (!gridYear || !gridMonth) return;

  const gridType = priority;
  let titleText = gridType === 'ethiopian' ? `${getEthMonthName(gridMonth - 1)} ${gridYear} E.C.` : gridType === 'hijri' ? `${getHijriMonthName(gridMonth - 1)} ${localizeNumber(gridYear, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}` : `${getGregMonthName(gridMonth - 1)} ${gridYear}`;

  const titleEl = document.getElementById('print-month-title');
  titleEl.textContent = titleText;
  titleEl.classList.toggle('ethiopic-text', uiLang === 'am' && gridType === 'ethiopian');
  titleEl.setAttribute('dir', (uiLang === 'ar' && gridType === 'hijri') ? 'rtl' : 'ltr');

  const corr = getCorrespondingMonths(gridType, gridYear, gridMonth);
  const subEl = document.getElementById('print-month-sub');
  const parts = [];
  if (corr.ethiopian) parts.push(`<div${uiLang === 'am' ? ' class="ethiopic-text"' : ''}>${corr.ethiopian}</div>`);
  if (corr.hijri) parts.push(`<div${uiLang === 'ar' ? ' dir="rtl"' : ''}>${corr.hijri}</div>`);
  if (corr.gregorian) parts.push(`<div>${corr.gregorian}</div>`);
  subEl.innerHTML = parts.join('');

  const now = new Date(), todayJdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
  renderSingleGrid(document.getElementById('print-grid'), gridType, gridYear, gridMonth, todayJdn);
  renderHolidays(gridType, gridYear, gridMonth);
}

function renderHolidays(calendarType, year, month) {
  const listEl = document.getElementById('holiday-list');
  if (!listEl) return;
  const holidays = getHolidaysForMonth(calendarType, year, month);
  if (holidays.length === 0) { listEl.innerHTML = '<li style="color:#94a3b8; justify-content:center;">No public holidays this month</li>'; return; }
  listEl.innerHTML = holidays.map(h => {
    const greg = jdnToGregorian(h.date), eth = jdnToEthiopian(h.date), hijri = jdnToHijri(h.date);
    const dateStr = calendarType === 'ethiopian' ? `${eth.day} ${getEthMonthName(eth.month - 1)}` : calendarType === 'hijri' ? `${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)}` : `${getGregMonthName(greg.month - 1)} ${greg.day}`;
    let name = h.name;
    if (uiLang === 'am' && h.nameAm) name = h.nameAm; else if (uiLang === 'ar' && h.nameAr) name = h.nameAr;
    return `<li><span class="holiday-date">${dateStr}</span><span class="holiday-name">${name}</span><span class="holiday-type">${h.type === 'ethiopian' ? '🇪🇹' : '☪️'}</span></li>`;
  }).join('');
}

function renderSingleGrid(grid, calendarType, year, month, todayJdn) {
  if (!grid) return;
  grid.innerHTML = '';

  // Render Day Headers
  ['S','M','T','W','T','F','S'].forEach(d => { 
    const el = document.createElement('div'); 
    el.className = 'day-head'; 
    el.textContent = d; 
    grid.appendChild(el); 
  });

  let startJdn, daysInMonth, firstDow;
  if (calendarType === 'gregorian') { 
    startJdn = gregorianToJDN(year, month, 1); 
    daysInMonth = new Date(year, month, 0).getDate(); 
    firstDow = new Date(year, month - 1, 1).getDay(); 
  } else if (calendarType === 'ethiopian') { 
    startJdn = ethiopianToJDN(year, month, 1); 
    daysInMonth = getEthiopianMonthLength(year, month); 
    firstDow = (startJdn + 1) % 7; 
  } else { 
    startJdn = hijriToJDN(year, month, 1); 
    daysInMonth = getHijriMonthLength(year, month); 
    firstDow = (startJdn + 1) % 7; 
  }

  const maxDays = calendarType === 'gregorian' ? 31 : 30;
  if (daysInMonth > maxDays) daysInMonth = maxDays; 
  if (daysInMonth < 1) daysInMonth = 1;

  // Get holidays for this month to highlight them
  const holidayJdns = new Set(getHolidaysForMonth(calendarType, year, month).map(h => h.date));

  // Fill empty slots before the 1st of the month
  for (let i = 0; i < firstDow; i++) {
    grid.appendChild(document.createElement('div'));
  }

  // Draw the actual days
  let dayCounter = 1;
  for (let j = startJdn; dayCounter <= daysInMonth; j++) {
    // Safety check to ensure we don't draw days from the next month
    if (calendarType === 'hijri' && (jdnToHijri(j).year !== year || jdnToHijri(j).month !== month)) {
      if (jdnToHijri(j).year > year || (jdnToHijri(j).year === year && jdnToHijri(j).month > month)) break; 
      else continue; 
    }
    if (calendarType === 'ethiopian' && (jdnToEthiopian(j).year !== year || jdnToEthiopian(j).month !== month)) {
      if (jdnToEthiopian(j).year > year || (jdnToEthiopian(j).year === year && jdnToEthiopian(j).month > month)) break; 
      else continue; 
    }

    // Get the day values for all 3 calendars
    const data = { 
      gregorian: { prefix: 'G', value: localizeNumber(jdnToGregorian(j).day, 'gregorian') }, 
      hijri: { prefix: 'H', value: localizeNumber(jdnToHijri(j).day, 'hijri') }, 
      ethiopian: { prefix: 'E', value: localizeNumber(jdnToEthiopian(j).day, 'ethiopian') } 
    };
    
    // Determine the order (which calendar is prioritized)
    const order = ['gregorian', 'hijri', 'ethiopian'].filter(k => k !== priority); 
    order.unshift(priority);

    const cell = document.createElement('div'); 
    cell.className = 'day-cell';
    if (j === todayJdn) cell.classList.add('today'); 
    if (holidayJdns.has(j)) cell.classList.add('holiday');

    cell.innerHTML = order.map((key, i) => 
      `<div class="${i === 0 ? 'date-row priority-row' : 'date-row'}">
         <span class="prefix">${data[key].prefix}</span>
         <span>${data[key].value}</span>
       </div>`
    ).join('');

    if (uiLang === 'am' && calendarType === 'ethiopian') cell.classList.add('ethiopic-text');
    
    grid.appendChild(cell); 
    dayCounter++;
  }
}

// ============================================================
// DAY COUNTER & TIME CONVERTER
// ============================================================
function countDays() {
  const start = document.getElementById('start-date').value, end = document.getElementById('end-date').value;
  if (!start || !end) return;
  const s = new Date(start), e = new Date(end);
  const sjdn = gregorianToJDN(s.getFullYear(), s.getMonth() + 1, s.getDate()), ejdn = gregorianToJDN(e.getFullYear(), e.getMonth() + 1, e.getDate());
  document.getElementById('day-diff').textContent = `${Math.abs(ejdn - sjdn)} days`;
  const ethS = jdnToEthiopian(sjdn), ethE = jdnToEthiopian(ejdn), hijriS = jdnToHijri(sjdn), hijriE = jdnToHijri(ejdn);
  document.getElementById('day-detail').innerHTML =
    `<strong>Start:</strong> ${getGregMonthName(s.getMonth())} ${s.getDate()}, ${s.getFullYear()} · ` +
    `${ethS.day} ${getEthMonthName(ethS.month - 1)} ${ethS.year} E.C. · ` +
    `${hijriS.day} ${getHijriMonthName(hijriS.month - 1)} ${hijriS.year} A.H.<br>` +
    `<strong>End:</strong> ${getGregMonthName(e.getMonth())} ${e.getDate()}, ${e.getFullYear()} · ` +
    `${ethE.day} ${getEthMonthName(ethE.month - 1)} ${ethE.year} E.C. · ` +
    `${hijriE.day} ${getHijriMonthName(hijriE.month - 1)} ${hijriE.year} A.H.`;
  document.getElementById('day-result').style.display = 'block';
}

// ============================================================
// TIME CONVERTER
// ============================================================
let direction = 'to-standard';
function convertTime() {
  const hourInput = document.getElementById('hour-input');
  if (!hourInput) return;

  const hour = parseInt(hourInput.value) || 0;
  const minute = parseInt(document.getElementById('minute-input').value) || 0;
  const period = document.getElementById('period-input').value;
  let result;
  
  if (direction === 'to-standard') {
    let stdHour;
    if (period === 'day') stdHour = (hour === 12) ? 6 : hour + 6;
    else { stdHour = (hour === 12) ? 18 : hour + 18; if (stdHour >= 24) stdHour -= 24; }
    const p = stdHour >= 12 ? 'PM' : 'AM';
    const h12 = stdHour % 12 === 0 ? 12 : stdHour % 12;
    result = `${String(h12).padStart(2,'0')}:${String(minute).padStart(2,'0')} ${p}`;
  } else {
    let ethHour;
    if (period === 'day') { ethHour = (hour === 12) ? 12 : hour - 6; if (ethHour <= 0) ethHour += 12; }
    else { ethHour = (hour === 12) ? 12 : hour - 18; if (ethHour <= 0) ethHour += 12; }
    result = `${String(ethHour).padStart(2,'0')}:${String(minute).padStart(2,'0')} (${period === 'day' ? 'Day' : 'Night'})`;
  }
  document.getElementById('converted-time').textContent = result;
}

// ============================================================
// WORLD CLOCK
// ============================================================
const cities = [
  { name: 'Addis Ababa', tz: 'Africa/Addis_Ababa' }, { name: 'Nairobi', tz: 'Africa/Nairobi' },
  { name: 'Cairo', tz: 'Africa/Cairo' }, { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Mecca', tz: 'Asia/Riyadh' }, { name: 'Istanbul', tz: 'Europe/Istanbul' },
  { name: 'London', tz: 'Europe/London' }, { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'New York', tz: 'America/New_York' }, { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' }, { name: 'Sydney', tz: 'Australia/Sydney' }
];

function renderWorldClock() {
  const grid = document.getElementById('world-grid');
  if (!grid) return; 
  grid.innerHTML = '';
  const now = new Date();
  cities.forEach(city => {
    const timeStr = now.toLocaleTimeString('en-US', { timeZone: city.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-US', { timeZone: city.tz, month: 'short', day: 'numeric', weekday: 'short' });
    const div = document.createElement('div');
    div.className = 'city-card';
    div.innerHTML = `<div class="city">${city.name}</div><div class="time">${timeStr}</div><div class="date">${dateStr}</div>`;
    grid.appendChild(div);
  });
}

// ============================================================
// DOWNLOAD WHOLE YEAR
// ============================================================
function printWholeYear() {
  const yearSel = document.getElementById('print-year');
  if (!yearSel) return;
  const year = parseInt(yearSel.value);

  const priorityLabel = { ethiopian: 'Ethiopian Calendar', hijri: 'Hijri Calendar', gregorian: 'Gregorian Calendar' }[priority];

  const now = new Date();
  const todayJdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());

  let totalMonths = priority === 'ethiopian' ? 13 : 12;
  let html = '';

  for (let m = 1; m <= totalMonths; m++) {
    let titleText, gridYear, gridMonth, gridType;

    if (priority === 'ethiopian') {
      gridType = 'ethiopian'; gridYear = year; gridMonth = m;
      titleText = `${getEthMonthName(m - 1)} ${year} E.C.`;
    } else if (priority === 'hijri') {
      gridType = 'hijri'; gridYear = year; gridMonth = m;
      titleText = `${getHijriMonthName(m - 1)} ${localizeNumber(year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`;
    } else {
      gridType = 'gregorian'; gridYear = year; gridMonth = m;
      titleText = `${getGregMonthName(m - 1)} ${year}`;
    }

    const corr = getCorrespondingMonths(gridType, gridYear, gridMonth);
    let subParts = [];
    if (corr.ethiopian) subParts.push(`<div${uiLang === 'am' ? ' class="ethiopic-text"' : ''}>${corr.ethiopian}</div>`);
    if (corr.hijri) subParts.push(`<div${uiLang === 'ar' ? ' dir="rtl"' : ''}>${corr.hijri}</div>`);
    if (corr.gregorian) subParts.push(`<div>${corr.gregorian}</div>`);

    const holidays = getHolidaysForMonth(gridType, gridYear, gridMonth);
    let holidayHtml = '';
    if (holidays.length > 0) {
      const items = holidays.map(h => {
        const greg = jdnToGregorian(h.date), eth = jdnToEthiopian(h.date), hijri = jdnToHijri(h.date);
        const dateStr = gridType === 'ethiopian' ? `${eth.day} ${getEthMonthName(eth.month - 1)}` : gridType === 'hijri' ? `${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)}` : `${getGregMonthName(greg.month - 1)} ${greg.day}`;
        let name = h.name;
        if (uiLang === 'am' && h.nameAm) name = h.nameAm; else if (uiLang === 'ar' && h.nameAr) name = h.nameAr;
        return `<li><span class="h-date">${dateStr}</span><span class="h-name">${name}</span><span class="h-type">${h.type === 'ethiopian' ? '🇪🇹' : '☪️'}</span></li>`;
      }).join('');
      holidayHtml = `<div class="page-holidays"><ul>${items}</ul></div>`;
    }

    html += `<div class="year-page">`;
    html += `<div class="print-header"><div class="print-brand">Ethio Calendar</div><div class="print-url">ethio-calendar.com</div></div>`;
    html += `<div class="year-title-block"><div class="year-title">${titleText}</div><div class="year-subtitle">${subParts.join('')}</div></div>`;
    html += `<div class="month-grid" id="year-grid-${m}"></div>`;
    html += holidayHtml;
    html += `<div class="print-footer">Ethio Calendar — Ethiopian, Hijri & Gregorian converter · ethio-calendar.com</div>`;
    html += `</div>`;
  }

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Tri-Calendar ${year} — ${priorityLabel}</title>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      @page { size: A4 portrait; margin: 12mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #111; padding: 0; font-size: 11pt; }
      .year-page { page-break-after: always; padding: 0; margin: 0 auto; max-width: 100%; display: flex; flex-direction: column; }
      .year-page:last-child { page-break-after: auto; }
      .print-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #111; padding-bottom: 8px; margin-bottom: 14px; }
      .print-brand { font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: #555; font-weight: 700; }
      .print-url { font-size: 8pt; color: #888; }
      .year-title-block { text-align: center; margin-bottom: 14px; }
      .year-title { font-size: 22pt; font-weight: 800; color: #111; letter-spacing: -0.5px; }
      .year-subtitle { font-size: 10pt; color: #444; margin-top: 4px; line-height: 1.5; }
      .year-subtitle [dir="rtl"] { direction: rtl; font-family: 'Amiri', serif; }
      .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
      .day-head { text-align: center; font-size: 9pt; font-weight: 800; color: #333; padding: 6px 0; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #333; }
      .day-cell { aspect-ratio: 1 / 0.92; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #999; padding: 4px 3px; line-height: 1.15; gap: 2px; background: #fff; }
      .day-cell.today { background: #eaf3fb; border: 2.5px solid #2c5282; }
      .day-cell.holiday { background: #fdf0ee; border: 2px solid #c53030; }
      .date-row { display: flex; align-items: baseline; gap: 4px; font-size: 8pt; color: #555; }
      .date-row .prefix { font-size: 6pt; font-weight: 800; color: #999; min-width: 14px; }
      .date-row.priority-row { font-size: 14pt; font-weight: 900; color: #111; margin-bottom: 2px; }
      .date-row.priority-row .prefix { font-size: 7pt; color: #333; }
      .page-holidays { margin-top: 20px; padding-top: 12px; border-top: 2px solid #333; }
      .page-holidays ul { list-style: none; padding: 0; }
      .page-holidays li { font-size: 10pt; color: #222; padding: 6px 0; border-bottom: 1px dotted #bbb; display: flex; align-items: baseline; }
      .page-holidays li:last-child { border-bottom: none; }
      .page-holidays .h-date { font-weight: 800; color: #111; min-width: 110px; }
      .page-holidays .h-name { flex: 1; color: #222; padding-left: 8px; }
      .print-footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #ccc; font-size: 8pt; color: #888; text-align: center; font-style: italic; }
      .ethiopic-text { font-family: 'Noto Sans Ethiopic', sans-serif; }
      [dir="rtl"] { direction: rtl; font-family: 'Amiri', serif; }
      @media print { .year-page { page-break-after: always; } body { padding: 0; } .day-cell, .day-cell.today, .day-cell.holiday { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style></head><body>${html}</body></html>`);
  w.document.close();

  setTimeout(() => {
    for (let m = 1; m <= totalMonths; m++) {
      let gridYear, gridMonth, gridType;
      if (priority === 'ethiopian') { gridType = 'ethiopian'; gridYear = year; gridMonth = m; }
      else if (priority === 'hijri') { gridType = 'hijri'; gridYear = year; gridMonth = m; }
      else { gridType = 'gregorian'; gridYear = year; gridMonth = m; }
      renderGridInWindow(w, `year-grid-${m}`, gridType, gridYear, gridMonth, todayJdn);
    }
    setTimeout(() => w.print(), 700);
  }, 700);
}

function renderGridInWindow(win, gridId, calendarType, year, month, todayJdn) {
  const grid = win.document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';

  ['S','M','T','W','T','F','S'].forEach(d => { const el = win.document.createElement('div'); el.className = 'day-head'; el.textContent = d; grid.appendChild(el); });

  let startJdn, daysInMonth, firstDow;
  if (calendarType === 'gregorian') { startJdn = gregorianToJDN(year, month, 1); daysInMonth = new Date(year, month, 0).getDate(); firstDow = new Date(year, month - 1, 1).getDay(); }
  else if (calendarType === 'ethiopian') { startJdn = ethiopianToJDN(year, month, 1); daysInMonth = getEthiopianMonthLength(year, month); firstDow = (startJdn + 1) % 7; }
  else { startJdn = hijriToJDN(year, month, 1); daysInMonth = getHijriMonthLength(year, month); firstDow = (startJdn + 1) % 7; }

  const maxDays = calendarType === 'gregorian' ? 31 : 30;
  if (daysInMonth > maxDays) daysInMonth = maxDays; if (daysInMonth < 1) daysInMonth = 1;

  const holidayJdns = new Set(getHolidaysForMonth(calendarType, year, month).map(h => h.date));
  for (let i = 0; i < firstDow; i++) grid.appendChild(win.document.createElement('div'));

  let dayCounter = 1;
  for (let j = startJdn; dayCounter <= daysInMonth; j++) {
    if (calendarType === 'hijri' && jdnToHijri(j).year !== year || jdnToHijri(j).month !== month) { if (jdnToHijri(j).year > year || (jdnToHijri(j).year === year && jdnToHijri(j).month > month)) break; else continue; }
    if (calendarType === 'ethiopian' && jdnToEthiopian(j).year !== year || jdnToEthiopian(j).month !== month) { if (jdnToEthiopian(j).year > year || (jdnToEthiopian(j).year === year && jdnToEthiopian(j).month > month)) break; else continue; }

    const data = { gregorian: { prefix: 'G', value: localizeNumber(jdnToGregorian(j).day, 'gregorian') }, hijri: { prefix: 'H', value: localizeNumber(jdnToHijri(j).day, 'hijri') }, ethiopian: { prefix: 'E', value: localizeNumber(jdnToEthiopian(j).day, 'ethiopian') } };
    const order = ['gregorian', 'hijri', 'ethiopian'].filter(k => k !== priority); order.unshift(priority);

    const cell = win.document.createElement('div'); cell.className = 'day-cell';
    if (j === todayJdn) cell.classList.add('today'); if (holidayJdns.has(j)) cell.classList.add('holiday');
    cell.innerHTML = order.map((key, i) => `<div class="${i === 0 ? 'date-row priority-row' : 'date-row'}"><span class="prefix">${data[key].prefix}</span><span>${data[key].value}</span></div>`).join('');
    if (uiLang === 'am' && calendarType === 'ethiopian') cell.classList.add('ethiopic-text');
    grid.appendChild(cell); dayCounter++;
  }
}

// ============================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', function() {
        langToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        uiLang = this.dataset.lang;
        renderToday();
        populateMonthDropdown();
        convertDate();
        if (document.getElementById('print-year')) { populatePrintYearDropdown(); populatePrintMonthDropdown(); renderPrintView(); }
      });
    });
  }

  const fromToggle = document.getElementById('from-toggle');
  if (fromToggle) {
    fromToggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', function() {
        fromToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        fromCalendar = this.dataset.from;
        populateMonthDropdown();
        const yearInput = document.getElementById('conv-year');
        const dayInput = document.getElementById('conv-day');
        if (fromCalendar === 'gregorian') { yearInput.value = 2026; dayInput.max = 31; }
        else if (fromCalendar === 'ethiopian') { yearInput.value = 2018; dayInput.max = 30; }
        else { yearInput.value = 1447; dayInput.max = 30; }
      });
    });
  }

  const priorityToggle = document.getElementById('priority-toggle');
  if (priorityToggle) {
    priorityToggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', function() {
        priorityToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        priority = this.dataset.priority;
        populatePrintYearDropdown();
        populatePrintMonthDropdown();
        renderPrintView();
      });
    });
  }

  const dirToggle = document.getElementById('direction-toggle');
  if (dirToggle) {
    dirToggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', function() {
        dirToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        direction = this.dataset.dir;
        document.getElementById('period-label').textContent = direction === 'to-standard' ? 'Period (Ethiopian)' : 'Period (Standard)';
        convertTime();
      });
    });
    document.getElementById('hour-input').addEventListener('input', convertTime);
    document.getElementById('minute-input').addEventListener('input', convertTime);
    document.getElementById('period-input').addEventListener('change', convertTime);
  }

  populateMonthDropdown();
  renderToday();
  convertDate();
  convertTime();

  if (document.getElementById('print-year')) {
    populatePrintYearDropdown();
    populatePrintMonthDropdown();
    renderPrintView();
  }

  const startField = document.getElementById('start-date');
  if (startField) {
    const today = new Date();
    startField.value = today.toISOString().split('T')[0];
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    document.getElementById('end-date').value = nextMonth.toISOString().split('T')[0];
  }

  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  renderWorldClock();
  setInterval(renderWorldClock, 1000);
});
