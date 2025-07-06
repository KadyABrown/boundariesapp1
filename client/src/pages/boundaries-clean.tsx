import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Target, TrendingUp } from 'lucide-react';

export default function BoundariesPageClean() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Boundary Goals</h1>
        <p className="text-gray-600">
          Track your boundary respect rates and violation patterns.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Boundary Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No boundary goals yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your baseline assessment to automatically generate boundary goals, or start tracking relationships to see violation rates.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              <TrendingUp className="h-4 w-4" />
              Goals will appear automatically after baseline completion
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}