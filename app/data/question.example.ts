export interface Question {
    id: number;
    type: "text" | "image";
    question: string;
    options: string[];
    correctAnswer: number;
    imageUrl?: string;
  }
  
  export const questions: Question[] = [
    {
      id: 1,
      type: "text",
      question: "What does a red traffic light mean?",
      options: [
        "Slow down and proceed with caution",
        "Stop completely until the light turns green",
        "Stop only if other vehicles are approaching",
        "Yield to oncoming traffic",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "text",
      question:
        "What is the speed limit in a residential area unless otherwise posted?",
      options: ["15 mph", "25 mph", "35 mph", "45 mph"],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: "image",
      question: "What does this sign mean?",
      imageUrl: "/placeholder.svg?height=200&width=200",
      options: ["Stop", "Yield", "No entry", "Railroad crossing"],
      correctAnswer: 0,
    },
    {
      id: 4,
      type: "text",
      question: "When driving in fog, you should use your:",
      options: [
        "High beam headlights",
        "Low beam headlights",
        "Parking lights only",
        "Hazard lights only",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      type: "image",
      question: "What does this road marking indicate?",
      imageUrl: "/placeholder.svg?height=200&width=200",
      options: [
        "You can pass other vehicles",
        "No passing zone",
        "Two-way traffic ahead",
        "Merge left",
      ],
      correctAnswer: 1,
    },
  ]; 