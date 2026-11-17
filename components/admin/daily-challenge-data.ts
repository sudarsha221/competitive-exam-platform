import { initialAdminChapters } from "@/components/admin/chapter-data";
import {
  initialAdminQuestions,
  questionDifficultyOptions,
  type AdminDifficulty,
} from "@/components/admin/question-data";
import {
  initialAdminSubjects,
  subjectExamOptions,
  type SubjectExam,
} from "@/components/admin/subject-data";

export type AdminChallengeStatus = "Draft" | "Scheduled" | "Published" | "Completed";

export type ChallengeQuestion = {
  id: string;
  exam: SubjectExam;
  subject: string;
  chapter: string;
  difficulty: AdminDifficulty;
  prompt: string;
};

export type AdminDailyChallenge = {
  id: string;
  title: string;
  exam: SubjectExam;
  startDate: string;
  questionIds: string[];
  status: AdminChallengeStatus;
  participants: number;
  completedStudents: number;
};

const examPrefixes: Record<SubjectExam, string> = {
  KCET: "KCET",
  NEET: "NEET",
  "JEE Main": "JEE",
};

const promptTemplates: Record<string, ((variant: number) => string)[]> = {
  Physics: [
    (n) => `A ${n + 2} kg trolley accelerates at ${n + 3} m/s². What net force acts on it?`,
    (n) => `A ${n + 4} kg object moves at ${n + 5} m/s. What is its linear momentum?`,
    (n) => `A force of ${n + 6} N moves an object ${n + 2} m in the same direction. How much work is done?`,
    (n) => `A ${n + 3} Ω resistor is connected to a ${n + 9} V source. What current flows through it?`,
    (n) => `A wave has frequency ${n + 2} Hz and wavelength ${n + 1} m. What is its speed?`,
  ],
  Chemistry: [
    (n) => `How many moles are present in ${n + 2} g of a substance with molar mass ${n + 4} g/mol?`,
    (n) => `A solution contains ${n + 1} mol of solute in ${n + 3} L. What is its molarity?`,
    (n) => `How many electrons are in the outermost shell of a neutral atom with atomic number ${n + 5}?`,
    (n) => `A reaction releases ${n + 4} kJ of energy per mole. Is the process exothermic or endothermic?`,
    (n) => `How many total atoms are represented by ${n + 1} molecules of a triatomic substance?`,
  ],
  Mathematics: [
    (n) => `Evaluate 2x + ${n + 3} when x = ${n + 1}.`,
    (n) => `What is the derivative of x^${n + 2} with respect to x?`,
    (n) => `A sequence begins ${n + 1}, ${n + 4}, ${n + 7}, … . What is its common difference?`,
    (n) => `Find the discriminant of x² + ${n + 2}x + ${n + 1} = 0.`,
    (n) => `What is the slope of a line passing through (0, ${n + 1}) and (2, ${n + 5})?`,
  ],
  Biology: [
    (n) => `Which organelle produces most cellular ATP in a eukaryotic cell from sample ${n + 1}?`,
    (n) => `In a cross Aa × Aa, what fraction of offspring are expected to be homozygous recessive in trial ${n + 1}?`,
    (n) => `Which cell structure regulates the movement of substances into a cell in specimen ${n + 1}?`,
    (n) => `Which molecule carries hereditary information in the cell sample numbered ${n + 1}?`,
    (n) => `Which blood component transports oxygen in a healthy sample numbered ${n + 1}?`,
  ],
};

function getQuestionBankForExam(exam: SubjectExam): ChallengeQuestion[] {
  const existing = initialAdminQuestions
    .filter((question) => question.exam === exam)
    .map((question) => ({
      id: question.id,
      exam,
      subject: question.subject,
      chapter: question.chapter,
      difficulty: question.difficulty,
      prompt: question.prompt,
    }));
  const subjects = [...new Set(initialAdminSubjects
    .filter((subject) => subject.exam === exam)
    .map((subject) => subject.name))];
  const prefix = examPrefixes[exam];
  const supplemental = Array.from({ length: Math.max(0, 30 - existing.length) }, (_, index) => {
    const bankNumber = existing.length + index + 1;
    const subject = subjects[index % subjects.length] ?? "Physics";
    const chapter = initialAdminChapters.find((item) =>
      item.exam === exam && item.subject === subject,
    )?.name ?? "General Concepts";
    const templates = promptTemplates[subject] ?? promptTemplates.Physics;
    const template = templates[index % templates.length];
    return {
      id: `${prefix}-SAMPLE-${String(bankNumber).padStart(3, "0")}`,
      exam,
      subject,
      chapter,
      difficulty: questionDifficultyOptions[index % questionDifficultyOptions.length],
      prompt: `Sample bank question ${bankNumber}: ${template(index + 1)}`,
    };
  });

  return [...existing, ...supplemental];
}

export const dailyChallengeQuestionBank: ChallengeQuestion[] = subjectExamOptions
  .flatMap((exam) => getQuestionBankForExam(exam));

function createSampleChallenge(
  id: string,
  title: string,
  exam: SubjectExam,
  startDate: string,
  status: AdminChallengeStatus,
  participants: number,
  completedStudents: number,
  questionCount = 30,
): AdminDailyChallenge {
  const questionIds = dailyChallengeQuestionBank
    .filter((question) => question.exam === exam)
    .slice(0, questionCount)
    .map((question) => question.id);

  return {
    id,
    title,
    exam,
    startDate,
    questionIds,
    status,
    participants,
    completedStudents,
  };
}

export const initialAdminDailyChallenges: AdminDailyChallenge[] = [
  createSampleChallenge("challenge-kcet-nov-week-2", "KCET Momentum Sprint", "KCET", "2026-11-08", "Published", 840, 492),
  createSampleChallenge("challenge-kcet-nov-week-4", "KCET November Challenge", "KCET", "2026-11-22", "Scheduled", 0, 0),
  createSampleChallenge("challenge-kcet-draft-dec", "KCET December Practice Cycle", "KCET", "2026-12-01", "Draft", 0, 0, 18),
  createSampleChallenge("challenge-neet-nov-week-2", "NEET Biology & Beyond", "NEET", "2026-11-12", "Published", 1260, 806),
  createSampleChallenge("challenge-neet-nov-week-3", "NEET November Challenge", "NEET", "2026-11-20", "Scheduled", 0, 0),
  createSampleChallenge("challenge-neet-oct-cycle", "NEET October Revision", "NEET", "2026-10-10", "Completed", 1480, 1112),
  createSampleChallenge("challenge-jee-nov-week-2", "JEE Problem Solving Run", "JEE Main", "2026-11-14", "Published", 980, 524),
  createSampleChallenge("challenge-jee-nov-week-4", "JEE November Challenge", "JEE Main", "2026-11-25", "Scheduled", 0, 0),
  createSampleChallenge("challenge-jee-draft-dec", "JEE December Practice Cycle", "JEE Main", "2026-12-03", "Draft", 0, 0, 22),
  createSampleChallenge("challenge-jee-oct-cycle", "JEE October Revision", "JEE Main", "2026-10-12", "Completed", 1320, 936),
];
