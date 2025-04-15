"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

type WeakArea = {
  question: {
    id: string;
    title: string;
    correctAnswer: string;
    explanation: string;
  };
  incorrectCount: number;
};

type WeakAreasProps = {
  isLoading?: boolean;
};

export function WeakAreas({ isLoading = false }: WeakAreasProps) {
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWeakAreas = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/weak-areas");

        if (!response.ok) {
          throw new Error("Failed to fetch weak areas");
        }

        const data = await response.json();
        setWeakAreas(data.weakAreas || []);
      } catch (error) {
        console.error("Error fetching weak areas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeakAreas();
  }, []);

  const handleReviewQuestion = () => {
    // In a real implementation, you would navigate to a page that focuses on these weak areas
    // For now, we'll just navigate to the test page
    router.push("/test");
  };

  // Show loading indicator while fetching data
  if (loading || isLoading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weak Areas</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading weak areas...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state if no weak areas found
  if (weakAreas.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weak Areas</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">
                Complete more tests to identify your weak areas
              </p>
              <Button onClick={handleReviewQuestion} variant="outline">
                Take a Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weak Areas</h2>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Questions to Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weakAreas.map((weakArea) => (
              <div key={weakArea.question.id} className="border-b pb-3 last:border-b-0">
                <p className="font-medium text-sm line-clamp-2">{weakArea.question.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">
                    Incorrect {weakArea.incorrectCount} time{weakArea.incorrectCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleReviewQuestion}
            className="w-full mt-4"
            variant="outline"
          >
            Practice These Questions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 