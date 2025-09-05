"use client";

import { TrainingProblem } from "@/types/TrainingProblem";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  CheckCircle2,
  ExternalLink,
  Clock,
  Trophy,
  Target
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const getDifficultyColor = (rating: number) => {
  if (rating >= 2400) return "bg-red-500/10 text-red-600 border-red-500/20";
  if (rating >= 2100) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  if (rating >= 1900) return "bg-purple-500/10 text-purple-600 border-purple-500/20";
  if (rating >= 1600) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (rating >= 1400) return "bg-green-500/10 text-green-600 border-green-500/20";
  if (rating >= 1200) return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  return "bg-muted/10 text-muted-foreground border-muted/20";
};

const UpsolvedProblemsList = ({
  upsolvedProblems,
  onDelete,
}: {
  upsolvedProblems: TrainingProblem[];
  onDelete: (problem: TrainingProblem) => void;
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block w-full">
        <Card className="border-border/50 shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-muted/30">
                  <TableHead className="font-semibold text-foreground py-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Problem
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground w-32">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Rating
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground w-24">Status</TableHead>
                  <TableHead className="w-20 text-right font-semibold text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upsolvedProblems.map((problem, index) => (
                  <TableRow
                    key={problem.contestId + problem.index}
                    className="border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="py-4">
                      <Link
                        className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 group"
                        href={problem.url}
                        target="_blank"
                        title={problem.name}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate hover:underline group-hover:underline">
                              {problem.name}
                            </span>
                            <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(problem.rating || 0)} font-medium`}
                      >
                        {problem.rating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {problem.solvedTime ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-500 font-medium">Solved</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-500 font-medium">Pending</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(problem)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {upsolvedProblems.map((problem, index) => (
          <Card
            key={problem.contestId + problem.index}
            className="border-border/50 hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-card to-muted/10"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Header with problem number and delete button */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Problem {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        {problem.solvedTime ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Solved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(problem)}
                    className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Problem details */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                  <Link
                    className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 group block"
                    href={problem.url}
                    target="_blank"
                    title={problem.name}
                  >
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <span className="flex-1 text-sm break-words leading-tight group-hover:underline">
                        {problem.name}
                      </span>
                      <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">Rating</p>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(problem.rating || 0)} text-xs`}
                      >
                        {problem.rating}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default UpsolvedProblemsList;
