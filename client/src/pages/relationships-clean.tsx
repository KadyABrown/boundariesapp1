import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function RelationshipsPageClean() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Relationships</h1>
        <p className="text-gray-600">
          Track your relationships through comprehensive interaction logging (CIT).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No relationships tracked yet</h3>
            <p className="text-gray-600 mb-4">
              Start tracking a relationship to begin comprehensive interaction tracking.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Relationship
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}