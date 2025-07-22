import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, X, MessageSquare, Heart, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface DealBreakerAlertProps {
  relationshipId: number;
  relationshipName: string;
  onDismiss?: (alertId: string) => void;
  showActions?: boolean;
  className?: string;
}

export default function DealBreakerAlert({ 
  relationshipId, 
  relationshipName,
  onDismiss,
  showActions = true,
  className = ""
}: DealBreakerAlertProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Fetch recent interactions with deal breakers
  const { data: recentInteractions } = useQuery({
    queryKey: [`/api/interaction-tracker/${relationshipId}`],
    refetchOnWindowFocus: false,
  });
  
  console.log("DealBreakerAlert - recentInteractions data:", recentInteractions);

  // Get user's baseline to understand what their deal breakers are
  const { data: baseline } = useQuery({
    queryKey: ['/api/baseline'],
    refetchOnWindowFocus: false,
  });

  const getRecentDealBreakers = () => {
    if (!recentInteractions || !Array.isArray(recentInteractions)) return [];
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return recentInteractions
      .filter((interaction: any) => {
        const interactionDate = new Date(interaction.timestamp);
        return interactionDate > thirtyDaysAgo && 
               interaction.dealBreakersCrossed && 
               interaction.dealBreakersCrossed.length > 0;
      })
      .flatMap((interaction: any) => 
        interaction.dealBreakersCrossed.map((dealBreaker: string) => ({
          ...interaction,
          dealBreaker,
          alertId: `${interaction.id}-${dealBreaker}`
        }))
      );
  };

  const getDealBreakerSeverity = (dealBreaker: string) => {
    if (!baseline?.nonNegotiableBoundaries) return 'medium';
    
    // Check if this deal breaker is in their baseline assessment
    const isBaseline = baseline.nonNegotiableBoundaries.includes(dealBreaker);
    return isBaseline ? 'high' : 'medium';
  };

  const getSuggestedActions = (dealBreaker: string) => {
    const actions = [];
    
    // Communication suggestions
    if (dealBreaker.includes('communication') || dealBreaker.includes('dismissive')) {
      actions.push({
        icon: MessageSquare,
        text: 'Have a direct conversation about communication needs',
        type: 'communication'
      });
    }
    
    // Boundary suggestions
    if (dealBreaker.includes('boundary') || dealBreaker.includes('respect')) {
      actions.push({
        icon: Shield,
        text: 'Clearly restate your boundaries',
        type: 'boundary'
      });
    }
    
    // Relationship evaluation
    actions.push({
      icon: Heart,
      text: 'Evaluate if this relationship aligns with your values',
      type: 'evaluation'
    });
    
    return actions;
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...Array.from(prev), alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const recentDealBreakers = getRecentDealBreakers();
  const activeDealBreakers = recentDealBreakers.filter(
    item => !Array.from(dismissedAlerts).includes(item.alertId)
  );

  if (activeDealBreakers.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {activeDealBreakers.map((item) => {
        const severity = getDealBreakerSeverity(item.dealBreaker);
        const suggestedActions = getSuggestedActions(item.dealBreaker);
        
        return (
          <Card key={item.alertId} className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    severity === 'high' ? 'text-red-600' : 'text-orange-500'
                  }`} />
                  <CardTitle className="text-base">
                    Deal Breaker Alert - {relationshipName}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(item.alertId)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert className="border-red-200">
                <AlertDescription className="text-sm">
                  <strong>Deal breaker identified:</strong> {item.dealBreaker.replace('-', ' ')}
                  <br />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Occurred on {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </AlertDescription>
              </Alert>
              
              {showActions && suggestedActions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Suggested actions:</h4>
                  <div className="space-y-2">
                    {suggestedActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-blue-600" />
                          <span>{action.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                💡 Consider if this relationship aligns with your core values and boundaries
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}