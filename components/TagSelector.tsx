import { ProblemTag } from "@/types/Codeforces";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const TagSelector = ({
  allTags,
  selectedTags,
  onTagClick,
  onClearTags,
}: {
  allTags: ProblemTag[];
  selectedTags: ProblemTag[];
  onTagClick: (tag: ProblemTag) => void;
  onClearTags: () => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">
          Problems will be generated randomly if no tags are selected.
        </span>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearTags}
              className="h-8 px-3 text-xs hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="w-full rounded-xl border-2 border-border/50 bg-muted/20">
        <div className="flex flex-wrap gap-2 p-4">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Button
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onTagClick(tag)}
                size="sm"
                title={tag.name}
                className={`transition-all duration-300 ${isSelected
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl scale-105"
                  : "hover:border-primary/50 hover:bg-primary/10 hover:scale-105 hover:text-green-500 hover:cursor-pointer hover:font-semibold"
                }`}
              >
                {tag.name}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TagSelector;
