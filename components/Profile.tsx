"use client";

import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = ({ user }: { user: User }) => {
  return (
    <Card className="card-premium group relative overflow-hidden border-2 border-border/50 hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
            <AvatarFallback>
              {user.codeforcesHandle.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-foreground truncate">
              {user.codeforcesHandle}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              {user.organization || "No organization"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4 flex-1 flex flex-col justify-end">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Rating</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {user.rating || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.rank || "Unrated"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Max Rating
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {user.maxRating || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.maxRank || "Unrated"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
