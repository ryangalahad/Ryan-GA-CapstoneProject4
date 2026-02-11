// Country code to full name mapping
// This consolidates all countries available in the targets-100k.json dataset
export const countryMapping = {
  // European countries
  ru: "Russia",
  ua: "Ukraine",
  by: "Belarus",
  kz: "Kazakhstan",
  uz: "Uzbekistan",
  tm: "Turkmenistan",
  kg: "Kyrgyzstan",
  tj: "Tajikistan",
  ge: "Georgia",
  az: "Azerbaijan",
  am: "Armenia",
  md: "Moldova",
  ro: "Romania",
  bg: "Bulgaria",
  hr: "Croatia",
  ba: "Bosnia and Herzegovina",
  rs: "Serbia",
  me: "Montenegro",
  mk: "North Macedonia",
  al: "Albania",
  gr: "Greece",
  tr: "Turkey",
  cy: "Cyprus",
  pl: "Poland",
  cz: "Czech Republic",
  sk: "Slovakia",
  hu: "Hungary",
  si: "Slovenia",
  lt: "Lithuania",
  lv: "Latvia",
  ee: "Estonia",
  de: "Germany",
  at: "Austria",
  ch: "Switzerland",
  fr: "France",
  it: "Italy",
  es: "Spain",
  pt: "Portugal",
  be: "Belgium",
  nl: "Netherlands",
  lu: "Luxembourg",
  ie: "Ireland",
  gb: "United Kingdom",
  dk: "Denmark",
  se: "Sweden",
  no: "Norway",
  fi: "Finland",
  is: "Iceland",

  // Asian countries
  cn: "China",
  jp: "Japan",
  kr: "South Korea",
  kp: "North Korea",
  mn: "Mongolia",
  vn: "Vietnam",
  la: "Laos",
  th: "Thailand",
  mm: "Myanmar",
  kh: "Cambodia",
  my: "Malaysia",
  sg: "Singapore",
  bn: "Brunei",
  ph: "Philippines",
  id: "Indonesia",
  tl: "Timor-Leste",
  in: "India",
  pk: "Pakistan",
  bd: "Bangladesh",
  np: "Nepal",
  bt: "Bhutan",
  lk: "Sri Lanka",
  mv: "Maldives",
  af: "Afghanistan",
  ir: "Iran",
  iq: "Iraq",
  sy: "Syria",
  lb: "Lebanon",
  jo: "Jordan",
  il: "Israel",
  ps: "Palestine",
  sa: "Saudi Arabia",
  ae: "United Arab Emirates",
  qat: "Qatar",
  bh: "Bahrain",
  kw: "Kuwait",
  om: "Oman",
  ye: "Yemen",

  // African countries
  eg: "Egypt",
  ly: "Libya",
  tn: "Tunisia",
  dz: "Algeria",
  ma: "Morocco",
  sd: "Sudan",
  ss: "South Sudan",
  et: "Ethiopia",
  er: "Eritrea",
  dj: "Djibouti",
  so: "Somalia",
  ke: "Kenya",
  ug: "Uganda",
  rw: "Rwanda",
  bi: "Burundi",
  tz: "Tanzania",
  zm: "Zambia",
  zw: "Zimbabwe",
  mz: "Mozambique",
  mw: "Malawi",
  za: "South Africa",
  bw: "Botswana",
  na: "Namibia",
  ao: "Angola",
  cg: "Congo",
  cd: "Democratic Republic of Congo",
  ga: "Gabon",
  cm: "Cameroon",
  gq: "Equatorial Guinea",
  st: "São Tomé and Príncipe",
  cf: "Central African Republic",
  td: "Chad",
  ne: "Niger",
  ng: "Nigeria",
  gh: "Ghana",
  ci: "Côte d'Ivoire",
  lr: "Liberia",
  sl: "Sierra Leone",
  gn: "Guinea",
  gw: "Guinea-Bissau",
  sn: "Senegal",
  gm: "Gambia",
  cv: "Cape Verde",

  // Americas
  us: "United States",
  ca: "Canada",
  mx: "Mexico",
  gt: "Guatemala",
  bz: "Belize",
  hn: "Honduras",
  sv: "El Salvador",
  ni: "Nicaragua",
  cr: "Costa Rica",
  pa: "Panama",
  cu: "Cuba",
  do: "Dominican Republic",
  ht: "Haiti",
  jm: "Jamaica",
  bs: "Bahamas",
  tt: "Trinidad and Tobago",
  bb: "Barbados",
  ag: "Antigua and Barbuda",
  kn: "Saint Kitts and Nevis",
  lc: "Saint Lucia",
  vc: "Saint Vincent and the Grenadines",
  gd: "Grenada",
  dm: "Dominica",
  co: "Colombia",
  ve: "Venezuela",
  ec: "Ecuador",
  pe: "Peru",
  bo: "Bolivia",
  br: "Brazil",
  py: "Paraguay",
  ar: "Argentina",
  uy: "Uruguay",
  cl: "Chile",

  // Oceania
  au: "Australia",
  nz: "New Zealand",
  fj: "Fiji",
  pg: "Papua New Guinea",
  sb: "Solomon Islands",
  vu: "Vanuatu",
  to: "Tonga",
  ki: "Kiribati",
  fm: "Federated States of Micronesia",
  pw: "Palau",
  mh: "Marshall Islands",
  ws: "Samoa",

  // Other territories and special cases
  xx: "Unknown",
  un: "Unspecified",
};

// Get country name from code
export function getCountryName(code) {
  if (!code) return null;
  return countryMapping[code.toLowerCase()] || code;
}

// Get country code from name (reverse lookup)
export function getCountryCode(name) {
  if (!name) return null;
  const lowerName = name.toLowerCase();
  for (const [code, countryName] of Object.entries(countryMapping)) {
    if (countryName.toLowerCase() === lowerName) {
      return code;
    }
  }
  return null;
}

// Get all countries as a sorted array
export function getAllCountries() {
  return Object.entries(countryMapping)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Search for countries by partial name
export function searchCountries(searchTerm) {
  const term = searchTerm.toLowerCase();
  return Object.entries(countryMapping)
    .filter(
      ([code, name]) =>
        name.toLowerCase().includes(term) || code.toLowerCase().includes(term),
    )
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
