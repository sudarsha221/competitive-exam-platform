import type { SubjectExam } from "@/components/admin/subject-data";

export type AdminDifficulty = "Basic" | "Medium" | "Advanced";
export type QuestionStatus = "Draft" | "Published" | "Archived";
export type CorrectIndex = 0 | 1 | 2 | 3;
export type AdminQuestionType = "MCQ (single correct answer)";

export type AdminQuestion = {
  id: string;
  exam: SubjectExam;
  subject: string;
  chapter: string;
  subtopic: string;
  difficulty: AdminDifficulty;
  questionType: AdminQuestionType;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: CorrectIndex;
  explanation: string;
  status: QuestionStatus;
  createdDate: string;
};

export type QuestionDraft = Pick<
  AdminQuestion,
  | "exam"
  | "subject"
  | "chapter"
  | "subtopic"
  | "difficulty"
  | "questionType"
  | "prompt"
  | "options"
  | "correctIndex"
  | "explanation"
>;

export const questionDifficultyOptions: AdminDifficulty[] = ["Basic", "Medium", "Advanced"];
export const questionStatusOptions: QuestionStatus[] = ["Draft", "Published", "Archived"];
export const questionTypeOptions: AdminQuestionType[] = ["MCQ (single correct answer)"];

export const initialAdminQuestions: AdminQuestion[] = [
  {
    id: "KCET-PHY-001",
    exam: "KCET",
    subject: "Physics",
    chapter: "Laws of Motion",
    subtopic: "Newton's First Law",
    difficulty: "Basic",
    questionType: "MCQ (single correct answer)",
    prompt: "A book resting on a table remains at rest until a student pushes it. Which principle best explains this observation?",
    options: [
      "The book has no mass",
      "An unbalanced external force changes its state of motion",
      "Gravity does not act on objects at rest",
      "Friction always causes an object to accelerate",
    ],
    correctIndex: 1,
    explanation: "Newton's first law states that an object remains at rest or in uniform motion unless acted upon by a net external force. The push provides the unbalanced force that changes the book's state.",
    status: "Published",
    createdDate: "Mar 04, 2024",
  },
  {
    id: "KCET-PHY-002",
    exam: "KCET",
    subject: "Physics",
    chapter: "Laws of Motion",
    subtopic: "Momentum and Impulse",
    difficulty: "Medium",
    questionType: "MCQ (single correct answer)",
    prompt: "A constant force of 6 N acts on an object for 2 s. What is the magnitude of the change in its momentum?",
    options: ["3 kg m/s", "8 kg m/s", "12 kg m/s", "24 kg m/s"],
    correctIndex: 2,
    explanation: "Impulse equals the change in momentum and is given by force multiplied by time. Therefore, the change in momentum is 6 N × 2 s = 12 N s, equivalent to 12 kg m/s.",
    status: "Draft",
    createdDate: "Mar 06, 2024",
  },
  {
    id: "NEET-PHY-001",
    exam: "NEET",
    subject: "Physics",
    chapter: "Electrostatics",
    subtopic: "Coulomb's Law",
    difficulty: "Medium",
    questionType: "MCQ (single correct answer)",
    prompt: "Two point charges are separated by a distance r. If their separation is doubled while the charges remain unchanged, how does the electrostatic force change?",
    options: ["It doubles", "It becomes four times as large", "It is halved", "It becomes one-fourth as large"],
    correctIndex: 3,
    explanation: "Coulomb's law gives force as proportional to 1/r². Doubling the separation changes the force by a factor of 1/(2²), so the new force is one-fourth of the original.",
    status: "Published",
    createdDate: "Mar 07, 2024",
  },
  {
    id: "KCET-CHEM-001",
    exam: "KCET",
    subject: "Chemistry",
    chapter: "Atomic Structure",
    subtopic: "Bohr's Atomic Model",
    difficulty: "Basic",
    questionType: "MCQ (single correct answer)",
    prompt: "In Bohr's model of the hydrogen atom, what happens when an electron moves from a lower energy level to a higher energy level?",
    options: ["It emits a photon", "It absorbs energy", "Its charge changes", "It loses all kinetic energy"],
    correctIndex: 1,
    explanation: "A transition to a higher energy level requires the electron to gain energy. The atom absorbs a photon whose energy matches the difference between the two allowed energy levels.",
    status: "Published",
    createdDate: "Mar 08, 2024",
  },
  {
    id: "JEE-CHEM-001",
    exam: "JEE Main",
    subject: "Chemistry",
    chapter: "Equilibrium",
    subtopic: "Le Chatelier's Principle",
    difficulty: "Advanced",
    questionType: "MCQ (single correct answer)",
    prompt: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), what is the effect of increasing pressure at constant temperature?",
    options: [
      "The equilibrium shifts toward the reactants",
      "The equilibrium shifts toward ammonia",
      "The equilibrium constant increases",
      "The equilibrium position is unchanged",
    ],
    correctIndex: 1,
    explanation: "Increasing pressure favours the side with fewer moles of gas. The reactant side has four moles of gas and the product side has two, so the equilibrium shifts toward ammonia. At constant temperature, the equilibrium constant is unchanged.",
    status: "Archived",
    createdDate: "Mar 09, 2024",
  },
  {
    id: "KCET-MATH-001",
    exam: "KCET",
    subject: "Mathematics",
    chapter: "Trigonometric Functions",
    subtopic: "Trigonometric Identities",
    difficulty: "Basic",
    questionType: "MCQ (single correct answer)",
    prompt: "Which expression is equivalent to 1 − cos²θ for every real value of θ?",
    options: ["sin²θ", "cos²θ", "tan²θ", "1 + sin²θ"],
    correctIndex: 0,
    explanation: "The Pythagorean identity sin²θ + cos²θ = 1 can be rearranged to give 1 − cos²θ = sin²θ.",
    status: "Published",
    createdDate: "Mar 11, 2024",
  },
  {
    id: "JEE-MATH-001",
    exam: "JEE Main",
    subject: "Mathematics",
    chapter: "Quadratic Equations",
    subtopic: "Nature of Roots",
    difficulty: "Medium",
    questionType: "MCQ (single correct answer)",
    prompt: "A quadratic equation has discriminant less than zero. What can be concluded about its roots?",
    options: [
      "It has two distinct real roots",
      "It has one repeated real root",
      "It has no real roots",
      "It has two equal positive roots",
    ],
    correctIndex: 2,
    explanation: "For a quadratic equation, a negative discriminant means the square root in the quadratic formula is not real. The equation therefore has no real roots.",
    status: "Published",
    createdDate: "Mar 12, 2024",
  },
  {
    id: "KCET-BIO-001",
    exam: "KCET",
    subject: "Biology",
    chapter: "Cell: Structure and Function",
    subtopic: "Cell Organelles",
    difficulty: "Basic",
    questionType: "MCQ (single correct answer)",
    prompt: "Which organelle is the primary site of aerobic cellular respiration and ATP production in eukaryotic cells?",
    options: ["Golgi apparatus", "Mitochondrion", "Lysosome", "Nucleolus"],
    correctIndex: 1,
    explanation: "Mitochondria contain the machinery for the citric acid cycle and oxidative phosphorylation, processes that produce most of the ATP during aerobic respiration.",
    status: "Published",
    createdDate: "Mar 13, 2024",
  },
  {
    id: "NEET-BIO-001",
    exam: "NEET",
    subject: "Biology",
    chapter: "Principles of Inheritance and Variation",
    subtopic: "Mendelian Inheritance",
    difficulty: "Medium",
    questionType: "MCQ (single correct answer)",
    prompt: "In a cross between two heterozygous individuals (Aa × Aa), what is the expected genotypic ratio?",
    options: ["3 : 1", "1 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1"],
    correctIndex: 2,
    explanation: "Each parent can contribute either A or a. The offspring genotypes are AA, Aa, Aa, and aa, giving the genotypic ratio 1 : 2 : 1.",
    status: "Draft",
    createdDate: "Mar 14, 2024",
  },
  {
    id: "JEE-PHY-001",
    exam: "JEE Main",
    subject: "Physics",
    chapter: "Kinematics",
    subtopic: "Projectile Motion",
    difficulty: "Medium",
    questionType: "MCQ (single correct answer)",
    prompt: "A projectile is launched at speed u at an angle θ above level ground. What is its initial vertical component of velocity?",
    options: ["u cos θ", "u sin θ", "u tan θ", "u / sin θ"],
    correctIndex: 1,
    explanation: "Resolving the launch velocity into perpendicular components gives a horizontal component u cos θ and a vertical component u sin θ.",
    status: "Published",
    createdDate: "Mar 15, 2024",
  },
  {
    id: "NEET-PHY-002",
    exam: "NEET",
    subject: "Physics",
    chapter: "Current Electricity",
    subtopic: "Ohm's Law",
    difficulty: "Basic",
    questionType: "MCQ (single correct answer)",
    prompt: "A 4 Ω resistor is connected across an ideal 12 V source. What current flows through the resistor?",
    options: ["0.33 A", "3 A", "8 A", "48 A"],
    correctIndex: 1,
    explanation: "Ohm's law gives I = V/R. Substituting 12 V and 4 Ω gives I = 12/4 = 3 A.",
    status: "Published",
    createdDate: "Mar 16, 2024",
  },
  {
    id: "JEE-MATH-002",
    exam: "JEE Main",
    subject: "Mathematics",
    chapter: "Integral Calculus",
    subtopic: "Definite Integrals",
    difficulty: "Medium",
    questionType: "MCQ (single correct answer)",
    prompt: "What is the value of the definite integral ∫₀¹ 2x dx?",
    options: ["0", "1", "2", "4"],
    correctIndex: 1,
    explanation: "An antiderivative of 2x is x². Evaluating from 0 to 1 gives 1² − 0² = 1.",
    status: "Published",
    createdDate: "Mar 18, 2024",
  },
];
