import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain, Calendar, TrendingUp, AlertTriangle, CheckCircle, Plus, Eye, Edit2, Flag, BarChart3, Clock, MapPin, Target, Trash2, Activity, Users, MessageSquare, Shield } from "lucide-react";

export default function Demo() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState({
    safetyRating: 5,
    emotionalTone: "neutral",
    notes: ""
  });

  // Demo data - pre-populated relationship profiles
  const demoProfiles = [
    {
      id: 1,
      name: "Alex",
      relationshipType: "Dating",
      status: "Interested",
      healthScore: 85,
      flags: { green: 12, red: 2 },
      checkIns: 8,
      lastCheckIn: "2 days ago",
      averageSafety: 8.5,
      tags: ["Respectful", "Good Listener"],
      location: "Met through friends",
      age: 28,
      description: "Someone I'm getting to know through mutual friends. Very respectful and seems genuine."
    },
    {
      id: 2,
      name: "Sam",
      relationshipType: "Dating",
      status: "Casual",
      healthScore: 65,
      flags: { green: 6, red: 5 },
      checkIns: 12,
      lastCheckIn: "1 day ago",
      averageSafety: 6.8,
      tags: ["Inconsistent", "Fun"],
      location: "Dating app",
      age: 25,
      description: "Fun to be around but can be inconsistent with communication. Mixed signals sometimes."
    },
    {
      id: 3,
      name: "Jordan",
      relationshipType: "Friend",
      status: "Close Friend",
      healthScore: 92,
      flags: { green: 18, red: 1 },
      checkIns: 15,
      lastCheckIn: "Today",
      averageSafety: 9.2,
      tags: ["Supportive", "Trustworthy"],
      location: "Work colleague",
      age: 30,
      description: "A really solid friend who I can always count on. Very supportive and trustworthy."
    }
  ];

  const handleCheckIn = () => {
    alert(`Check-in recorded for ${selectedProfile.name}!`);
    setSelectedProfile(null);
    setIsDialogOpen(false);
    setNewCheckIn({
      safetyRating: 5,
      emotionalTone: "neutral",
      notes: ""
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interested": return "bg-green-100 text-green-800";
      case "Close Friend": return "bg-blue-100 text-blue-800";
      case "Casual": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const relationshipTypeColors: { [key: string]: string } = {
    'romantic': 'bg-red-500',
    'platonic': 'bg-blue-500',
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
                BoundaryCore
              </a>
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                Demo Mode
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo User</span>
              <Button onClick={() => window.location.href = '/subscribe'} size="sm">
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
                  {demoProfiles.filter(p => p.status !== 'Over').length}
                </div>
                <div className="text-sm text-neutral-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Demo Tabs */}
        <Tabs defaultValue="relationships" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="relationships">Relationship Tracking</TabsTrigger>
            <TabsTrigger value="interaction-tracker">Interaction Tracker Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="relationships" className="space-y-6">
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
                      <Eye className="w-4 h-4" />
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
                    <span>{profile.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span>Age {profile.age}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {profile.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Status:</span>
                      <Badge className={getStatusColor(profile.status)}>
                        {profile.status}
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
          </TabsContent>

          <TabsContent value="interaction-tracker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-6 h-6 mr-3 text-indigo-600" />
                  Comprehensive Interaction Tracker (CIT) Demo
                </CardTitle>
                <p className="text-gray-600">See how BoundaryCore captures detailed before/after data to help you understand relationship patterns</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Before Interaction */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Before Interaction</h3>
                      <p className="text-sm text-gray-600">Your baseline state</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Energy Level</span>
                          <span className="text-lg font-bold text-blue-600">7/10</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Anxiety Level</span>
                          <span className="text-lg font-bold text-yellow-600">3/10</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Self-Worth</span>
                          <span className="text-lg font-bold text-green-600">8/10</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Mood & Warnings</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">😊</span>
                          <span className="text-sm text-gray-600">Optimistic</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ⚠️ Feeling a bit tired today
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* After Interaction */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">After Interaction</h3>
                      <p className="text-sm text-gray-600">Impact & changes</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Energy Level</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-red-600">4/10</span>
                            <span className="text-sm text-red-600">(-3)</span>
                          </div>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Anxiety Level</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-red-600">7/10</span>
                            <span className="text-sm text-red-600">(+4)</span>
                          </div>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Self-Worth</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-yellow-600">6/10</span>
                            <span className="text-sm text-yellow-600">(-2)</span>
                          </div>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-medium text-gray-700 mb-2">Physical Symptoms</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Headache (mild)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Muscle tension</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Fatigue</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recovery & Learning Insights */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-900 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Recovery Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="space-y-2">
                        <div><strong>Recovery Time:</strong> 45 minutes to feel normal</div>
                        <div><strong>What Helped:</strong> Deep breathing, walk outside</div>
                        <div><strong>Made it Worse:</strong> Overthinking the conversation</div>
                        <div><strong>Support Used:</strong> Called a trusted friend</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-900 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="space-y-2">
                        <div><strong>Warning Signs:</strong> They seemed distracted, rushing</div>
                        <div><strong>Boundary Maintained:</strong> Said no to last-minute plan change</div>
                        <div><strong>Self-Advocacy:</strong> Asked for clarification when confused</div>
                        <div><strong>Lesson Learned:</strong> Trust my gut about their mood</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Call to Action */}
                <div className="mt-8 text-center bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Powerful Pattern Recognition</h3>
                  <p className="text-indigo-700 mb-4">
                    This detailed tracking helps you recognize patterns, triggers, and recovery strategies. 
                    Over time, you'll see which relationships energize you and which ones drain you.
                  </p>
                  <Button onClick={() => window.location.href = '/subscribe'} className="bg-indigo-600 hover:bg-indigo-700">
                    Start Tracking Your Patterns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>



        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Track Your Own Relationships?
              </h3>
              <p className="text-gray-600 mb-6">
                This demo shows just a glimpse of BoundaryCore's powerful relationship tracking features. 
                Start your free trial today to begin understanding your relationship patterns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => window.location.href = '/subscribe'}>
                  Start Your Journey - $12.99/month
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check-in Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Quick Check-in: {selectedProfile?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="safety-rating">How safe do you feel? (1-10)</Label>
                <Select 
                  value={newCheckIn.safetyRating.toString()} 
                  onValueChange={(value) => setNewCheckIn(prev => ({ ...prev, safetyRating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="emotional-tone">Emotional tone after interaction</Label>
                <Select 
                  value={newCheckIn.emotionalTone} 
                  onValueChange={(value) => setNewCheckIn(prev => ({ ...prev, emotionalTone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-positive">Very Positive</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="very-negative">Very Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did this interaction go? Any thoughts to capture?"
                  value={newCheckIn.notes}
                  onChange={(e) => setNewCheckIn(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleCheckIn} className="flex-1">
                  Save Check-in
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}