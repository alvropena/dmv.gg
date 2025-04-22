import { GraduationCap, Clock, BookOpen, Brain } from "lucide-react";

export const studyTips = [
  {
    icon: GraduationCap,
    title: "Take practice tests regularly",
    description: "Reinforces knowledge and identifies weak areas."
  },
  {
    icon: Clock,
    title: "Study in short sessions",
    description: "Short sessions are more effective than cramming."
  },
  {
    icon: BookOpen,
    title: "Review the handbook",
    description: "Focus on sections where you make mistakes."
  },
  {
    icon: Brain,
    title: "Use memory techniques",
    description: "Mnemonics help remember signs and rules."
  }
] as const; 