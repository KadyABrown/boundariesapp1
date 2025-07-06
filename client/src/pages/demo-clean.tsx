import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Calendar, BarChart3, User, Edit2, MapPin, Trash2, Plus, Cloud, Sun, CloudRain, Sparkles, Target, CheckCircle } from "lucide-react";

export default function Demo() {
  // Demo data - pre-populated relationship profiles
  const demoProfiles = [
    {
      id: 1,
      name: "Alex",
      relationshipType: "Dating",
      relationshipStatus: "Interested",
      flags: { green: 8, red: 3 },
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relationships</h1>
              <p className="text-gray-600">Track and understand your relationship patterns</p>
            </div>
            <Button onClick={() => alert('Demo mode - sign up to create real profiles!')}>
              <Plus className="w-4 h-4 mr-2" />
              New Relationship
            </Button>
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
                      onClick={() => alert('Demo mode - view detailed profile in full app')}
                      title="View Profile & Interactions"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert('Demo mode - edit profiles in full app')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert('Demo mode - manage profiles in full app')}
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

        {/* Analytics Preview */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Relationship Insights & Analytics</h2>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Relationship Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-gray-600">Average Health Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">23</div>
                  <div className="text-sm text-gray-600">Green Flags Logged</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">8</div>
                  <div className="text-sm text-gray-600">Red Flags Noted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Check-ins Completed</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">This Week's Insight</h4>
                <p className="text-blue-800 text-sm">
                  Your boundary respect rate improved 15% this week. Relationships with clear communication 
                  patterns show higher satisfaction scores. Consider discussing expectations with Alex.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotional Weather Report */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Today's Emotional Weather</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500 animate-pulse" />
                  Overall Mood: Partly Sunny
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Energy Level</span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                      </div>
                      <span className="text-sm font-medium">7/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Boundary Confidence</span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-medium">8.5/10</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white/50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      ☀️ Feeling confident after yesterday's successful boundary conversation with Alex
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-gray-500" />
                  Relationship Climate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Communication Flow</span>
                    <Badge className="bg-green-100 text-green-800">Clear Skies</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stress Levels</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Light Breeze</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Support System</span>
                    <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                  </div>
                  <div className="mt-3 p-3 bg-white/50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      🌤️ Forecast: Good conditions for difficult conversations this week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Boundary Buddy */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Boundary Buddy</h2>
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500 animate-bounce" />
                Daily Boundary Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/70 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-medium text-purple-900 mb-2">Today's Insight</h4>
                  <p className="text-purple-800 text-sm mb-3">
                    You've been doing great at setting boundaries this week! I noticed you successfully 
                    redirected the conversation when Jordan brought up work during your lunch date.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Boundary skill: Gentle redirection ✨</span>
                  </div>
                </div>
                
                <div className="p-4 bg-white/70 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-900 mb-2">Gentle Reminder</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Remember to check in with yourself before your coffee date with Alex tomorrow. 
                    You mentioned feeling a bit overwhelmed lately.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Target className="w-4 h-4" />
                    <span>Suggested: Take 5 deep breaths beforehand</span>
                  </div>
                </div>

                <div className="p-4 bg-white/70 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-medium text-green-900 mb-2">Progress Celebration</h4>
                  <p className="text-green-800 text-sm mb-3">
                    You're on a 3-day streak of checking in with your feelings! 
                    This self-awareness is helping you communicate more clearly.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Heart className="w-4 h-4 animate-pulse" />
                    <span>Keep up the amazing work! 💚</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}