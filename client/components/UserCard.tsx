import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/user";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const topHobbies = user.hobbies.slice(0, 2);
  const remainingHobbies = user.hobbies.length - 2;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {user.first_name} {user.last_name}
              </h3>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground italic">
              <span>{user.nationality}</span>
              <span>{user.age} yrs</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {topHobbies.map((hobby, index) => (
                <Badge key={index} variant="secondary">
                  {hobby}
                </Badge>
              ))}
              {remainingHobbies > 0 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{remainingHobbies}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
