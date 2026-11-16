import type { Metadata } from "next";
import { DailyChallenge } from "@/components/challenges/daily-challenge";

export const metadata: Metadata = {
  title: "Daily Challenges | Northstar",
  description: "A 30-day sample challenge experience for CET, NEET, and JEE students.",
};

export default function DailyChallengesPage() {
  return <DailyChallenge />;
}
