// ============================================================
// CALENDAR DATA & MATH
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
let direction = 'to-standard';

const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabicNumerals(num) { return String(num).replace(/\d/g, d => arabicDigits[d]); }
function localizeNumber(num, calendarType) { if (uiLang === 'ar' && calendarType === 'hijri') return toArabicNumerals(num); return String(num); }

function getEthMonthName(i) { return ethMonths[uiLang === 'am' ? 'am' : 'en'][i]; }
function getEthDayName(dow) { return ethDays[uiLang === 'am' ? 'am' : 'en'][dow]; }
function getHijriMonthName(i) { return hijriMonths[uiLang === 'ar' ? 'ar' : 'en'][i]; }
function getHijriDayName(dow) { return hijriDays[uiLang === 'ar' ? 'ar' : 'en'][dow]; }
function getGregMonthName(i) { return gregMonths[i]; }
function getGregDayName(dow) { return gregDays[dow]; }
function hijriNeedsRTL() { return uiLang === 'ar'; }
function ethNeedsEthiopicFont() { return uiLang === 'am'; }

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
function renderToday() {
  if (!document.getElementById('td-eth')) return;
  const now = new Date();
  const jdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const eth = jdnToEthiopian(jdn), hijri = jdnToHijri(jdn), dow = now.getDay();

  const ethEl = document.getElementById('td-eth');
  if (ethEl) { ethEl.textContent = `${eth.day} ${getEthMonthName(eth.month - 1)} ${eth.year}`; ethEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont()); }
  const ethDayEl = document.getElementById('td-eth-day');
  if (ethDayEl) { ethDayEl.textContent = getEthDayName(dow); ethDayEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont()); }

  const hijriEl = document.getElementById('td-hijri');
  if (hijriEl) { hijriEl.textContent = `${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)} ${localizeNumber(hijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`; hijriEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr'); }
  const hijriDayEl = document.getElementById('td-hijri-day');
  if (hijriDayEl) { hijriDayEl.textContent = getHijriDayName(dow); hijriDayEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr'); }

  const gregEl = document.getElementById('td-greg');
  if (gregEl) { gregEl.textContent = `${getGregMonthName(now.getMonth())} ${now.getDate()}, ${now.getFullYear()}`; }
  const gregDayEl = document.getElementById('td-greg-day');
  if (gregDayEl) { gregDayEl.textContent = getGregDayName(dow); }
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
  if (titleEl) { titleEl.textContent = titleText; titleEl.classList.toggle('ethiopic-text', uiLang === 'am' && gridType === 'ethiopian'); titleEl.setAttribute('dir', (uiLang === 'ar' && gridType === 'hijri') ? 'rtl' : 'ltr'); }

  const corr = getCorrespondingMonths(gridType, gridYear, gridMonth);
  const subEl = document.getElementById('print-month-sub');
  if (subEl) {
    const parts = [];
    if (corr.ethiopian) parts.push(`<div${uiLang === 'am' ? ' class="ethiopic-text"' : ''}>${corr.ethiopian}</div>`);
    if (corr.hijri) parts.push(`<div${uiLang === 'ar' ? ' dir="rtl"' : ''}>${corr.hijri}</div>`);
    if (corr.gregorian) parts.push(`<div>${corr.gregorian}</div>`);
    subEl.innerHTML = parts.join('');
  }

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
  const days = uiLang === 'am' ? ['እ','ሰ','ማ','ረ','ሐ','ዓ','ቅ'] : ['S','M','T','W','T','F','S'];
  days.forEach(d => { const el = document.createElement('div'); el.className = 'day-head'; el.textContent = d; grid.appendChild(el); });

  let startJdn, daysInMonth, firstDow;
  if (calendarType === 'gregorian') { startJdn = gregorianToJDN(year, month, 1); daysInMonth = new Date(year, month, 0).getDate(); firstDow = new Date(year, month - 1, 1).getDay(); }
  else if (calendarType === 'ethiopian') { startJdn = ethiopianToJDN(year, month, 1); daysInMonth = getEthiopianMonthLength(year, month); firstDow = (startJdn + 1) % 7; }
  else { startJdn = hijriToJDN(year, month, 1); daysInMonth = getHijriMonthLength(year, month); firstDow = (startJdn + 1) % 7; }

  const maxDays = calendarType === 'gregorian' ? 31 : 30;
  if (daysInMonth > maxDays) daysInMonth = maxDays; if (daysInMonth < 1) daysInMonth = 1;
  const holidayJdns = new Set(getHolidaysForMonth(calendarType, year, month).map(h => h.date));
  for (let i = 0; i < firstDow; i++) grid.appendChild(document.createElement('div'));

  let dayCounter = 1;
  for (let j = startJdn; dayCounter <= daysInMonth; j++) {
    if (calendarType === 'hijri' && (jdnToHijri(j).year !== year || jdnToHijri(j).month !== month)) { if (jdnToHijri(j).year > year || (jdnToHijri(j).year === year && jdnToHijri(j).month > month)) break; else continue; }
    if (calendarType === 'ethiopian' && (jdnToEthiopian(j).year !== year || jdnToEthiopian(j).month !== month)) { if (jdnToEthiopian(j).year > year || (jdnToEthiopian(j).year === year && jdnToEthiopian(j).month > month)) break; else continue; }

    const data = { gregorian: { prefix: 'G', value: localizeNumber(jdnToGregorian(j).day, 'gregorian') }, hijri: { prefix: 'H', value: localizeNumber(jdnToHijri(j).day, 'hijri') }, ethiopian: { prefix: 'E', value: localizeNumber(jdnToEthiopian(j).day, 'ethiopian') } };
    const order = ['gregorian', 'hijri', 'ethiopian'].filter(k => k !== priority); order.unshift(priority);

    const cell = document.createElement('div'); cell.className = 'day-cell';
    if (j === todayJdn) cell.classList.add('today'); if (holidayJdns.has(j)) cell.classList.add('holiday');
    cell.innerHTML = order.map((key, i) => `<div class="${i === 0 ? 'date-row priority-row' : 'date-row'}"><span class="prefix">${data[key].prefix}</span><span>${data[key].value}</span></div>`).join('');
    if (uiLang === 'am' && calendarType === 'ethiopian') cell.classList.add('ethiopic-text');
    grid.appendChild(cell); dayCounter++;
  }
}
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

    const corr = getCorrespondingMonths(gridType,
