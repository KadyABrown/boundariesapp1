import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import RelationshipHealthTracker from "@/components/relationship-health-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { useParams, Link } from "wouter";

interface RelationshipProfile {
  id: number;
  name: string;
  nickname?: string;
  relationshipType: string;
  dateMet?: string;
  howMet?: string;
  currentStatus: string;
  isPrivate: boolean;
  createdAt: string;
}

export default function RelationshipDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Fetch relationship profile
  const { data: profile, isLoading: profileLoading, error } = useQuery<RelationshipProfile>({
    queryKey: ['/api/relationships', id],
    enabled: !!id && isAuthenticated,
  });

  // Handle authentication errors
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Handle API errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [error, toast]);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Relationship Not Found
            </h2>
            <p className="text-neutral-600 mb-6">
              The relationship profile you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link href="/relationships">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Relationships
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/relationships">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Relationships
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="w-6 h-6 text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile.nickname || profile.name}
                    {profile.nickname && (
                      <span className="text-lg font-normal text-neutral-500 ml-2">
                        ({profile.name})
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-neutral-500 capitalize font-normal">
                    {profile.relationshipType} • {profile.currentStatus}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {profile.dateMet && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>Met {new Date(profile.dateMet).toLocaleDateString()}</span>
                  </div>
                )}
                {profile.howMet && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span className="capitalize">{profile.howMet.replace('-', ' ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span>{profile.isPrivate ? "Private" : "Shared"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tracking System */}
        <RelationshipHealthTracker 
          profileId={profile.id} 
          profileName={profile.nickname || profile.name}
        />
      </div>
    </div>
  );
}