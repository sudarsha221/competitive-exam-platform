export type AnalyticsExam = "All exams" | "KCET" | "NEET" | "JEE Main";
export type TrackedExam = Exclude<AnalyticsExam, "All exams">;
export type AnalyticsRange = 3 | 6 | 12;
export type LeaderboardPeriod = "Daily" | "Weekly" | "Monthly" | "All Time";

export type MonthlyAnalyticsPoint = {
  label: string;
  registrations: number;
  questions: number;
  correct: number;
  challengeRate: number;
};

export type ExamAnalyticsSummary = {
  students: number;
  questions: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  challengeParticipants: number;
  challengeRate: number;
  activeStudents: number;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  exam: TrackedExam;
  questions: number;
  correct: number;
  accuracy: number;
  streak: number;
};

export const trackedExams: TrackedExam[] = ["KCET", "NEET", "JEE Main"];
export const analyticsRanges: Array<{ value: AnalyticsRange; label: string }> = [
  { value: 3, label: "Last 3 months" },
  { value: 6, label: "Last 6 months" },
  { value: 12, label: "Last 12 months" },
];
export const leaderboardPeriods: LeaderboardPeriod[] = ["Daily", "Weekly", "Monthly", "All Time"];

const monthLabels = ["Dec '25", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function buildMonthlySeries(
  registrations: number[],
  questions: number[],
  accuracies: number[],
  challengeRates: number[],
): MonthlyAnalyticsPoint[] {
  return monthLabels.map((label, index) => ({
    label,
    registrations: registrations[index],
    questions: questions[index],
    correct: Math.round((questions[index] * accuracies[index]) / 100),
    challengeRate: challengeRates[index],
  }));
}

export const examMonthlyAnalytics: Record<TrackedExam, MonthlyAnalyticsPoint[]> = {
  KCET: buildMonthlySeries(
    [420, 480, 515, 540, 570, 620, 655, 700, 745, 780, 840, 910],
    [60000, 68000, 72000, 76000, 81000, 85000, 91000, 95000, 102000, 108000, 117000, 132000],
    [81, 82, 82, 83, 82, 83, 84, 83, 84, 83, 84, 85],
    [58, 60, 61, 63, 64, 66, 65, 68, 70, 71, 72, 75],
  ),
  NEET: buildMonthlySeries(
    [610, 680, 720, 770, 820, 880, 940, 995, 1050, 1130, 1200, 1280],
    [75000, 82000, 88000, 96000, 102000, 112000, 123000, 128000, 136000, 145000, 158000, 178000],
    [83, 84, 84, 85, 84, 85, 86, 85, 86, 85, 86, 87],
    [62, 64, 65, 66, 68, 69, 71, 72, 74, 75, 77, 80],
  ),
  "JEE Main": buildMonthlySeries(
    [350, 390, 420, 460, 495, 530, 560, 600, 650, 700, 760, 820],
    [54000, 59000, 64000, 69000, 74000, 79000, 85000, 91000, 97000, 105000, 117000, 131000],
    [76, 77, 77, 78, 77, 78, 79, 78, 79, 78, 80, 81],
    [50, 52, 53, 55, 56, 58, 59, 61, 63, 65, 67, 70],
  ),
};

export function getAnalyticsSeries(exam: AnalyticsExam, range: AnalyticsRange) {
  const selectedSeries =
    exam === "All exams"
      ? monthLabels.map((label, index) => {
          const points = trackedExams.map((trackedExam) => examMonthlyAnalytics[trackedExam][index]);
          const registrations = points.reduce((total, point) => total + point.registrations, 0);
          const weightedChallengeRate = points.reduce(
            (total, point) => total + point.registrations * point.challengeRate,
            0,
          );
          return {
            label,
            registrations,
            questions: points.reduce((total, point) => total + point.questions, 0),
            correct: points.reduce((total, point) => total + point.correct, 0),
            challengeRate: registrations ? Math.round(weightedChallengeRate / registrations) : 0,
          };
        })
      : examMonthlyAnalytics[exam];

  return selectedSeries.slice(-range);
}

export function getExamAnalyticsSummary(exam: AnalyticsExam, range: AnalyticsRange): ExamAnalyticsSummary {
  const summaries = (exam === "All exams" ? trackedExams : [exam]).map((trackedExam) => {
    const points = examMonthlyAnalytics[trackedExam].slice(-range);
    const students = points.reduce((total, point) => total + point.registrations, 0);
    const questions = points.reduce((total, point) => total + point.questions, 0);
    const correct = points.reduce((total, point) => total + point.correct, 0);
    const challengeParticipants = points.reduce(
      (total, point) => total + Math.round((point.registrations * point.challengeRate) / 100),
      0,
    );
    return {
      students,
      questions,
      correct,
      incorrect: questions - correct,
      challengeParticipants,
      activeStudents: Math.round(students * 0.82),
    };
  });

  const summary = summaries.reduce(
    (total, current) => ({
      students: total.students + current.students,
      questions: total.questions + current.questions,
      correct: total.correct + current.correct,
      incorrect: total.incorrect + current.incorrect,
      challengeParticipants: total.challengeParticipants + current.challengeParticipants,
      activeStudents: total.activeStudents + current.activeStudents,
    }),
    { students: 0, questions: 0, correct: 0, incorrect: 0, challengeParticipants: 0, activeStudents: 0 },
  );
  const challengeRate = summary.students
    ? Math.round((summary.challengeParticipants / summary.students) * 100)
    : 0;

  return {
    ...summary,
    accuracy: summary.questions ? Math.round((summary.correct / summary.questions) * 100) : 0,
    challengeRate,
  };
}

export function getPerExamSummaries(range: AnalyticsRange): Record<TrackedExam, ExamAnalyticsSummary> {
  return {
    KCET: getExamAnalyticsSummary("KCET", range),
    NEET: getExamAnalyticsSummary("NEET", range),
    "JEE Main": getExamAnalyticsSummary("JEE Main", range),
  };
}

type LeaderboardSeed = {
  name: string;
  questions: number;
  accuracy: number;
  streak: number;
};

const leaderboardSeeds: Record<TrackedExam, LeaderboardSeed[]> = {
  KCET: [
    { name: "Ananya Desai", questions: 1840, accuracy: 94, streak: 18 },
    { name: "Kabir Shah", questions: 1725, accuracy: 91, streak: 14 },
    { name: "Sana Khan", questions: 1612, accuracy: 92, streak: 21 },
    { name: "Priya Nair", questions: 1488, accuracy: 89, streak: 11 },
    { name: "Rohan Kulkarni", questions: 1396, accuracy: 87, streak: 9 },
    { name: "Aarav Sharma", questions: 1280, accuracy: 90, streak: 15 },
    { name: "Isha Kulkarni", questions: 1176, accuracy: 88, streak: 12 },
    { name: "Dev Patel", questions: 1084, accuracy: 85, streak: 8 },
  ],
  NEET: [
    { name: "Isha Kulkarni", questions: 2420, accuracy: 96, streak: 24 },
    { name: "Ananya Desai", questions: 2268, accuracy: 94, streak: 18 },
    { name: "Dev Patel", questions: 2115, accuracy: 93, streak: 20 },
    { name: "Aarav Sharma", questions: 1986, accuracy: 91, streak: 15 },
    { name: "Priya Nair", questions: 1842, accuracy: 89, streak: 11 },
    { name: "Sana Khan", questions: 1705, accuracy: 92, streak: 21 },
    { name: "Kabir Shah", questions: 1590, accuracy: 87, streak: 14 },
    { name: "Nisha Rao", questions: 1468, accuracy: 90, streak: 12 },
  ],
  "JEE Main": [
    { name: "Kabir Shah", questions: 2055, accuracy: 93, streak: 14 },
    { name: "Arjun Mehta", questions: 1920, accuracy: 90, streak: 13 },
    { name: "Aarav Sharma", questions: 1812, accuracy: 91, streak: 15 },
    { name: "Dev Patel", questions: 1684, accuracy: 88, streak: 20 },
    { name: "Rohan Kulkarni", questions: 1556, accuracy: 87, streak: 9 },
    { name: "Isha Kulkarni", questions: 1442, accuracy: 89, streak: 12 },
    { name: "Ananya Desai", questions: 1320, accuracy: 86, streak: 18 },
    { name: "Nisha Rao", questions: 1208, accuracy: 85, streak: 12 },
  ],
};

const leaderboardPeriodFactors: Record<LeaderboardPeriod, number> = {
  Daily: 0.018,
  Weekly: 0.09,
  Monthly: 0.34,
  "All Time": 1,
};

export function getLeaderboardEntries(
  exam: AnalyticsExam,
  period: LeaderboardPeriod,
): LeaderboardEntry[] {
  const exams = exam === "All exams" ? trackedExams : [exam];
  const factor = leaderboardPeriodFactors[period];
  return exams
    .flatMap((trackedExam) =>
      leaderboardSeeds[trackedExam].map((seed) => {
        const questions = Math.max(period === "Daily" ? 6 : 30, Math.round(seed.questions * factor));
        return {
          name: seed.name,
          exam: trackedExam,
          questions,
          correct: Math.round((questions * seed.accuracy) / 100),
          accuracy: seed.accuracy,
          streak:
            period === "Daily"
              ? Math.min(seed.streak, 1)
              : period === "Weekly"
                ? Math.min(seed.streak, 7)
                : period === "Monthly"
                  ? Math.min(seed.streak, 30)
                  : seed.streak,
        };
      }),
    )
    .sort((first, second) => second.questions - first.questions || second.accuracy - first.accuracy)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
