import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const emotionEmojis: Record<string, string> = {
  "very-negative": "😢",
  "negative": "😔",
  "neutral": "😐",
  "positive": "😊",
  "very-positive": "🤗",
};

const statusColors: Record<string, string> = {
  "respected": "bg-green-100 text-green-700 border-green-200",
  "challenged": "bg-amber-100 text-amber-700 border-amber-200",
  "communicated": "bg-blue-100 text-blue-700 border-blue-200",
  "violated": "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  "respected": "Respected",
  "challenged": "Challenged",
  "communicated": "Communicated",
  "violated": "Violated",
};

export default function ActivityTimeline() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/boundary-entries", { limit: 10 }],
    retry: false,
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return entryDate.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="link" className="text-primary text-sm p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry: any) => (
              <div key={entry.id} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">
                      {emotionEmojis[entry.emotionalImpact] || "😐"}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-neutral-800 capitalize">
                      {entry.category.replace('-', ' ')}
                    </h4>
                    <span className="text-xs text-neutral-500">
                      {formatTimeAgo(entry.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                    {entry.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`text-xs font-medium border ${statusColors[entry.status] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}
                    >
                      {statusLabels[entry.status] || entry.status}
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      Emotional impact: {entry.emotionalImpact.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm mb-2">No boundary experiences yet</p>
            <p className="text-xs">Start tracking to see your activity here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
