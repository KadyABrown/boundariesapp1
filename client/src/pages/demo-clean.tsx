import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Calendar, BarChart3, User, Edit2, MapPin, Trash2, Plus, X, Activity, TrendingUp } from "lucide-react";
import EmotionalWeather from "@/components/emotional-weather";
import BoundaryBuddy from "@/components/boundary-buddy";
import { useState } from "react";

export default function Demo() {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  // Demo data - pre-populated relationship profiles
  const demoProfiles = [
    {
      id: 1,
      name: "Alex",
      relationshipType: "Dating",
      relationshipStatus: "Interested",
      flags: { green: 8, red: 3 },
      greenFlags: 8,
      redFlags: 3,
      customTags: ["Communicative", "Ambitious"],
      howMet: "Dating app",
      healthScore: 73
    },
    {
      id: 2,
      name: "Jordan",
      relationshipType: "Friend",
      relationshipStatus: "Close Friend",
      flags: { green: 12, red: 1 },
      greenFlags: 12,
      redFlags: 1,
      customTags: ["Supportive", "Reliable"],
      howMet: "Work",
      healthScore: 92
    },
    {
      id: 3,
      name: "Casey",
      relationshipType: "Dating",
      relationshipStatus: "Over",
      flags: { green: 4, red: 9 },
      greenFlags: 4,
      redFlags: 9,
      customTags: ["Inconsistent", "Charming"],
      howMet: "Through friends",
      healthScore: 31
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interested': return "bg-green-100 text-green-800";
      case 'Close Friend': return "bg-blue-100 text-blue-800";
      case 'Over': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const relationshipTypeColors: { [key: string]: string } = {
    'dating': 'bg-red-500',
    'friend': 'bg-blue-500',
    'family': 'bg-green-500',
    'professional': 'bg-purple-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-xl font-bold text-indigo-600">
                BoundarySpace
              </a>
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                Demo Mode
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo User</span>
              <Button variant="outline" onClick={() => window.location.href = '/'} size="sm">
                Home
              </Button>
              <Button onClick={() => window.location.href = '/pricing'} size="sm">
                Upgrade to Full Access
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Header with App-like Navigation */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Relationships</h1>
            <p className="text-gray-600">Track and understand your relationship patterns</p>
          </div>
          
          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Brain className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Demo Preview</h3>
                <p className="text-sm text-blue-700">This shows exactly what you'll see after logging in. Sample data demonstrates real tracking features.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Relationships Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Relationships Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-800">{demoProfiles.length}</div>
                <div className="text-sm text-neutral-600">Total Relationships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {demoProfiles.filter(p => p.relationshipType === 'Dating').length}
                </div>
                <div className="text-sm text-neutral-600">Dating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {demoProfiles.filter(p => p.relationshipType === 'Friend').length}
                </div>
                <div className="text-sm text-neutral-600">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {demoProfiles.filter(p => p.relationshipStatus !== 'Over').length}
                </div>
                <div className="text-sm text-neutral-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relationship Insights & Analytics - Moved Above Relationships */}
        <div className="mt-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Relationship Insights & Analytics</h2>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Relationship Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(demoProfiles.reduce((sum, p) => sum + p.healthScore, 0) / demoProfiles.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Average Health Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {demoProfiles.reduce((sum, p) => sum + p.flags.green, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Green Flags Logged</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {demoProfiles.reduce((sum, p) => sum + p.flags.red, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Red Flags Noted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {demoProfiles.filter(p => p.relationshipStatus !== 'Over').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Relationships</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">This Week's Insight</h4>
                <p className="text-blue-800 text-sm">
                  Your relationships show strong boundary respect overall. Jordan ({demoProfiles.find(p => p.name === 'Jordan')?.healthScore}% health) 
                  demonstrates excellent communication patterns, while Sam could benefit from clearer expectations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Relationships Summary</h2>

        {/* Relationship Cards Grid - Exact App Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProfiles.map((profile) => (
            <Card key={profile.id} className="relative cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${relationshipTypeColors[profile.relationshipType.toLowerCase()] || 'bg-neutral-500'} rounded-full`}></div>
                    <div>
                      <CardTitle className="text-lg">
                        {profile.name}
                      </CardTitle>
                      <p className="text-sm text-neutral-500 capitalize">
                        {profile.relationshipType}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProfile(profile.id)}
                      title="View Profile & Interactions"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    <span>{profile.howMet}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <Brain className="w-4 h-4" />
                    <span>Health: {profile.healthScore}%</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {profile.customTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Status:</span>
                      <Badge className={getStatusColor(profile.relationshipStatus)}>
                        {profile.relationshipStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{profile.flags.green}</div>
                      <div className="text-green-600">Green Flags</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-600">{profile.flags.red}</div>
                      <div className="text-red-600">Red Flags</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Boundary Tracking Preview */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Personal Boundary Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Work-Life Balance</CardTitle>
                <div className="text-2xl font-bold text-green-600">85%</div>
                <p className="text-sm text-gray-500">Respect Rate This Week</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Boundaries Set: 12</span>
                    <span>Respected: 10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media</CardTitle>
                <div className="text-2xl font-bold text-yellow-600">60%</div>
                <p className="text-sm text-gray-500">Respect Rate This Week</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Boundaries Set: 8</span>
                    <span>Respected: 5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Space</CardTitle>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <p className="text-sm text-gray-500">Respect Rate This Week</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Boundaries Set: 6</span>
                    <span>Respected: 6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* Emotional Weather Report */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Emotional Weather Report</h2>
          <EmotionalWeather relationships={demoProfiles} />
        </div>

        {/* Boundary Buddy */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Boundary Buddy</h2>
          <div className="flex justify-center">
            <BoundaryBuddy context="general" position="inline" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <Heart className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Track Your Real Relationships?
              </h3>
              <p className="text-gray-600 mb-6">
                This demo shows how BoundarySpace helps you understand relationship patterns.
                Sign up to start tracking your own relationships with privacy controls and detailed analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.location.href = '/pricing'}>
                  Start Your Journey - $12.99/month
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/faq'}>
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {demoProfiles.find(p => p.id === selectedProfile)?.name} - Detailed Profile
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Comprehensive relationship analysis and tracking
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProfile(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const profile = demoProfiles.find(p => p.id === selectedProfile);
                  if (!profile) return null;
                  
                  return (
                    <div className="space-y-6">
                      {/* Profile Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{profile.flags.green}</div>
                              <div className="text-sm text-gray-600">Green Flags</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{profile.flags.red}</div>
                              <div className="text-sm text-gray-600">Red Flags</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{profile.healthScore}%</div>
                              <div className="text-sm text-gray-600">Health Score</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Profile Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Relationship Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Relationship Type</label>
                              <p className="capitalize">{profile.relationshipType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Status</label>
                              <Badge className={getStatusColor(profile.relationshipStatus)}>
                                {profile.relationshipStatus}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">How You Met</label>
                              <p>{profile.howMet}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Tags</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.customTags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Recent Activity Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Check-ins</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                              <span className="text-sm">Emotional check-in completed</span>
                              <span className="text-xs text-gray-500">2 days ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                              <span className="text-sm">Boundary respected</span>
                              <span className="text-xs text-gray-500">4 days ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                              <span className="text-sm">Communication pattern noted</span>
                              <span className="text-xs text-gray-500">1 week ago</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* CTA for Full Features */}
                      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Brain className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Get Advanced Analytics & Tracking
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Full interaction logging, pattern analysis, triggers tracking, and personalized insights
                            </p>
                            <Button onClick={() => window.location.href = '/pricing'} size="sm">
                              Upgrade to Full Access
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}