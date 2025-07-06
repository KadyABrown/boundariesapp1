import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

export default function WeeklyProgress() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-2 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const respectedPercentage = stats?.weeklyTotal > 0 
    ? Math.round((stats.weeklyRespected / stats.weeklyTotal) * 100) 
    : 0;

  const checkinTarget = 7; // Daily check-ins target
  const checkinCount = Math.min(stats?.weeklyTotal || 0, checkinTarget);
  const checkinPercentage = Math.round((checkinCount / checkinTarget) * 100);

  const reflectionTarget = 3; // Weekly reflection target
  const reflectionCount = 2; // This would come from reflection entries
  const reflectionPercentage = Math.round((reflectionCount / reflectionTarget) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Boundaries Respected</span>
              <span className="font-medium text-neutral-800">
                {stats?.weeklyRespected || 0}/{stats?.weeklyTotal || 0}
              </span>
            </div>
            <Progress value={respectedPercentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Daily Check-ins</span>
              <span className="font-medium text-neutral-800">
                {checkinCount}/{checkinTarget}
              </span>
            </div>
            <Progress value={checkinPercentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Reflection Goals</span>
              <span className="font-medium text-neutral-800">
                {reflectionCount}/{reflectionTarget}
              </span>
            </div>
            <Progress value={reflectionPercentage} className="h-2" />
          </div>
        </div>
        
        {respectedPercentage >= 80 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Great progress this week!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
