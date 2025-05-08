'use client'

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { addQuestion, updateQuestion } from "@/app/actions/questions"
import { toast } from "@/hooks/use-toast"
import { Question } from "@prisma/client"

interface AddQuestionDialogProps {
  onQuestionAdded?: () => void
  question?: Question
  isEdit?: boolean
  trigger?: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function AddQuestionDialog({ 
  onQuestionAdded, 
  question, 
  isEdit = false,
  trigger,
  onOpenChange
}: AddQuestionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    explanation: ""
  })
  const titleInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Populate form data when editing an existing question
  useEffect(() => {
    if (question && isEdit) {
      setFormData({
        title: question.title,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD || "",
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      })
    }
  }, [question, isEdit])

  // Focus on title input when dialog opens
  useEffect(() => {
    if (open && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate correct answer format
      const correctAnswer = formData.correctAnswer.trim().toUpperCase()
      if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
        toast({
          title: "Invalid correct answer",
          description: "The correct answer must be A, B, C, or D",
          variant: "destructive"
        })
        setLoading(false)
        return
      }
      
      if (isEdit && question) {
        // Update the question
        await updateQuestion({
          id: question.id,
          ...formData,
          correctAnswer
        })
        
        // Show success message
        toast({
          title: "Question updated",
          description: "The question has been updated successfully",
        })
      } else {
        // Create the question
        await addQuestion({
          ...formData,
          correctAnswer
        })
        
        // Show success message
        toast({
          title: "Question added",
          description: "The question has been added successfully",
        })
      }
      
      // Reset form if not editing
      if (!isEdit) {
        setFormData({
          title: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
          explanation: ""
        })
      }
      
      // Call the callback if provided
      if (onQuestionAdded) {
        onQuestionAdded()
      }
      
      // Close dialog if editing
      if (isEdit) {
        setOpen(false)
      } else {
        // Focus back on the title input after submitting
        setTimeout(() => {
          titleInputRef.current?.focus()
        }, 0)
      }
    } catch (error) {
      toast({
        title: isEdit ? "Failed to update question" : "Failed to add question",
        description: `There was an error ${isEdit ? 'updating' : 'adding'} the question. Please try again.`,
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, inputName: string) => {
    if (e.key === 'Enter') {
      if (inputName === 'explanation') {
        // Submit the form when Enter is pressed in the explanation field
        e.preventDefault()
        formRef.current?.requestSubmit()
      } else if (inputName !== 'explanation') {
        e.preventDefault()
        
        // Define the input order
        const inputOrder = ['title', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'explanation', 'submit']
        
        // Find the next input to focus
        const currentIndex = inputOrder.indexOf(inputName)
        const nextInput = inputOrder[currentIndex + 1]
        
        // Focus the next input
        if (nextInput === 'submit') {
          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
          submitButton?.focus()
        } else {
          const nextInputElement = document.getElementById(nextInput) as HTMLInputElement | HTMLTextAreaElement
          nextInputElement?.focus()
        }
      }
    }
  }

  const defaultTrigger = (
    <Button>
      {isEdit ? (
        <Pencil className="h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {isEdit ? 'Edit Question' : 'Add Question'}
    </Button>
  )

  // Call the external onOpenChange handler when our internal state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Question Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter your question here"
                value={formData.title}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'title')}
                ref={titleInputRef}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="optionA">Option A</Label>
              <Input
                id="optionA"
                name="optionA"
                placeholder="Enter option A"
                value={formData.optionA}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'optionA')}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="optionB">Option B</Label>
              <Input
                id="optionB"
                name="optionB"
                placeholder="Enter option B"
                value={formData.optionB}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'optionB')}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="optionC">Option C</Label>
              <Input
                id="optionC"
                name="optionC"
                placeholder="Enter option C"
                value={formData.optionC}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'optionC')}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="optionD">Option D</Label>
              <Input
                id="optionD"
                name="optionD"
                placeholder="Enter option D"
                value={formData.optionD}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'optionD')}
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="correctAnswer">Correct Answer (A, B, C or D)</Label>
              <Input
                id="correctAnswer"
                name="correctAnswer"
                placeholder="Enter the correct answer (A, B, C or D)"
                value={formData.correctAnswer}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'correctAnswer')}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea
                id="explanation"
                name="explanation"
                placeholder="Explain why the correct answer is right"
                value={formData.explanation}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 'explanation')}
                className="min-h-[80px]"
                required
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : isEdit ? 'Update' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 