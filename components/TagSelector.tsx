import { ProblemTag } from "@/types/Codeforces";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Sparkles,
  Tag as TagIcon
} from "lucide-react";

// Function to get color scheme for tag
const getTagColorScheme = (tagName: string) => {
  const name = tagName.toLowerCase();

  if (name.includes('dp') || name.includes('dynamic'))
    return "from-purple-500 to-indigo-600 border-purple-500/30 text-white hover:from-purple-600 hover:to-indigo-700";
  if (name.includes('graph') || name.includes('tree') || name.includes('dfs') || name.includes('bfs'))
    return "from-green-500 to-emerald-600 border-green-500/30 text-white hover:from-green-600 hover:to-emerald-700";
  if (name.includes('math') || name.includes('number') || name.includes('combinatorics'))
    return "from-blue-500 to-cyan-600 border-blue-500/30 text-white hover:from-blue-600 hover:to-cyan-700";
  if (name.includes('greedy') || name.includes('implementation'))
    return "from-orange-500 to-red-600 border-orange-500/30 text-white hover:from-orange-600 hover:to-red-700";
  if (name.includes('binary') || name.includes('search') || name.includes('sort'))
    return "from-teal-500 to-cyan-600 border-teal-500/30 text-white hover:from-teal-600 hover:to-cyan-700";
  if (name.includes('string') || name.includes('hash'))
    return "from-pink-500 to-rose-600 border-pink-500/30 text-white hover:from-pink-600 hover:to-rose-700";
  if (name.includes('random') || name.includes('probability'))
    return "from-yellow-500 to-amber-600 border-yellow-500/30 text-white hover:from-yellow-600 hover:to-amber-700";
  if (name.includes('fast') || name.includes('optimization'))
    return "from-violet-500 to-purple-600 border-violet-500/30 text-white hover:from-violet-600 hover:to-purple-700";

  return "from-slate-500 to-gray-600 border-slate-500/30 text-white hover:from-slate-600 hover:to-gray-700";
};

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
    <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 xs:p-2 bg-primary/10 rounded-lg">
            <TagIcon className="h-3 w-3 xs:h-4 xs:w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium">
              Choose topics to focus your practice
            </p>
            <p className="text-xs text-muted-foreground/80 hidden xs:block">
              Leave empty for random problems across all topics
            </p>
          </div>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 xs:gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-2 xs:px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearTags}
              className="h-7 xs:h-8 px-2 xs:px-3 text-xs hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300 group"
            >
              <X className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden xs:inline">Clear All</span>
              <span className="xs:hidden">Clear</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tags Container */}
      <div className="relative">
        <div className="absolute -inset-0.5 xs:-inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-lg xs:rounded-xl blur-sm opacity-60"></div>
        <ScrollArea className="relative w-full rounded-lg xs:rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const colorScheme = getTagColorScheme(tag.name);

              return (
                <Button
                  key={tag.value}
                  variant="outline"
                  onClick={() => onTagClick(tag)}
                  size="sm"
                  title={`${tag.name} - Click to ${isSelected ? 'remove' : 'add'}`}
                  className={`group relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 
                    text-xs xs:text-sm sm:text-sm md:text-base
                    px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-5
                    py-1 xs:py-1.5 sm:py-2 md:py-2.5
                    min-h-[24px] xs:min-h-[28px] sm:min-h-[32px] md:min-h-[36px] lg:min-h-[40px]
                    ${isSelected
                  ? `bg-gradient-to-r ${colorScheme} border-0 shadow-lg hover:shadow-xl`
                  : "bg-background/80 hover:bg-background border-border/50 hover:border-primary/30 text-foreground hover:text-primary"
                } ${isSelected ? 'scale-105 shadow-md' : ''}`}
                >
                  <span className={`font-medium relative z-10 ${isSelected ? 'text-white' : 'group-hover:font-semibold'}`}>
                    {tag.name}
                  </span>

                  {/* Animated background for unselected tags */}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}

                  {/* Shine effect for selected tags */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TagSelector;
