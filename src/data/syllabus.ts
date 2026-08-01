export interface SyllabusItem {
  id: string;
  name: string;
}

export interface SyllabusSection {
  id: string;
  name: string;
  items: SyllabusItem[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  marks: number;
  sections: SyllabusSection[];
}

export const SYLLABUS: SyllabusSubject[] = [
  {
    id: "maths",
    name: "Mathematics",
    marks: 300,
    sections: [
      {
        id: "maths-algebra",
        name: "Algebra",
        items: [
          { id: "maths-algebra-sets", name: "Sets" },
          { id: "maths-algebra-relations", name: "Relations & Functions" },
          { id: "maths-algebra-complex", name: "Complex Numbers" },
          { id: "maths-algebra-quadratic", name: "Quadratic Equations" },
          { id: "maths-algebra-sequences", name: "Sequence & Series" },
          { id: "maths-algebra-binomial", name: "Binomial Theorem" },
          { id: "maths-algebra-logarithms", name: "Logarithms" },
          { id: "maths-algebra-permutation", name: "Permutation & Combination" },
          { id: "maths-algebra-matrices", name: "Matrices & Operations" },
          { id: "maths-algebra-determinants", name: "Determinants & Inverse" },
          { id: "maths-algebra-cramer", name: "Cramer's Rule" },
        ],
      },
      {
        id: "maths-trigonometry",
        name: "Trigonometry",
        items: [
          { id: "maths-trig-angles", name: "Angles & Identities" },
          { id: "maths-trig-compound", name: "Compound & Multiple Angles" },
          { id: "maths-trig-inverse", name: "Inverse Trigonometry" },
          { id: "maths-trig-heights", name: "Heights & Distances" },
        ],
      },
      {
        id: "maths-geometry-2d",
        name: "Analytical Geometry (2D)",
        items: [
          { id: "maths-geo2-straight", name: "Straight Line" },
          { id: "maths-geo2-circle", name: "Circle" },
          { id: "maths-geo2-parabola", name: "Parabola" },
          { id: "maths-geo2-ellipse", name: "Ellipse" },
          { id: "maths-geo2-hyperbola", name: "Hyperbola" },
        ],
      },
      {
        id: "maths-geometry-3d",
        name: "Analytical Geometry (3D)",
        items: [
          { id: "maths-geo3-lines", name: "Lines in Space" },
          { id: "maths-geo3-distance", name: "Distance & Direction Cosines" },
        ],
      },
      {
        id: "maths-calculus",
        name: "Differential & Integral Calculus",
        items: [
          { id: "maths-calc-limits", name: "Limits & Continuity" },
          { id: "maths-calc-differentiation", name: "Differentiation" },
          { id: "maths-calc-maxima", name: "Maxima & Minima" },
          { id: "maths-calc-integration", name: "Integration" },
          { id: "maths-calc-definite", name: "Definite Integrals" },
          { id: "maths-calc-area", name: "Area Under Curves" },
        ],
      },
      {
        id: "maths-vectors",
        name: "Vector Algebra",
        items: [
          { id: "maths-vec-addition", name: "Vector Addition" },
          { id: "maths-vec-dot", name: "Dot Product" },
          { id: "maths-vec-cross", name: "Cross Product" },
        ],
      },
      {
        id: "maths-statistics",
        name: "Statistics & Probability",
        items: [
          { id: "maths-stats-central", name: "Mean, Median & Mode" },
          { id: "maths-stats-sd", name: "Standard Deviation" },
          { id: "maths-prob-classical", name: "Classical Probability" },
          { id: "maths-prob-conditional", name: "Conditional Probability" },
        ],
      },
    ],
  },
  {
    id: "english",
    name: "English",
    marks: 200,
    sections: [
      {
        id: "eng-grammar",
        name: "Grammar",
        items: [
          { id: "eng-grammar-pos", name: "Parts of Speech" },
          { id: "eng-grammar-tenses", name: "Tenses" },
          { id: "eng-grammar-articles", name: "Articles" },
          { id: "eng-grammar-prepositions", name: "Prepositions" },
          { id: "eng-grammar-voice", name: "Active & Passive Voice" },
          { id: "eng-grammar-narration", name: "Narration (Direct/Indirect)" },
          { id: "eng-grammar-sva", name: "Subject-Verb Agreement" },
          { id: "eng-grammar-error", name: "Error Detection" },
        ],
      },
      {
        id: "eng-vocabulary",
        name: "Vocabulary",
        items: [
          { id: "eng-vocab-synonyms", name: "Synonyms" },
          { id: "eng-vocab-antonyms", name: "Antonyms" },
          { id: "eng-vocab-idioms", name: "Idioms & Phrases" },
          { id: "eng-vocab-oneword", name: "One Word Substitution" },
          { id: "eng-vocab-spellings", name: "Spellings" },
          { id: "eng-vocab-daily", name: "Daily Vocabulary" },
        ],
      },
      {
        id: "eng-reading",
        name: "Reading & Comprehension",
        items: [
          { id: "eng-reading-comprehension", name: "Comprehension Passages" },
          { id: "eng-reading-arrangement", name: "Sentence Arrangement" },
          { id: "eng-reading-blanks", name: "Fill in the Blanks" },
          { id: "eng-reading-practice", name: "Practice Sets" },
          { id: "eng-reading-pyq", name: "Previous Year Questions" },
        ],
      },
    ],
  },
  {
    id: "gk",
    name: "General Knowledge (GAT)",
    marks: 400,
    sections: [
      {
        id: "gk-science",
        name: "Science",
        items: [
          { id: "gk-physics", name: "Physics" },
          { id: "gk-chemistry", name: "Chemistry" },
          { id: "gk-biology", name: "Biology" },
          { id: "gk-sci-tech", name: "Science & Technology" },
          { id: "gk-space", name: "Space Missions (ISRO/NASA)" },
          { id: "gk-environment", name: "Environment & Ecology" },
        ],
      },
      {
        id: "gk-social",
        name: "Social Sciences",
        items: [
          { id: "gk-history", name: "History" },
          { id: "gk-polity", name: "Indian Polity" },
          { id: "gk-geography", name: "Geography" },
          { id: "gk-economics", name: "Economics" },
          { id: "gk-international", name: "International Relations" },
        ],
      },
      {
        id: "gk-current",
        name: "Current Affairs",
        items: [
          { id: "gk-ca-daily", name: "Daily Current Affairs" },
          { id: "gk-ca-monthly", name: "Monthly Compilations" },
          { id: "gk-ca-revision", name: "Current Affairs Revision" },
        ],
      },
      {
        id: "gk-defence",
        name: "Defence",
        items: [
          { id: "gk-def-news", name: "Defence News" },
          { id: "gk-def-isro", name: "ISRO & DRDO" },
          { id: "gk-def-services", name: "Army, Air Force & Navy" },
          { id: "gk-def-exercises", name: "Important Exercises" },
          { id: "gk-def-operations", name: "Military Operations" },
          { id: "gk-def-ranks", name: "Ranks & Commands" },
          { id: "gk-def-weapons", name: "Missiles, Aircraft & Ships" },
        ],
      },
      {
        id: "gk-misc",
        name: "Miscellaneous",
        items: [
          { id: "gk-misc-awards", name: "Awards & Honours" },
          { id: "gk-misc-books", name: "Books & Authors" },
          { id: "gk-misc-sports", name: "Sports & Games" },
        ],
      },
    ],
  },
];

export const SUBJECT_COLORS: Record<string, string> = {
  Maths: "oklch(0.55 0.2 27)", // pencil red
  English: "oklch(0.55 0.17 245)", // pencil blue
  GK: "oklch(0.52 0.13 155)", // pencil green
  SSB: "oklch(0.7 0.15 75)", // amber
};
