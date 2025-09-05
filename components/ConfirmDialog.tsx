"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { TrainingProblem } from "@/types/TrainingProblem";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  problem?: TrainingProblem | null;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  problem,
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-sm">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Delete Problem
            </DialogTitle>
          </div>

          <DialogDescription className="text-left space-y-3">
            <p className="text-muted-foreground">
              Are you sure you want to remove this problem from your upsolve list?
            </p>

            {problem && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm">Problem Details:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground font-medium truncate" title={problem.name}>
                      {problem.name}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Rating: {problem.rating}</span>
                      <span>•</span>
                      <span>Contest: {problem.contestId}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              This action cannot be undone. The problem will be permanently removed from your upsolve list.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-border/50 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Problem
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
