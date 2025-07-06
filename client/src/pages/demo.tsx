import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Brain, Calendar, TrendingUp, AlertTriangle, CheckCircle, Plus, User, Edit2, Flag, BarChart3, Clock, MapPin, Target, Trash2 } from "lucide-react";

export default function Demo() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');
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
                BoundarySpace
              </a>
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                Demo Mode
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo User</span>
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
                  {demoProfiles.filter(p => p.status !== 'Over').length}
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
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedProfile(profile);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Quick Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Track Your Own Relationships?
              </h3>
              <p className="text-gray-600 mb-6">
                This demo shows just a glimpse of BoundarySpace's powerful relationship tracking features. 
                Start your free trial today to begin understanding your relationship patterns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => window.location.href = '/pricing'}>
                  Start Free Trial
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