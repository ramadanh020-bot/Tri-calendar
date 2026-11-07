// ============================================================
// CALENDAR DATA & CONSTANTS
// ============================================================
const ethMonths = {
en: ["Meskerem","Tikimt","Hidar","Tahsas","Tir","Yekatit","Megabit","Miazia","Ginbot","Sene","Hamle","Nehase","Pagume"],
am: ["መስከረም","ጥቅምት","ኅዳር","ታኅሣሥ","ጥር","የካቲት","መጋቢት","ሚያዝያ","ግንቦት","ሰኔ","ሐምሌ","ነሐሴ","ጳጉሜ"]
};

const ethDays = {
en: ["Ehud","Sanyo","Maksanyo","Rebu","Hamus","Arb","Kidame"],
am: ["እሑድ","ሰኞ","ማክሰኞ","ረቡዕ","ሐሙስ","ዓርብ","ቅዳሜ"]
};

const hijriMonths = {
en: ["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Shaban","Ramadan","Shawwal","Dhu al-Qadah","Dhu al-Hijjah"],
ar: ["مُحَرَّم","صَفَر","رَبيع الأوّل","رَبيع الثّاني","جُمادى الأولى","جُمادى الآخِرة","رَجَب","شَعْبان","رَمَضان","شَوّال","ذو القَعْدة","ذو الحِجّة"]
};

const hijriDays = {
en: ["Al-Ahad","Al-Ithnayn","Ath-Thulatha","Al-Arba'a","Al-Khamis","Al-Jumu'ah","As-Sabt"],
ar: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبት"]
};

const gregMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const gregDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const ethiopianHolidays = [
{ ethMonth: 1, ethDay: 1, name: "Enkutatash (Ethiopian New Year)", nameAm: "እንቁጣጣሽ" },
{ ethMonth: 1, ethDay: 17, name: "Meskel (Finding of True Cross)", nameAm: "መስቀል" },
{ ethMonth: 4, ethDay: 29, name: "Genna (Ethiopian Christmas)", nameAm: "ገና" },
{ ethMonth: 5, ethDay: 11, name: "Timket (Epiphany)", nameAm: "ጥምቀት" },
{ ethMonth: 6, ethDay: 23, name: "Adwa Victory Day", nameAm: "የዓድዋ ድል በዓል" },
{ ethMonth: 8, ethDay: 27, name: "Patriots' Victory Day", nameAm: "የአርበኞች ቀን" },
{ ethMonth: 9, ethDay: 20, name: "Derg Downfall Day", nameAm: "ደርግ የወደቀበት ቀን" },
{ ethMonth: 10, ethDay: 20, name: "National Day", nameAm: "ብሔራዊ ቀን" }
];

const hijriHolidays = [
{ hijriMonth: 1, hijriDay: 1, name: "Islamic New Year (Hijri)", nameAr: "رأس السنة الهجرية" },
{ hijriMonth: 3, hijriDay: 12, name: "Mawlid (Prophet's Birthday)", nameAr: "المولد النبوي الشريف" },
{ hijriMonth: 10, hijriDay: 1, name: "Eid al-Fitr", nameAr: "عيد الفطر المبارك" },
{ hijriMonth: 12, hijriDay: 10, name: "Eid al-Adha", nameAr: "عيد الأضحى المبارك" }
];

const cities = [
{ name: 'Addis Ababa', tz: 'Africa/Addis_Ababa' },
{ name: 'Nairobi', tz: 'Africa/Nairobi' },
{ name: 'Cairo', tz: 'Africa/Cairo' },
{ name: 'Dubai', tz: 'Asia/Dubai' },
{ name: 'Mecca', tz: 'Asia/Riyadh' },
{ name: 'Istanbul', tz: 'Europe/Istanbul' },
{ name: 'London', tz: 'Europe/London' },
{ name: 'Paris', tz: 'Europe/Paris' },
{ name: 'New York', tz: 'America/New_York' },
{ name: 'Los Angeles', tz: 'America/Los_Angeles' },
{ name: 'Tokyo', tz: 'Asia/Tokyo' },
{ name: 'Sydney', tz: 'Australia/Sydney' }
];

let uiLang = 'en';
let priority = 'ethiopian';
let fromCalendar = 'gregorian';
let direction = 'to-standard';

// ============================================================
// NUMERALS & LOCALIZATION HELPERS
// ============================================================
const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabicNumerals(num) {
return String(num).replace(/\d/g, d => arabicDigits[d]);
}

function localizeNumber(num, calendarType) {
return (uiLang === 'ar' && calendarType === 'hijri') ? toArabicNumerals(num) : String(num);
}

function getEthMonthName(i) { return ethMonths[uiLang === 'am' ? 'am' : 'en'][i]; }
function getEthDayName(dow) { return ethDays[uiLang === 'am' ? 'am' : 'en'][dow]; }
function getHijriMonthName(i) { return hijriMonths[uiLang === 'ar' ? 'ar' : 'en'][i]; }
function getHijriDayName(dow) { return hijriDays[uiLang === 'ar' ? 'ar' : 'en'][dow]; }
function getGregMonthName(i) { return gregMonths[i]; }
function getGregDayName(dow) { return gregDays[dow]; }

function hijriNeedsRTL() { return uiLang === 'ar'; }
function ethNeedsEthiopicFont() { return uiLang === 'am'; }

// ============================================================
// JDN CALENDAR CONVERSION LOGIC
// ============================================================
function gregorianToJDN(y, m, d) {
const a = Math.floor((14 - m) / 12);
const yy = y + 4800 - a;
const mm = m + 12 * a - 3;
return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function jdnToGregorian(jdn) {
const a = jdn + 32044;
const b = Math.floor((4 * a + 3) / 146097);
const c = a - Math.floor(146097 * b / 4);
const d = Math.floor((4 * c + 3) / 1461);
const e = c - Math.floor(1461 * d / 4);
const m = Math.floor((5 * e + 2) / 153);
return {
day: e - Math.floor((153 * m + 2) / 5) + 1,
month: m + 3 - 12 * Math.floor(m / 10),
year: 100 * b + d - 4800 + Math.floor(m / 10)
};
}

function ethiopianToJDN(y, m, d) {
const jdOffset = 1723856;
const n = 30 * (m - 1) + d - 1;
return jdOffset + 365 + 365 * (y - 1) + Math.floor(y / 4) + n;
}

function jdnToEthiopian(jdn) {
const jdOffset = 1723856;
const r = (jdn - jdOffset) % 1461;
const n = (r % 365) + 365 * Math.floor(r / 1460);
const year = 4 * Math.floor((jdn - jdOffset) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
const month = Math.floor(n / 30) + 1;
const day = (n % 30) + 1;
return { year, month, day };
}

const HIJRI_ANCHOR_YEAR = 1447;
const HIJRI_ANCHOR_MONTH = 1;
const HIJRI_ANCHOR_DAY = 1;
const HIJRI_ANCHOR_JDN = gregorianToJDN(2025, 6, 26);

function isHijriLeapYear(year) {
return ((11 * year + 14) % 30) < 11;
}

function getHijriMonthDays(year, month) {
if (month === 12) return isHijriLeapYear(year) ? 30 : 29;
return month % 2 === 1 ? 30 : 29;
}

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
let diff = jdn - HIJRI_ANCHOR_JDN;
let year = HIJRI_ANCHOR_YEAR;
let month = HIJRI_ANCHOR_MONTH;
let day;
if (diff >= 0) {
while (true) {
const yearDays = isHijriLeapYear(year) ? 355 : 354;
if (diff < yearDays) break;
diff -= yearDays;
year++;
}
while (true) {
const monthDays = getHijriMonthDays(year, month);
if (diff < monthDays) break;
diff -= monthDays;
month++;
if (month > 12) { month = 1; year++; }
}
day = diff + 1;
} else {
while (diff < 0) {
month--;
if (month < 1) { month = 12; year--; }
const monthDays = getHijriMonthDays(year, month);
diff += monthDays;
}
day = diff + 1;
}
if (day < 1) day = 1;
if (day > 30) day = 30;
if (month < 1) month = 1;
if (month > 12) month = 12;
return { year, month, day };
}

function getHijriMonthLength(year, month) { return getHijriMonthDays(year, month); }
function getEthiopianMonthLength(year, month) { return month === 13 ? ((year % 4 === 3) ? 6 : 5) : 30; }

// ============================================================
// HOLIDAYS & COMPUTATION
// ============================================================
function computeOrthodoxEaster(gregYear) {
const a = gregYear % 4;
const b = gregYear % 7;
const c = gregYear % 19;
const d = (19 * c + 15) % 30;
const e = (2 * a + 4 * b - d + 34) % 7;
const month = Math.floor((d + e + 114) / 31);
const day = ((d + e + 114) % 31) + 1;
return jdnToGregorian(gregorianToJDN(gregYear, month, day) + 13);
}

function getHolidaysForMonth(calendarType, year, month) {
const holidays = [];
let startJdn, daysInMonth;

if (calendarType === 'gregorian') {
startJdn = gregorianToJDN(year, month, 1);
daysInMonth = new Date(year, month, 0).getDate();
} else if (calendarType === 'ethiopian') {
startJdn = ethiopianToJDN(year, month, 1);
daysInMonth = getEthiopianMonthLength(year, month);
} else {
startJdn = hijriToJDN(year, month, 1);
daysInMonth = getHijriMonthLength(year, month);
}
const endJdn = startJdn + daysInMonth - 1;

const ethYearsInRange = new Set();
for (let j = startJdn; j <= endJdn; j++) ethYearsInRange.add(jdnToEthiopian(j).year);
ethYearsInRange.forEach(ethYear => {
ethiopianHolidays.forEach(h => {
const hJdn = ethiopianToJDN(ethYear, h.ethMonth, h.ethDay);
if (hJdn >= startJdn && hJdn <= endJdn) {
holidays.push({ name: h.name, nameAm: h.nameAm, date: hJdn, type: 'ethiopian' });
}
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
if (hJdn >= startJdn && hJdn <= endJdn) {
holidays.push({ name: h.name, nameAr: h.nameAr, date: hJdn, type: 'hijri' });
}
});
});

const seen = new Set();
return holidays.filter(h => {
const key = h.date + '|' + h.name;
if (seen.has(key)) return false;
seen.add(key);
return true;
}).sort((a, b) => a.date - b.date);
}

function getCorrespondingMonths(calendarType, year, month) {
let startJdn, daysInMonth;
if (calendarType === 'gregorian') {
startJdn = gregorianToJDN(year, month, 1);
daysInMonth = new Date(year, month, 0).getDate();
} else if (calendarType === 'ethiopian') {
startJdn = ethiopianToJDN(year, month, 1);
daysInMonth = getEthiopianMonthLength(year, month);
} else {
startJdn = hijriToJDN(year, month, 1);
daysInMonth = getHijriMonthLength(year, month);
}
const endJdn = startJdn + daysInMonth - 1;

const firstGreg = jdnToGregorian(startJdn), lastGreg = jdnToGregorian(endJdn);
const firstEth = jdnToEthiopian(startJdn), lastEth = jdnToEthiopian(endJdn);
const firstHijri = jdnToHijri(startJdn), lastHijri = jdnToHijri(endJdn);
const result = {};

if (calendarType === 'gregorian') result.gregorian = null;
else if (firstGreg.month === lastGreg.month && firstGreg.year === lastGreg.year) result.gregorian = ${getGregMonthName(firstGreg.month - 1)} ${firstGreg.year};
else if (firstGreg.year === lastGreg.year) result.gregorian = ${getGregMonthName(firstGreg.month - 1)} – ${getGregMonthName(lastGreg.month - 1)} ${lastGreg.year};
else result.gregorian = ${getGregMonthName(firstGreg.month - 1)} ${firstGreg.year} – ${getGregMonthName(lastGreg.month - 1)} ${lastGreg.year};

if (calendarType === 'ethiopian') result.ethiopian = null;
else if (firstEth.month === lastEth.month && firstEth.year === lastEth.year) result.ethiopian = ${getEthMonthName(firstEth.month - 1)} ${firstEth.year} E.C.;
else if (firstEth.year === lastEth.year) result.ethiopian = ${getEthMonthName(firstEth.month - 1)} – ${getEthMonthName(lastEth.month - 1)} ${lastEth.year} E.C.;
else result.ethiopian = ${getEthMonthName(firstEth.month - 1)} ${firstEth.year} – ${getEthMonthName(lastEth.month - 1)} ${lastEth.year} E.C.;

if (calendarType === 'hijri') result.hijri = null;
else if (firstHijri.month === lastHijri.month && firstHijri.year === lastHijri.year) result.hijri = ${getHijriMonthName(firstHijri.month - 1)} ${localizeNumber(firstHijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'};
else if (firstHijri.year === lastHijri.year) result.hijri = ${getHijriMonthName(firstHijri.month - 1)} – ${getHijriMonthName(lastHijri.month - 1)} ${localizeNumber(lastHijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'};
else result.hijri = ${getHijriMonthName(firstHijri.month - 1)} ${localizeNumber(firstHijri.year, 'hijri')} – ${getHijriMonthName(lastHijri.month - 1)} ${localizeNumber(lastHijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'};

return result;
}

// ============================================================
// UI RENDERING: TODAY & CONVERTERS
// ============================================================
function updateColumnLabels() {
const ethHeader = document.querySelector('#today-ethiopian .cal-label');
const hijriHeader = document.querySelector('#today-hijri .cal-label');
const gregHeader = document.querySelector('#today-gregorian .cal-label');
if (!ethHeader && !hijriHeader && !gregHeader) return;

const labels = {
en: { eth: 'Ethiopian', hijri: 'Hijri', greg: 'Gregorian' },
am: { eth: 'ኢትዮጵያ', hijri: 'Hijri', greg: 'Gregorian' },
ar: { eth: 'Ethiopian', hijri: 'هجري', greg: 'Gregorian' }
};
const L = labels[uiLang] || labels.en;
if (ethHeader) ethHeader.textContent = L.eth;
if (hijriHeader) hijriHeader.textContent = L.hijri;
if (gregHeader) gregHeader.textContent = L.greg;
}

function renderToday() {
if (!document.getElementById('td-eth')) return;
const now = new Date();
const jdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
const eth = jdnToEthiopian(jdn), hijri = jdnToHijri(jdn), dow = now.getDay();

const ethEl = document.getElementById('td-eth');
if (ethEl) {
ethEl.textContent = ${eth.day} ${getEthMonthName(eth.month - 1)} ${eth.year};
ethEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont());
}

const ethDayEl = document.getElementById('td-eth-day');
if (ethDayEl) {
ethDayEl.textContent = getEthDayName(dow);
ethDayEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont());
}

const hijriEl = document.getElementById('td-hijri');
if (hijriEl) {
hijriEl.textContent = ${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)} ${localizeNumber(hijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'};
hijriEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr');
}

const hijriDayEl = document.getElementById('td-hijri-day');
if (hijriDayEl) {
hijriDayEl.textContent = getHijriDayName(dow);
hijriDayEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr');
}

const gregEl = document.getElementById('td-greg');
if (gregEl) gregEl.textContent = ${getGregMonthName(now.getMonth())} ${now.getDate()}, ${now.getFullYear()};

const gregDayEl = document.getElementById('td-greg-day');
if (gregDayEl) gregDayEl.textContent = getGregDayName(dow);

updateColumnLabels();
}

function populateMonthDropdown() {
const sel = document.getElementById('conv-month');
if (!sel) return;
sel.innerHTML = '';
let months = fromCalendar === 'gregorian' ? gregMonths : fromCalendar === 'ethiopian' ? ethMonths[uiLang === 'am' ? 'am' : 'en'] : hijriMonths[uiLang === 'ar' ? 'ar' : 'en'];
months.forEach((m, i) => {
const opt = document.createElement('option');
opt.value = i + 1;
opt.textContent = m;
sel.appendChild(opt);
});
}

function convertDate() {
if (!document.getElementById('conv-day')) return;
const day = parseInt(document.getElementById('conv-day').value) || 1;
const month = parseInt(document.getElementById('conv-month').value) || 1;
const year = parseInt(document.getElementById('conv-year').value) || 2026;

let jdn = fromCalendar === 'gregorian' ? gregorianToJDN(year, month, day) : fromCalendar === 'ethiopian' ? ethiopianToJDN(year, month, day) : hijriToJDN(year, month, day);
const greg = jdnToGregorian(jdn), eth = jdnToEthiopian(jdn), hijri = jdnToHijri(jdn);

const ethEl = document.getElementById('cd-eth');
if (ethEl) {
ethEl.textContent = ${eth.day} ${getEthMonthName(eth.month - 1)} ${eth.year} E.C.;
ethEl.classList.toggle('ethiopic-text', ethNeedsEthiopicFont());
}

const gregEl = document.getElementById('cd-greg');
if (gregEl) gregEl.textContent = ${getGregMonthName(greg.month - 1)} ${greg.day}, ${greg.year};

const hijriEl = document.getElementById('cd-hijri');
if (hijriEl) {
hijriEl.textContent = ${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)} ${localizeNumber(hijri.year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'};
hijriEl.setAttribute('dir', hijriNeedsRTL() ? 'rtl' : 'ltr');
}
}

// ============================================================
// UI RENDERING: INTERACTIVE ON-SCREEN PRINT VIEW
// ============================================================
function getCurrentPeriodForPriority() {
const now = new Date(), jdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
if (priority === 'ethiopian') {
const eth = jdnToEthiopian(jdn);
return { year: eth.year, month: eth.month };
}
if (priority === 'hijri') {
const hijri = jdnToHijri(jdn);
return { year: hijri.year, month: hijri.month };
}
return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function populatePrintYearDropdown() {
const sel = document.getElementById('print-year');
if (!sel) return;
sel.innerHTML = '';
const current = getCurrentPeriodForPriority();
for (let y = current.year - 5; y <= current.year + 5; y++) {
const opt = document.createElement('option');
opt.value = y;
opt.textContent = y;
if (y === current.year) opt.selected = true;
sel.appendChild(opt);
}
sel.onchange = () => {
populatePrintMonthDropdown(true);
renderPrintView();
};
}

function populatePrintMonthDropdown(keepMonth) {
const sel = document.getElementById('print-month');
if (!sel) return;
const prevMonth = keepMonth ? sel.value : null;
sel.innerHTML = '';
let months = priority === 'ethiopian' ? ethMonths[uiLang === 'am' ? 'am' : 'en'] : priority === 'hijri' ? hijriMonths[uiLang === 'ar' ? 'ar' : 'en'] : gregMonths;
const current = getCurrentPeriodForPriority();
const count = priority === 'ethiopian' ? 13 : 12;

for (let i = 0; i < count; i++) {
const opt = document.createElement('option');
opt.value = i + 1;
opt.textContent = months[i];
if (prevMonth && parseInt(prevMonth) === i + 1) opt.selected = true;
else if (!prevMonth && current.month === i + 1) opt.selected = true;
sel.appendChild(opt);
}
sel.onchange = () => renderPrintView();
}

function renderPrintView() {
const yearSel = document.getElementById('print-year');
const monthSel = document.getElementById('print-month');
if (!yearSel || !monthSel) return;

const gridYear = parseInt(yearSel.value);
const gridMonth = parseInt(monthSel.value);
if (!gridYear || !gridMonth) return;

const gridType = priority;
let titleText = gridType === 'ethiopian'
? ${getEthMonthName(gridMonth - 1)} ${gridYear} E.C.
: gridType === 'hijri'
? ${getHijriMonthName(gridMonth - 1)} ${localizeNumber(gridYear, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}
: ${getGregMonthName(gridMonth - 1)} ${gridYear};

const titleEl = document.getElementById('print-month-title');
if (titleEl) {
titleEl.textContent = titleText;
titleEl.classList.toggle('ethiopic-text', uiLang === 'am' && gridType === 'ethiopian');
titleEl.setAttribute('dir', (uiLang === 'ar' && gridType === 'hijri') ? 'rtl' : 'ltr');
}

const corr = getCorrespondingMonths(gridType, gridYear, gridMonth);
const subEl = document.getElementById('print-month-sub');
if (subEl) {
const parts = [];
if (corr.ethiopian) parts.push(<span class="corr-item${uiLang === 'am' ? ' ethiopic-text' : ''}">Ethiopian: ${corr.ethiopian}</span>);
if (corr.hijri) parts.push(<span class="corr-item"${uiLang === 'ar' ? ' dir="rtl"' : ''}>Hijri: ${corr.hijri}</span>);
if (corr.gregorian) parts.push(<span class="corr-item">Gregorian: ${corr.gregorian}</span>);
subEl.innerHTML = parts.join('•');
}

const now = new Date();
const todayJdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());
renderSingleGrid(document.getElementById('print-grid'), gridType, gridYear, gridMonth, todayJdn);
renderHolidays(gridType, gridYear, gridMonth);
}

function renderHolidays(calendarType, year, month) {
const listEl = document.getElementById('holiday-list');
if (!listEl) return;
const holidays = getHolidaysForMonth(calendarType, year, month);
if (holidays.length === 0) {
listEl.innerHTML = 'No official public holidays recorded for this month.';
return;
}
listEl.innerHTML = holidays.map(h => {
const greg = jdnToGregorian(h.date), eth = jdnToEthiopian(h.date), hijri = jdnToHijri(h.date);
const dateStr = calendarType === 'ethiopian' ? ${eth.day} ${getEthMonthName(eth.month - 1)} : calendarType === 'hijri' ? ${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)} : ${getGregMonthName(greg.month - 1)} ${greg.day};
let name = h.name;
if (uiLang === 'am' && h.nameAm) name = h.nameAm;
else if (uiLang === 'ar' && h.nameAr) name = h.nameAr;
const badge = h.type === 'ethiopian' ? 'ET' : 'HIJ';
return <li><span class="holiday-date">${dateStr}</span><span class="holiday-name">${name}</span><span class="holiday-type badge-${h.type}">${badge}</span></li>;
}).join('');
}

function renderSingleGrid(grid, calendarType, year, month, todayJdn) {
if (!grid) return;
grid.innerHTML = '';
const days = uiLang === 'am' ? ['እሑድ','ሰኞ','ማክሰኞ','ረቡዕ','ሐሙስ','ዓርብ','ቅዳሜ'] : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
days.forEach(d => {
const el = document.createElement('div');
el.className = 'day-head';
el.textContent = d;
grid.appendChild(el);
});

let daysInMonth, startJdn;
if (calendarType === 'gregorian') {
daysInMonth = new Date(year, month, 0).getDate();
startJdn = gregorianToJDN(year, month, 1);
} else if (calendarType === 'ethiopian') {
daysInMonth = getEthiopianMonthLength(year, month);
startJdn = ethiopianToJDN(year, month, 1);
} else {
daysInMonth = getHijriMonthLength(year, month);
startJdn = hijriToJDN(year, month, 1);
}

const firstDow = ((startJdn + 1) % 7 + 7) % 7;
for (let i = 0; i < firstDow; i++) {
const empty = document.createElement('div');
empty.className = 'day-cell empty';
grid.appendChild(empty);
}

const holidayJdns = new Set(getHolidaysForMonth(calendarType, year, month).map(h => h.date));

for (let day = 1; day <= daysInMonth; day++) {
const currentJdn = startJdn + (day - 1);
const greg = jdnToGregorian(currentJdn);
const hijri = jdnToHijri(currentJdn);
const eth = jdnToEthiopian(currentJdn);

const values = {
  gregorian: { label: 'G', num: localizeNumber(greg.day, 'gregorian') },
  hijri: { label: 'H', num: localizeNumber(hijri.day, 'hijri') },
  ethiopian: { label: 'E', num: localizeNumber(eth.day, 'ethiopian') }
};

const secondaryKeys = ['ethiopian', 'hijri', 'gregorian'].filter(k => k !== priority);

const cell = document.createElement('div');
cell.className = 'day-cell';
if (currentJdn === todayJdn) cell.classList.add('today');
if (holidayJdns.has(currentJdn)) cell.classList.add('holiday');

cell.innerHTML = `
  <div class="cell-top">
    <span class="primary-num">${values[priority].num}</span>
    <div class="secondary-badges">
      ${secondaryKeys.map(k => `<span class="sec-badge"><span class="badge-tag">${values[k].label}</span> ${values[k].num}</span>`).join('')}
    </div>
  </div>
  <div class="cell-writing-area"></div>
`;

if (uiLang === 'am' && calendarType === 'ethiopian') cell.classList.add('ethiopic-text');
grid.appendChild(cell);


}
}

// ============================================================
// PREMIUM PRINTABLE YEAR PDF / VIEW GENERATOR
// ============================================================
function printWholeYear() {
const yearSel = document.getElementById('print-year');
if (!yearSel) return;
const year = parseInt(yearSel.value);
const priorityLabel = { ethiopian: 'Ethiopian Calendar', hijri: 'Hijri Calendar', gregorian: 'Gregorian Calendar' }[priority];
const now = new Date();
const todayJdn = gregorianToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate());

const totalMonths = priority === 'ethiopian' ? 13 : 12;
let html = '';

for (let m = 1; m <= totalMonths; m++) {
let titleText, gridYear = year, gridMonth = m, gridType = priority;

if (priority === 'ethiopian') {
  titleText = `${getEthMonthName(m - 1)} ${year} E.C.`;
} else if (priority === 'hijri') {
  titleText = `${getHijriMonthName(m - 1)} ${localizeNumber(year, 'hijri')}${uiLang === 'ar' ? ' هـ' : ' A.H.'}`;
} else {
  titleText = `${getGregMonthName(m - 1)} ${year}`;
}

const corr = getCorrespondingMonths(gridType, gridYear, gridMonth);
const subParts = [];
if (corr.ethiopian) subParts.push(`<span class="corr-item">Ethiopian: <strong>${corr.ethiopian}</strong></span>`);
if (corr.hijri) subParts.push(`<span class="corr-item"${uiLang === 'ar' ? ' dir="rtl"' : ''}>Hijri: <strong>${corr.hijri}</strong></span>`);
if (corr.gregorian) subParts.push(`<span class="corr-item">Gregorian: <strong>${corr.gregorian}</strong></span>`);

const holidays = getHolidaysForMonth(gridType, gridYear, gridMonth);
let holidayHtml = '';
if (holidays.length > 0) {
  const items = holidays.map(h => {
    const greg = jdnToGregorian(h.date), eth = jdnToEthiopian(h.date), hijri = jdnToHijri(h.date);
    const dateStr = gridType === 'ethiopian' ? `${eth.day} ${getEthMonthName(eth.month - 1)}` : gridType === 'hijri' ? `${localizeNumber(hijri.day, 'hijri')} ${getHijriMonthName(hijri.month - 1)}` : `${getGregMonthName(greg.month - 1)} ${greg.day}`;
    let name = h.name;
    if (uiLang === 'am' && h.nameAm) name = h.nameAm;
    else if (uiLang === 'ar' && h.nameAr) name = h.nameAr;
    return `
      <div class="h-item">
        <span class="h-date">${dateStr}</span>
        <span class="h-name">${name}</span>
        <span class="h-tag">${h.type === 'ethiopian' ? 'ET' : 'HIJ'}</span>
      </div>`;
  }).join('');
  holidayHtml = `<div class="sheet-holidays"><div class="h-header">Holidays & Observances</div><div class="h-grid">${items}</div></div>`;
} else {
  holidayHtml = `<div class="sheet-holidays empty-memo"><div class="h-header">Notes & Plans</div><div class="note-rule-lines"></div></div>`;
}

html += `
<section class="cal-sheet">
  <header class="sheet-masthead">
    <div class="meta-left">
      <span class="brand-pill">Tri-Calendar System</span>
      <span class="brand-sub">Ethiopian • Hijri • Gregorian</span>
    </div>
    <div class="meta-right">
      <span class="sheet-num">${m < 10 ? '0' + m : m} / ${totalMonths}</span>
    </div>
  </header>

  <div class="sheet-title-banner">
    <div class="title-primary">${titleText}</div>
    <div class="title-sub">${subParts.join('<span class="sep-dot">·</span>')}</div>
  </div>

  <div class="sheet-grid" id="year-grid-${m}"></div>

  ${holidayHtml}

  <footer class="sheet-foot">
    <span>Prepared via Ethio Calendar · Print Edition</span>
    <span>${priorityLabel} Reference</span>
  </footer>
</section>`;


}

const w = window.open('', '_blank');
w.document.write(`

/* Masthead */
.sheet-masthead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.5px solid #0f172a;
  padding-bottom: 5px;
  margin-bottom: 12px;
}
.brand-pill {
  font-size: 7.5pt;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0f172a;
  display: inline-block;
  margin-right: 8px;
}
.brand-sub {
  font-size: 7.5pt;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.05em;
}
.sheet-num {
  font-size: 8pt;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.08em;
}

/* Title Block */
.sheet-title-banner {
  text-align: center;
  margin-bottom: 14px;
}
.title-primary {
  font-family: 'Cinzel', 'Noto Sans Ethiopic', 'Amiri', serif;
  font-size: 21pt;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.02em;
  line-height: 1.15;
}
.title-sub {
  font-size: 8.5pt;
  color: #475569;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.title-sub strong {
  font-weight: 600;
  color: #1e293b;
}
.sep-dot {
  color: #94a3b8;
}

/* Month Grid */
.sheet-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1.5px solid #0f172a;
  border-left: 1px solid #cbd5e1;
  flex-grow: 1;
}
.day-head {
  font-size: 8pt;
  font-weight: 800;
  text-align: center;
  padding: 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0f172a;
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1.5px solid #0f172a;
}
.day-head:nth-child(1), .day-head:nth-child(7) {
  color: #475569;
}
.day-cell {
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  padding: 5px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  position: relative;
  min-height: 29mm;
}
.day-cell.empty {
  background: #fafafa;
}
.day-cell.today {
  background: #f8fafc;
}
.day-cell.holiday {
  background: #fdfaf9;
}
.cell-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 1;
}
.primary-num {
  font-size: 13.5pt;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.holiday .primary-num {
  color: #b91c1c;
}
.secondary-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.sec-badge {
  font-size: 7pt;
  font-weight: 600;
  color: #475569;
  line-height: 1.1;
}
.badge-tag {
  font-size: 6pt;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
}
.cell-writing-area {
  flex: 1;
  margin-top: 4px;
  border-bottom: 1px dashed transparent;
}

/* Holidays Block */
.sheet-holidays {
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px 10px;
  margin-top: 10px;
  background: #fafbfc;
}
.h-header {
  font-size: 7pt;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #475569;
  margin-bottom: 5px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 2px;
}
.h-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px 14px;
}
.h-item {
  display: flex;
  align-items: baseline;
  font-size: 7.5pt;
  color: #1e293b;
  gap: 6px;
}
.h-date {
  font-weight: 700;
  color: #0f172a;
  min-width: 65px;
}
.h-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.h-tag {
  font-size: 5.5pt;
  font-weight: 800;
  padding: 1px 3px;
  border-radius: 2px;
  background: #e2e8f0;
  color: #334155;
}
.note-rule-lines {
  height: 14mm;
  background-image: repeating-linear-gradient(transparent, transparent 6mm, #e2e8f0 6.5mm);
}

/* Footer */
.sheet-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 4px;
  border-top: 1px solid #e2e8f0;
  font-size: 7pt;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.ethiopic-text { font-family: 'Noto Sans Ethiopic', sans-serif; }
[dir="rtl"] { direction: rtl; font-family: 'Amiri', serif; }

@media print {
  body { background: transparent; padding: 0; }
  .cal-sheet {
    border: none;
    padding: 0;
    height: 277mm;
    page-break-after: always;
  }
  .sheet-grid, .day-cell, .sheet-holidays {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}


setTimeout(() => {
for (let m = 1; m <= totalMonths; m++) {
let gridType = priority;
renderGridInWindow(w, year-grid-${m}, gridType, year, m, todayJdn);
}
setTimeout(() => w.print(), 800);
}, 600);
}

function renderGridInWindow(win, gridId, calendarType, year, month, todayJdn) {
const grid = win.document.getElementById(gridId);
if (!grid) return;
grid.innerHTML = '';

const days = uiLang === 'am' ? ['እሑድ','ሰኞ','ማክሰኞ','ረቡዕ','ሐሙስ','ዓርብ','ቅዳሜ'] : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
days.forEach(d => {
const el = win.document.createElement('div');
el.className = 'day-head';
el.textContent = d;
grid.appendChild(el);
});

let daysInMonth, startJdn;
if (calendarType === 'gregorian') {
daysInMonth = new Date(year, month, 0).getDate();
startJdn = gregorianToJDN(year, month, 1);
} else if (calendarType === 'ethiopian') {
daysInMonth = getEthiopianMonthLength(year, month);
startJdn = ethiopianToJDN(year, month, 1);
} else {
daysInMonth = getHijriMonthLength(year, month);
startJdn = hijriToJDN(year, month, 1);
}

const firstDow = ((startJdn + 1) % 7 + 7) % 7;
for (let i = 0; i < firstDow; i++) {
const empty = win.document.createElement('div');
empty.className = 'day-cell empty';
grid.appendChild(empty);
}

const holidayJdns = new Set(getHolidaysForMonth(calendarType, year, month).map(h => h.date));

for (let day = 1; day <= daysInMonth; day++) {
const currentJdn = startJdn + (day - 1);
const greg = jdnToGregorian(currentJdn);
const hijri = jdnToHijri(currentJdn);
const eth = jdnToEthiopian(currentJdn);

const values = {
  gregorian: { label: 'G', num: localizeNumber(greg.day, 'gregorian') },
  hijri: { label: 'H', num: localizeNumber(hijri.day, 'hijri') },
  ethiopian: { label: 'E', num: localizeNumber(eth.day, 'ethiopian') }
};

const secondaryKeys = ['ethiopian', 'hijri', 'gregorian'].filter(k => k !== priority);

const cell = win.document.createElement('div');
cell.className = 'day-cell';
if (currentJdn === todayJdn) cell.classList.add('today');
if (holidayJdns.has(currentJdn)) cell.classList.add('holiday');

cell.innerHTML = `
  <div class="cell-top">
    <span class="primary-num">${values[priority].num}</span>
    <div class="secondary-badges">
      ${secondaryKeys.map(k => `<span class="sec-badge"><span class="badge-tag">${values[k].label}</span> ${values[k].num}</span>`).join('')}
    </div>
  </div>
  <div class="cell-writing-area"></div>
`;

if (uiLang === 'am' && calendarType === 'ethiopian') cell.classList.add('ethiopic-text');
grid.appendChild(cell);


}
}

// ============================================================
// TOOLS: DAY DIFFERENCE & TIME CONVERTER
// ============================================================
function countDays() {
const startEl = document.getElementById('start-date');
const endEl = document.getElementById('end-date');
if (!startEl || !endEl || !startEl.value || !endEl.value) return;

const s = new Date(startEl.value), e = new Date(endEl.value);
const sjdn = gregorianToJDN(s.getFullYear(), s.getMonth() + 1, s.getDate());
const ejdn = gregorianToJDN(e.getFullYear(), e.getMonth() + 1, e.getDate());

const diffEl = document.getElementById('day-diff');
if (diffEl) diffEl.textContent = ${Math.abs(ejdn - sjdn)} days;

const ethS = jdnToEthiopian(sjdn), ethE = jdnToEthiopian(ejdn);
const hijriS = jdnToHijri(sjdn), hijriE = jdnToHijri(ejdn);

const detailEl = document.getElementById('day-detail');
if (detailEl) {
detailEl.innerHTML =
<strong>Start:</strong> ${getGregMonthName(s.getMonth())} ${s.getDate()}, ${s.getFullYear()} ·  +
${ethS.day} ${getEthMonthName(ethS.month - 1)} ${ethS.year} E.C. ·  +
${hijriS.day} ${getHijriMonthName(hijriS.month - 1)} ${hijriS.year} A.H.<br> +
<strong>End:</strong> ${getGregMonthName(e.getMonth())} ${e.getDate()}, ${e.getFullYear()} ·  +
${ethE.day} ${getEthMonthName(ethE.month - 1)} ${ethE.year} E.C. ·  +
${hijriE.day} ${getHijriMonthName(hijriE.month - 1)} ${hijriE.year} A.H.;
}

const resultContainer = document.getElementById('day-result');
if (resultContainer) resultContainer.style.display = 'block';
}

function convertTime() {
const hourInput = document.getElementById('hour-input');
const minuteInput = document.getElementById('minute-input');
const periodInput = document.getElementById('period-input');
const outputEl = document.getElementById('converted-time');
if (!hourInput || !minuteInput || !periodInput || !outputEl) return;

const hour = parseInt(hourInput.value) || 0;
const minute = parseInt(minuteInput.value) || 0;
const period = periodInput.value;
let result;

if (direction === 'to-standard') {
let stdHour;
if (period === 'day') stdHour = (hour === 12) ? 6 : hour + 6;
else {
stdHour = (hour === 12) ? 18 : hour + 18;
if (stdHour >= 24) stdHour -= 24;
}
const p = stdHour >= 12 ? 'PM' : 'AM';
const h12 = stdHour % 12 === 0 ? 12 : stdHour % 12;
result = ${String(h12).padStart(2,'0')}:${String(minute).padStart(2,'0')} ${p};
} else {
let ethHour;
if (period === 'day') {
ethHour = (hour === 12) ? 12 : hour - 6;
if (ethHour <= 0) ethHour += 12;
} else {
ethHour = (hour === 12) ? 12 : hour - 18;
if (ethHour <= 0) ethHour += 12;
}
result = ${String(ethHour).padStart(2,'0')}:${String(minute).padStart(2,'0')} (${period === 'day' ? 'Day' : 'Night'});
}

outputEl.textContent = result;
}

function renderWorldClock() {
const grid = document.getElementById('world-grid');
if (!grid) return;
grid.innerHTML = '';
const now = new Date();
cities.forEach(city => {
const timeStr = now.toLocaleTimeString('en-US', {
timeZone: city.tz,
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: true
});
const dateStr = now.toLocaleDateString('en-US', {
timeZone: city.tz,
month: 'short',
day: 'numeric',
weekday: 'short'
});
const div = document.createElement('div');
div.className = 'city-card';
div.innerHTML = <div class="city">${city.name}</div><div class="time">${timeStr}</div><div class="date">${dateStr}</div>;
grid.appendChild(div);
});
}

// ============================================================
// INITIALIZATION
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
if (document.getElementById('print-year')) {
populatePrintYearDropdown();
populatePrintMonthDropdown();
renderPrintView();
}
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
if (yearInput && dayInput) {
if (fromCalendar === 'gregorian') { yearInput.value = 2026; dayInput.max = 31; }
else if (fromCalendar === 'ethiopian') { yearInput.value = 2018; dayInput.max = 30; }
else { yearInput.value = 1447; dayInput.max = 30; }
}
convertDate();
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
const pLabel = document.getElementById('period-label');
if (pLabel) pLabel.textContent = direction === 'to-standard' ? 'Period (Ethiopian)' : 'Period (Standard)';
convertTime();
});
});
}

const hourInput = document.getElementById('hour-input');
const minuteInput = document.getElementById('minute-input');
const periodInput = document.getElementById('period-input');
if (hourInput) hourInput.addEventListener('input', convertTime);
if (minuteInput) minuteInput.addEventListener('input', convertTime);
if (periodInput) periodInput.addEventListener('change', convertTime);

const convDay = document.getElementById('conv-day');
const convMonth = document.getElementById('conv-month');
const convYear = document.getElementById('conv-year');
if (convDay) convDay.addEventListener('input', convertDate);
if (convMonth) convMonth.addEventListener('change', convertDate);
if (convYear) convYear.addEventListener('input', convertDate);

const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
if (startDate && endDate) {
const today = new Date();
startDate.value = today.toISOString().split('T')[0];
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
endDate.value = nextMonth.toISOString().split('T')[0];
startDate.addEventListener('change', countDays);
endDate.addEventListener('change', countDays);
}

populateMonthDropdown();
renderToday();
convertDate();
convertTime();
countDays();

if (document.getElementById('print-year')) {
populatePrintYearDropdown();
populatePrintMonthDropdown();
renderPrintView();
}

const printYearBtn = document.getElementById('print-all-btn');
if (printYearBtn) printYearBtn.addEventListener('click', printWholeYear);

const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

renderWorldClock();
setInterval(renderWorldClock, 1000);
});
