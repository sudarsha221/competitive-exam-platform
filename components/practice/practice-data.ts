export type PracticeExam = "CET" | "NEET" | "JEE";
export type Difficulty = "Basic" | "Medium" | "Advanced";

export type PracticeQuestion = {
  id: string;
  exam: PracticeExam;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "neet-bio-cell",
    exam: "NEET",
    subject: "Biology",
    chapter: "Cell: The Unit of Life",
    topic: "Cell organelles",
    difficulty: "Basic",
    prompt: "Which cell organelle is primarily responsible for modifying, sorting, and packaging proteins?",
    options: ["Lysosome", "Golgi apparatus", "Ribosome", "Centrosome"],
    correctIndex: 1,
    explanation:
      "The Golgi apparatus receives proteins from the endoplasmic reticulum, modifies them, and sorts them into vesicles for transport to their destinations.",
  },
  {
    id: "neet-bio-genetics",
    exam: "NEET",
    subject: "Biology",
    chapter: "Principles of Inheritance",
    topic: "Mendelian genetics",
    difficulty: "Medium",
    prompt: "In a monohybrid cross between two heterozygous individuals, what is the expected phenotypic ratio under complete dominance?",
    options: ["1 : 1", "1 : 2 : 1", "3 : 1", "9 : 3 : 3 : 1"],
    correctIndex: 2,
    explanation:
      "A heterozygous cross (Aa × Aa) produces genotypes AA, Aa, Aa, and aa. With complete dominance, three offspring show the dominant phenotype for every one with the recessive phenotype.",
  },
  {
    id: "neet-chem-bonding",
    exam: "NEET",
    subject: "Chemistry",
    chapter: "Chemical Bonding",
    topic: "Molecular geometry",
    difficulty: "Medium",
    prompt: "What is the molecular geometry of ammonia (NH₃) according to VSEPR theory?",
    options: ["Linear", "Trigonal planar", "Trigonal pyramidal", "Tetrahedral"],
    correctIndex: 2,
    explanation:
      "Nitrogen in NH₃ has three bonding pairs and one lone pair. The electron-pair arrangement is tetrahedral, while the molecular shape is trigonal pyramidal because the lone pair is not counted as an atom.",
  },
  {
    id: "neet-physics-motion",
    exam: "NEET",
    subject: "Physics",
    chapter: "Laws of Motion",
    topic: "Momentum",
    difficulty: "Basic",
    prompt: "A constant net force acts on an object for a time interval. Which quantity equals the change in its momentum?",
    options: ["Work done", "Impulse", "Power", "Kinetic energy"],
    correctIndex: 1,
    explanation:
      "Impulse is the product of force and the time interval for which it acts. The impulse–momentum theorem states that this equals the change in momentum: J = Δp.",
  },
  {
    id: "neet-physics-energy",
    exam: "NEET",
    subject: "Physics",
    chapter: "Work, Energy and Power",
    topic: "Conservation of energy",
    difficulty: "Advanced",
    prompt: "A body falls freely from rest. Neglecting air resistance, how does its total mechanical energy change during the fall?",
    options: ["It continuously increases", "It continuously decreases", "It remains constant", "It first decreases, then increases"],
    correctIndex: 2,
    explanation:
      "As the body falls, gravitational potential energy is converted into kinetic energy. With no non-conservative forces such as air resistance, the sum of kinetic and potential energy remains constant.",
  },
  {
    id: "cet-math-derivative",
    exam: "CET",
    subject: "Mathematics",
    chapter: "Differential Calculus",
    topic: "Derivatives",
    difficulty: "Basic",
    prompt: "What is the derivative of x² + 3x with respect to x?",
    options: ["2x + 3", "x + 3", "2x² + 3", "x² + 3"],
    correctIndex: 0,
    explanation:
      "Apply the power rule term by term: d(x²)/dx = 2x and d(3x)/dx = 3. Adding the results gives 2x + 3.",
  },
  {
    id: "cet-math-probability",
    exam: "CET",
    subject: "Mathematics",
    chapter: "Probability",
    topic: "Basic probability",
    difficulty: "Medium",
    prompt: "A fair six-sided die is rolled once. What is the probability of getting a number greater than 4?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctIndex: 1,
    explanation:
      "The outcomes greater than 4 are 5 and 6, so there are two favourable outcomes out of six equally likely outcomes. The probability is 2/6 = 1/3.",
  },
  {
    id: "cet-physics-current",
    exam: "CET",
    subject: "Physics",
    chapter: "Current Electricity",
    topic: "Ohm's law",
    difficulty: "Basic",
    prompt: "A resistor of 4 Ω is connected across a 12 V ideal source. What current flows through it?",
    options: ["0.33 A", "3 A", "8 A", "48 A"],
    correctIndex: 1,
    explanation:
      "Ohm's law gives I = V/R. Substituting 12 V and 4 Ω gives I = 12/4 = 3 A.",
  },
  {
    id: "cet-chem-organic",
    exam: "CET",
    subject: "Chemistry",
    chapter: "Basic Organic Chemistry",
    topic: "Functional groups",
    difficulty: "Medium",
    prompt: "Which functional group is present in ethanol?",
    options: ["Aldehyde", "Carboxyl", "Hydroxyl", "Ketone"],
    correctIndex: 2,
    explanation:
      "Ethanol has the formula C₂H₅OH. The –OH group attached to a carbon chain is the hydroxyl functional group characteristic of alcohols.",
  },
  {
    id: "jee-physics-projectile",
    exam: "JEE",
    subject: "Physics",
    chapter: "Motion in a Plane",
    topic: "Projectile motion",
    difficulty: "Medium",
    prompt: "For a projectile launched with speed u at an angle θ on level ground, which expression gives its time of flight?",
    options: ["u cos θ / g", "2u sin θ / g", "u² sin 2θ / g", "2u cos θ / g"],
    correctIndex: 1,
    explanation:
      "The initial vertical velocity is u sin θ. For a projectile returning to its launch height, the total time is twice the time to reach the highest point: T = 2u sin θ / g.",
  },
  {
    id: "jee-math-sequence",
    exam: "JEE",
    subject: "Mathematics",
    chapter: "Sequences and Series",
    topic: "Arithmetic progressions",
    difficulty: "Basic",
    prompt: "An arithmetic progression has first term 5 and common difference 3. What is its 10th term?",
    options: ["29", "30", "32", "35"],
    correctIndex: 2,
    explanation:
      "The nth term of an arithmetic progression is aₙ = a₁ + (n − 1)d. Here, a₁ = 5, d = 3, and n = 10, so a₁₀ = 5 + 9 × 3 = 32.",
  },
  {
    id: "jee-chem-equilibrium",
    exam: "JEE",
    subject: "Chemistry",
    chapter: "Chemical Equilibrium",
    topic: "Le Chatelier's principle",
    difficulty: "Advanced",
    prompt: "For the exothermic reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), what is the effect of increasing pressure at constant temperature?",
    options: [
      "Equilibrium shifts toward the reactants",
      "Equilibrium shifts toward ammonia",
      "The equilibrium position does not change",
      "The equilibrium constant increases",
    ],
    correctIndex: 1,
    explanation:
      "Increasing pressure favours the side with fewer moles of gas. The reactant side has four moles of gas and the product side has two, so equilibrium shifts toward ammonia. At constant temperature, the equilibrium constant does not change.",
  },
];

export const questionExams = ["CET", "NEET", "JEE"] as const;
export const questionDifficulties = ["Basic", "Medium", "Advanced"] as const;
