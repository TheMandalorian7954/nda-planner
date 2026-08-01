export interface ResourceGroup {
  title: string;
  rows: { name: string; detail: string }[];
}

export const RESOURCES: ResourceGroup[] = [
  {
    title: "Indian Army Ranks (Low → High)",
    rows: [
      { name: "Sepoy → Naik → Havildar", detail: "Other Ranks" },
      { name: "JCOs", detail: "Naib Subedar → Subedar → Subedar Major" },
      { name: "Officers", detail: "Lieutenant → Captain → Major → Lt Colonel → Colonel → Brigadier → Major General → Lt General → General" },
    ],
  },
  {
    title: "Indian Air Force Ranks",
    rows: [
      { name: "Flying Officer", detail: "Entry-level commissioned rank" },
      { name: "Flight Lieutenant → Squadron Leader", detail: "Junior officer progression" },
      { name: "Wing Commander → Group Captain", detail: "Senior officers" },
      { name: "Air Commodore → Air Vice Marshal → Air Marshal → Air Chief Marshal", detail: "Air officers" },
    ],
  },
  {
    title: "Indian Navy Ranks",
    rows: [
      { name: "Sub Lieutenant → Lieutenant → Lt Commander", detail: "Junior officers" },
      { name: "Commander → Captain", detail: "Senior officers" },
      { name: "Commodore → Rear Admiral → Vice Admiral → Admiral", detail: "Flag officers" },
    ],
  },
  {
    title: "Military Commands (India)",
    rows: [
      { name: "Southern Command", detail: "Pune" },
      { name: "Western Command", detail: "Chandimandir" },
      { name: "Eastern Command", detail: "Kolkata" },
      { name: "Northern Command", detail: "Udhampur" },
      { name: "Central Command", detail: "Lucknow" },
      { name: "South-Western Command", detail: "Jaipur" },
      { name: "Training Command", detail: "Shimla" },
      { name: "Army Strategic Forces Command", detail: "Strategic weapons" },
    ],
  },
  {
    title: "Aircraft (IAF)",
    rows: [
      { name: "Tejas", detail: "Indigenous LCA — multirole fighter" },
      { name: "Sukhoi Su-30MKI", detail: "Heavy multirole fighter (Russia)" },
      { name: "Rafale", detail: "4.5-gen multirole fighter (France)" },
      { name: "Mirage 2000", detail: "Multirole fighter, 1999 Kargil strikes" },
      { name: "Jaguar", detail: "Deep-penetration strike aircraft" },
      { name: "C-17 Globemaster III", detail: "Heavy strategic transport" },
      { name: "AWACS Phalcon / Netra", detail: "Airborne early warning" },
    ],
  },
  {
    title: "Ships (Navy)",
    rows: [
      { name: "INS Vikrant", detail: "First indigenous aircraft carrier (IAC-1)" },
      { name: "INS Vikramaditya", detail: "Aircraft carrier (ex-Admiral Gorshkov)" },
      { name: "INS Arihant", detail: "Nuclear ballistic missile submarine" },
      { name: "INS Kalvari", detail: "Scorpène-class attack submarine" },
      { name: "INS Visakhapatnam", detail: "Guided-missile destroyer" },
      { name: "INS Talwar / Tushil", detail: "Frigates" },
    ],
  },
  {
    title: "Missiles (DRDO)",
    rows: [
      { name: "Agni-I to Agni-V", detail: "Ballistic missiles (Agni-V = ICBM)" },
      { name: "Prithvi", detail: "Short-range ballistic missile" },
      { name: "BrahMos", detail: "Supersonic cruise missile (Indo-Russian)" },
      { name: "Akash", detail: "Medium-range surface-to-air missile" },
      { name: "Nag", detail: "Fire-and-forget anti-tank missile" },
      { name: "Astra", detail: "Beyond-visual-range air-to-air missile" },
      { name: "Shaurya", detail: "Surface-to-surface tactical missile" },
    ],
  },
  {
    title: "Key Abbreviations",
    rows: [
      { name: "NDA / SSB", detail: "National Defence Academy / Services Selection Board" },
      { name: "CDS / AFCAT / OTA", detail: "Combined Defence Services / Air Force Common Admission Test / Officers Training Academy" },
      { name: "OLQ", detail: "Officer Like Qualities" },
      { name: "TAT / WAT / SRT / SD", detail: "Thematic Apperception Test / Word Association Test / Situation Reaction Test / Self Description" },
      { name: "GTO", detail: "Group Testing Officer" },
      { name: "PGT / HGT / FGT", detail: "Progressive / Half / Final Group Task" },
      { name: "OIR", detail: "Officer Intelligence Rating" },
      { name: "DRDO / ISRO / HAL", detail: "Defence R&D Org / ISRO / Hindustan Aeronautics" },
      { name: "JCO / NCO", detail: "Junior / Non-Commissioned Officer" },
      { name: "FDI / GDP / RBI", detail: "Foreign Direct Investment / Gross Domestic Product / Reserve Bank of India" },
    ],
  },
  {
    title: "Important Dates",
    rows: [
      { name: "26 Jan 1950", detail: "Constitution of India came into force" },
      { name: "15 Aug 1947", detail: "Independence Day" },
      { name: "26 Nov 1949", detail: "Constitution adopted (Constitution Day)" },
      { name: "2 Oct", detail: "Gandhi Jayanti / International Day of Non-Violence" },
      { name: "14 Nov", detail: "Children's Day (Nehru's birthday)" },
      { name: "5 Sep", detail: "Teachers' Day (Radhakrishnan's birthday)" },
      { name: "12 Jan", detail: "National Youth Day (Swami Vivekananda)" },
      { name: "1 Dec", detail: "World AIDS Day" },
    ],
  },
  {
    title: "Important Acts & Constitutional Parts",
    rows: [
      { name: "Part III", detail: "Fundamental Rights (Art 12–35)" },
      { name: "Part IV", detail: "Directive Principles (Art 36–51)" },
      { name: "Part IV-A", detail: "Fundamental Duties (Art 51A)" },
      { name: "RTI Act 2005", detail: "Right to Information" },
      { name: "RTE Act 2009", detail: "Right of Children to Free & Compulsory Education" },
      { name: "NDPS Act", detail: "Narcotic Drugs & Psychotropic Substances" },
      { name: "Arms Act 1959", detail: "Regulates possession of firearms" },
    ],
  },
  {
    title: "NCERT Books to Cover",
    rows: [
      { name: "Maths XI & XII", detail: "NCERT full syllabus" },
      { name: "Physics XI & XII", detail: "Concepts + derivations" },
      { name: "Chemistry XI & XII", detail: "Basics + periodic table" },
      { name: "Biology XI & XII", detail: "Human body, ecology" },
      { name: "History (Old NCERT)", detail: "Modern Indian history" },
      { name: "Geography XI & XII", detail: "Physical + Indian geography" },
      { name: "Polity (Class XI)", detail: "Indian Constitution at Work" },
      { name: "Economics (Class XII)", detail: "Indian Economic Development" },
    ],
  },
];

export const FORMULA_SHEET: { title: string; lines: string[] }[] = [
  {
    title: "Algebra",
    lines: [
      "(a+b)² = a² + 2ab + b²",
      "(a−b)² = a² − 2ab + b²",
      "a² − b² = (a+b)(a−b)",
      "logₐ(mn) = logₐm + logₐn",
      "logₐ(m/n) = logₐm − logₐn",
    ],
  },
  {
    title: "Trigonometry",
    lines: [
      "sin²θ + cos²θ = 1",
      "1 + tan²θ = sec²θ",
      "sin(A+B) = sinA·cosB + cosA·sinB",
      "cos(A−B) = cosA·cosB + sinA·sinB",
      "sin 2A = 2 sinA cosA",
    ],
  },
  {
    title: "Calculus",
    lines: [
      "d/dx(xⁿ) = n·xⁿ⁻¹",
      "d/dx(sin x) = cos x",
      "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
      "∫ eˣ dx = eˣ + C",
      "∫ 1/x dx = ln|x| + C",
    ],
  },
  {
    title: "Vectors & Matrices",
    lines: [
      "|A| for [[a,b],[c,d]] = ad − bc",
      "A·B = |A||B|cosθ (dot product)",
      "|A×B| = |A||B|sinθ (cross product)",
      "A·B = 0 ⇔ perpendicular",
    ],
  },
  {
    title: "Statistics & Probability",
    lines: [
      "Mean = Σx/n",
      "Variance = Σ(x−x̄)²/n",
      "P(A∪B) = P(A) + P(B) − P(A∩B)",
      "P(A∩B) = P(A)·P(B) (independent)",
    ],
  },
];
