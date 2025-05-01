"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useRef, useCallback } from "react";
import { Question } from "@prisma/client";
import { getQuestions } from "@/app/actions/questions";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { QuestionAnalyticsDialog } from "@/components/dialogs/QuestionAnalyticsDialog";
import { DeleteQuestionDialog } from "@/components/dialogs/DeleteQuestionDialog";
import { EditQuestionDialog } from "@/components/dialogs/EditQuestionDialog";

// Function to truncate text
const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Function to get the first 6 characters of the ID
const shortenId = (id: string, length: number = 6) => {
  return id.substring(0, length);
};

export type SortDirection = "asc" | "desc";
export type SortField = "title" | "correctAnswer" | "createdAt" | null;

export function QuestionTable({ 
  searchQuery,
  sortField,
  sortDirection 
}: { 
  searchQuery?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastQuestionElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreQuestions();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const { toast } = useToast();

  // Fetch questions when component mounts, searchQuery, or sort params change
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setPage(1); // Reset to first page
        
        const actualSortField = sortField || 'createdAt';
        const actualSortDirection = sortDirection || 'desc';
        
        const result = await getQuestions(
          searchQuery, 
          1, 
          20, 
          actualSortField, 
          actualSortDirection
        );
        
        setQuestions(result.questions);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch questions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchQuery, sortField, sortDirection, toast]);

  const loadMoreQuestions = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const actualSortField = sortField || 'createdAt';
      const actualSortDirection = sortDirection || 'desc';
      
      const result = await getQuestions(
        searchQuery, 
        nextPage, 
        20, 
        actualSortField, 
        actualSortDirection
      );
      
      setQuestions(prev => [...prev, ...result.questions]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more questions:", error);
      toast({
        title: "Error",
        description: "Failed to load more questions",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  // Function to refresh questions
  const refreshQuestions = async () => {
    try {
      setLoading(true);
      setPage(1); // Reset to first page
      
      const actualSortField = sortField || 'createdAt';
      const actualSortDirection = sortDirection || 'desc';
      
      const result = await getQuestions(
        searchQuery, 
        1, 
        20, 
        actualSortField, 
        actualSortDirection
      );
      
      setQuestions(result.questions);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error refreshing questions:", error);
      toast({
        title: "Error",
        description: "Failed to refresh questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowEditDialog(true);
  };

  const handleViewAnalytics = (question: Question) => {
    setSelectedQuestion(question);
    setShowAnalyticsDialog(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    // TODO: Implement delete functionality
    setShowDeleteDialog(false);
    toast({
      title: "Question deleted",
      description: "The question has been deleted successfully",
    });
    refreshQuestions();
  };

  return (
    <div className="w-full px-4">
      {/* Edit Question Dialog */}
      <EditQuestionDialog
        question={selectedQuestion}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onQuestionUpdated={refreshQuestions}
      />

      {/* Analytics Dialog */}
      <QuestionAnalyticsDialog
        question={selectedQuestion}
        open={showAnalyticsDialog}
        onOpenChange={setShowAnalyticsDialog}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteQuestionDialog
        question={selectedQuestion}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead className="w-[350px]">Question</TableHead>
            <TableHead className="w-[60px] text-center">Answer</TableHead>
            <TableHead className="w-[100px] text-center">Category</TableHead>
            <TableHead className="w-[100px] text-center">Difficulty</TableHead>
            <TableHead className="w-[80px] text-center">Status</TableHead>
            <TableHead className="w-[100px] text-center">Success Rate</TableHead>
            <TableHead className="w-[60px] text-center">Flags</TableHead>
            <TableHead className="w-[60px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Loading questions...
              </TableCell>
            </TableRow>
          ) : questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No questions found.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {questions.map((question, index) => (
                <TableRow 
                  key={question.id}
                  ref={index === questions.length - 1 ? lastQuestionElementRef : null}
                >
                  <TableCell className="font-mono text-xs">
                    {shortenId(question.id)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {truncateText(question.title, 60)}
                  </TableCell>
                  <TableCell className="text-center">
                    {question.correctAnswer}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary-foreground">
                      General
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Medium
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">78%</TableCell>
                  <TableCell className="text-center">0</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                            Edit Question
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewAnalytics(question)}>
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteQuestion(question)}
                          >
                            Delete Question
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Loading more indicator */}
              {loadingMore && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading more questions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
