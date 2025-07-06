import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, Heart } from "lucide-react";

export default function Friends() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Under Development Message
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="mb-8">
            <Users className="w-24 h-24 mx-auto text-neutral-300 mb-4" />
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Friends & Sharing</h1>
            <p className="text-xl text-neutral-600">Under Development</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-dashed border-neutral-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <Settings className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                    Feature Coming Soon
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    We're working on building a comprehensive friend system that will allow you to:
                  </p>
                  <ul className="text-left text-sm text-neutral-600 mt-4 space-y-2">
                    <li>• Connect with friends and family</li>
                    <li>• Share relationship insights securely</li>
                    <li>• Get support from your trusted circle</li>
                    <li>• Create privacy-controlled sharing groups</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={() => window.location.href = '/relationships'}
              className="bg-primary hover:bg-primary/90"
            >
              <Heart className="w-4 h-4 mr-2" />
              Continue Tracking Relationships
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}