import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertTriangle, Heart, Users } from "lucide-react";

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
    addressability: string;
  };
}

interface PairedFlagCardProps {
  data: PairedFlagData;
}

const getThemeIcon = (theme: string) => {
  switch (theme.toLowerCase()) {
    case 'communication':
      return <Users className="w-5 h-5" />;
    case 'trust':
      return <Heart className="w-5 h-5" />;
    default:
      return <Users className="w-5 h-5" />;
  }
};

const getThemeColor = (theme: string) => {
  switch (theme.toLowerCase()) {
    case 'communication':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'trust':
      return 'bg-purple-50 border-purple-200 text-purple-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export default function PairedFlagCard({ data }: PairedFlagCardProps) {
  return (
    <Card className="w-full mb-6 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getThemeColor(data.theme)}`}>
            {getThemeIcon(data.theme)}
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-neutral-800">
              {data.theme}
            </CardTitle>
            <p className="text-sm text-neutral-500 mt-1">
              Healthy vs. Unhealthy Patterns
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Green Flag Section */}
        {data.greenFlag && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Healthy Pattern</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Green Flag
              </Badge>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium text-green-900 mb-1">Behavior</h4>
                <p className="text-green-800 text-sm">{data.greenFlag.title}</p>
              </div>
              
              {data.greenFlag.exampleScenario && (
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Example</h4>
                  <p className="text-green-700 text-sm">{data.greenFlag.exampleScenario}</p>
                </div>
              )}
              
              {data.greenFlag.emotionalImpact && (
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Why It Matters</h4>
                  <p className="text-green-700 text-sm">{data.greenFlag.emotionalImpact}</p>
                </div>
              )}
              
              {data.greenFlag.actionSteps && (
                <div>
                  <h4 className="font-medium text-green-900 mb-1">How to Encourage</h4>
                  <p className="text-green-700 text-sm">{data.greenFlag.actionSteps}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Red Flag Section */}
        {data.redFlag && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Unhealthy Pattern</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Red Flag
              </Badge>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium text-red-900 mb-1">Behavior</h4>
                <p className="text-red-800 text-sm">{data.redFlag.title}</p>
              </div>
              
              {data.redFlag.exampleScenario && (
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Example</h4>
                  <p className="text-red-700 text-sm">{data.redFlag.exampleScenario}</p>
                </div>
              )}
              
              {data.redFlag.emotionalImpact && (
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Why It Matters</h4>
                  <p className="text-red-700 text-sm">{data.redFlag.emotionalImpact}</p>
                </div>
              )}
              
              {data.redFlag.actionSteps && (
                <div>
                  <h4 className="font-medium text-red-900 mb-1">How to Address</h4>
                  <p className="text-red-700 text-sm">{data.redFlag.actionSteps}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}