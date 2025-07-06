import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Heart, BarChart3, Users, Target, CheckCircle, TrendingUp, Calendar, BookOpen } from 'lucide-react';

export default function DashboardPageClean() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Welcome Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 mb-8 border-0 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                Welcome to <span className="text-primary">BoundarySpace</span>
              </h1>
              <p className="text-lg text-neutral-600">
                Start your journey to healthier relationships by completing your personal baseline assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Baseline</p>
                  <p className="text-xl font-bold text-neutral-800">Not Started</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Relationships</p>
                  <p className="text-xl font-bold text-neutral-800">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Boundary Goals</p>
                  <p className="text-xl font-bold text-neutral-800">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Health Score</p>
                  <p className="text-xl font-bold text-neutral-800">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div>
                    <h4 className="font-semibold text-neutral-800">Complete Baseline Assessment</h4>
                    <p className="text-sm text-neutral-600">Define your communication style and emotional needs</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Start</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg opacity-60">
                  <div>
                    <h4 className="font-semibold text-neutral-600">Add Your First Relationship</h4>
                    <p className="text-sm text-neutral-500">Start tracking relationship interactions</p>
                  </div>
                  <Button disabled variant="outline">Locked</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg opacity-60">
                  <div>
                    <h4 className="font-semibold text-neutral-600">Set Boundary Goals</h4>
                    <p className="text-sm text-neutral-500">Create trackable boundary objectives</p>
                  </div>
                  <Button disabled variant="outline">Locked</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600 font-medium">No activity yet</p>
                <p className="text-sm text-neutral-500">Complete your baseline to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2 text-neutral-800">Be Honest</h4>
                <p className="text-sm text-neutral-600">
                  The more accurate your baseline, the better insights you'll receive.
                </p>
              </div>
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2 text-neutral-800">Track Consistently</h4>
                <p className="text-sm text-neutral-600">
                  Regular interaction logging reveals meaningful patterns.
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2 text-neutral-800">Review Insights</h4>
                <p className="text-sm text-neutral-600">
                  Check your relationship health scores weekly for best results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}