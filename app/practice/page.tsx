import type { Metadata } from "next";
import { PracticeInterface } from "@/components/practice/practice-interface";

export const metadata: Metadata = {
  title: "Practice Questions | Northstar",
  description: "Interactive sample exam questions for CET, NEET, and JEE preparation.",
};

export default function PracticePage() {
  return <PracticeInterface />;
}
