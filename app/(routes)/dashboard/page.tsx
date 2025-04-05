'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function CreateQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Remove optionD if it's empty
      const submitData = {
        ...formData,
        optionD: formData.optionD.trim() || undefined
      };

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Reset form and show success message or redirect
        setFormData({
          title: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctAnswer: '',
          explanation: ''
        });
        router.push('/dashboard'); // Or wherever you want to redirect after success
      } else {
        console.error('Failed to create question');
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-6">Create Quiz Question</h1>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter the question"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optionA">Option A</Label>
                <Input
                  id="optionA"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  placeholder="Enter option A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optionB">Option B</Label>
                <Input
                  id="optionB"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  placeholder="Enter option B"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optionC">Option C</Label>
                <Input
                  id="optionC"
                  name="optionC"
                  value={formData.optionC}
                  onChange={handleChange}
                  placeholder="Enter option C"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optionD">Option D (Optional)</Label>
                <Input
                  id="optionD"
                  name="optionD"
                  value={formData.optionD}
                  onChange={handleChange}
                  placeholder="Enter option D (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <Input
                  id="correctAnswer"
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  placeholder="Enter the correct answer (A, B, C, or D)"
                  required
                  pattern="[ABCDabcd]"
                  maxLength={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Explain why this answer is correct"
                  required
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}