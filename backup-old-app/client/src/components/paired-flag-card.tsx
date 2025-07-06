import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Heart, Users, MessageSquare } from "lucide-react";

interface PairedFlagData {
  theme: string;
  greenFlag?: {
    title: string;
    description: string;
    exampleScenario: string;
    emotionalImpact: string;
    actionSteps: string;
  };
  redFlag?: {
    title: string;
    description: string;
    exampleScenario: string;
    emotionalImpact: string;
    actionSteps: string;
  };
}

interface PairedFlagCardProps {
  data: PairedFlagData;
}

const getThemeIcon = (theme: string) => {
  switch (theme.toLowerCase()) {
    case 'communication':
      return <MessageSquare className="w-5 h-5" />;
    case 'trust':
      return <Heart className="w-5 h-5" />;
    case 'emotional_safety':
      return <Heart className="w-5 h-5" />;
    default:
      return <Users className="w-5 h-5" />;
  }
};

const getThemeColor = (theme: string) => {
  switch (theme.toLowerCase()) {
    case 'communication':
      return 'bg-blue-100 border-blue-200 text-blue-800';
    case 'trust':
      return 'bg-purple-100 border-purple-200 text-purple-800';
    case 'emotional_safety':
      return 'bg-pink-100 border-pink-200 text-pink-800';
    default:
      return 'bg-gray-100 border-gray-200 text-gray-800';
  }
};

const formatTheme = (theme: string) => {
  return theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function PairedFlagCard({ data }: PairedFlagCardProps) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${getThemeColor(data.theme)}`}>
            {getThemeIcon(data.theme)}
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-neutral-800">
              {formatTheme(data.theme)}
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">
              Compare healthy and unhealthy patterns
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Green Flag Section */}
          {data.greenFlag && (
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <h3 className="font-semibold text-green-800 text-lg">Healthy Pattern</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Behavior</h4>
                  <p className="text-green-800 text-sm leading-relaxed">{data.greenFlag.title}</p>
                </div>
                
                {data.greenFlag.exampleScenario && (
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Example</h4>
                    <p className="text-green-700 text-sm leading-relaxed italic">"{data.greenFlag.exampleScenario}"</p>
                  </div>
                )}
                
                {data.greenFlag.emotionalImpact && (
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Why It Matters</h4>
                    <p className="text-green-700 text-sm leading-relaxed">{data.greenFlag.emotionalImpact}</p>
                  </div>
                )}
                
                {data.greenFlag.actionSteps && (
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">How to Encourage</h4>
                    <p className="text-green-700 text-sm leading-relaxed">{data.greenFlag.actionSteps}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Red Flag Section */}
          {data.redFlag && (
            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <h3 className="font-semibold text-red-800 text-lg">Unhealthy Pattern</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Behavior</h4>
                  <p className="text-red-800 text-sm leading-relaxed">{data.redFlag.title}</p>
                </div>
                
                {data.redFlag.exampleScenario && (
                  <div>
                    <h4 className="font-medium text-red-900 mb-2">Example</h4>
                    <p className="text-red-700 text-sm leading-relaxed italic">"{data.redFlag.exampleScenario}"</p>
                  </div>
                )}
                
                {data.redFlag.emotionalImpact && (
                  <div>
                    <h4 className="font-medium text-red-900 mb-2">Why It Matters</h4>
                    <p className="text-red-700 text-sm leading-relaxed">{data.redFlag.emotionalImpact}</p>
                  </div>
                )}
                
                {data.redFlag.actionSteps && (
                  <div>
                    <h4 className="font-medium text-red-900 mb-2">How to Address</h4>
                    <p className="text-red-700 text-sm leading-relaxed">{data.redFlag.actionSteps}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Connection indicator for mobile */}
        <div className="lg:hidden text-center my-4">
          <div className="inline-flex items-center text-neutral-400">
            <div className="h-px bg-neutral-200 w-8"></div>
            <span className="px-3 text-sm">vs</span>
            <div className="h-px bg-neutral-200 w-8"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}