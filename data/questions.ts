import type { Question } from "@/types";

// Define a type that matches how questions are used in page.tsx
export interface DemoQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index of the correct answer in the options array
}

// Convert the Question interface to the DemoQuestion format
const convertQuestion = (q: Question): DemoQuestion => {
    const options = [q.optionA, q.optionB, q.optionC];
    if (q.optionD) {
        options.push(q.optionD);
    }

    // Find the index of the correct answer in the options array
    const correctAnswerIndex = options.findIndex(option => option === q.correctAnswer);

    return {
        question: q.title,
        options,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0, // Default to 0 if not found
    };
};

// Sample questions data
const sampleQuestions: Question[] = [
    {
        id: "1",
        title: "What does a red traffic light mean?",
        optionA: "Slow down and proceed with caution",
        optionB: "Stop and wait until the light turns green",
        optionC: "Speed up to get through the intersection",
        optionD: "Turn right only",
        correctAnswer: "Stop and wait until the light turns green",
        explanation: "A red traffic light means you must come to a complete stop and wait until the light turns green before proceeding.",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        id: "2",
        title: "What is the speed limit in a residential area?",
        optionA: "25 mph",
        optionB: "35 mph",
        optionC: "45 mph",
        optionD: "55 mph",
        correctAnswer: "25 mph",
        explanation: "The speed limit in residential areas is typically 25 mph to ensure the safety of pedestrians and children.",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        id: "3",
        title: "When should you use your turn signals?",
        optionA: "Only when turning right",
        optionB: "Only when turning left",
        optionC: "When changing lanes or turning in any direction",
        optionD: "Only when there are other vehicles nearby",
        correctAnswer: "When changing lanes or turning in any direction",
        explanation: "You should always use your turn signals when changing lanes or turning in any direction to communicate your intentions to other drivers.",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        id: "4",
        title: "What does a yellow traffic light mean?",
        optionA: "Speed up to get through the intersection",
        optionB: "Stop if it's safe to do so, otherwise proceed with caution",
        optionC: "Come to a complete stop",
        optionD: "Turn right only",
        correctAnswer: "Stop if it's safe to do so, otherwise proceed with caution",
        explanation: "A yellow traffic light means the light is about to turn red. You should stop if it's safe to do so, otherwise proceed with caution.",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        id: "5",
        title: "What should you do when approaching a school bus with flashing red lights?",
        optionA: "Speed up to pass the bus quickly",
        optionB: "Stop and wait until the bus turns off its lights and continues moving",
        optionC: "Honk your horn to alert the bus driver",
        optionD: "Drive around the bus on the left side",
        correctAnswer: "Stop and wait until the bus turns off its lights and continues moving",
        explanation: "When approaching a school bus with flashing red lights, you must stop and wait until the bus turns off its lights and continues moving, regardless of which direction you're traveling.",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    }
];

// Export the questions in the format expected by page.tsx
export const questions: DemoQuestion[] = sampleQuestions.map(convertQuestion);
