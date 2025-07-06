import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, User, TrendingUp, Calendar, MessageCircle, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function Demo() {
  const [demoData, setDemoData] = useState({
    profiles: [
      {
        id: 1,
        name: "Alex",
        status: "Dating",
        healthScore: 78,
        greenFlags: 8,
        redFlags: 2,
        checkIns: 5,
        averageSafety: 8.2,
        lastInteraction: "2 days ago",
        flags: [
          { type: "green", category: "Communication", name: "Active listener", present: true },
          { type: "green", category: "Respect", name: "Respects boundaries", present: true },
          { type: "green", category: "Consistency", name: "Follows through on commitments", present: true },
          { type: "red", category: "Communication", name: "Dismisses concerns", present: true },
        ],
        recentCheckIns: [
          { date: "Jan 5", safety: 9, supported: "yes", excited: "yes" },
          { date: "Jan 3", safety: 8, supported: "yes", excited: "unsure" },
          { date: "Dec 30", safety: 7, supported: "no", excited: "yes" },
        ]
      },
      {
        id: 2,
        name: "Jordan",
        status: "Friend",
        healthScore: 92,
        greenFlags: 12,
        redFlags: 1,
        checkIns: 8,
        averageSafety: 9.1,
        lastInteraction: "1 day ago",
        flags: [
          { type: "green", category: "Trust", name: "Keeps confidences", present: true },
          { type: "green", category: "Support", name: "Emotionally available", present: true },
          { type: "green", category: "Communication", name: "Checks in regularly", present: true },
          { type: "red", category: "Boundaries", name: "Sometimes overshares", present: true },
        ],
        recentCheckIns: [
          { date: "Jan 6", safety: 10, supported: "yes", excited: "yes" },
          { date: "Jan 4", safety: 9, supported: "yes", excited: "yes" },
          { date: "Jan 2", safety: 9, supported: "yes", excited: "yes" },
        ]
      }
    ]
  });

  const [selectedProfile, setSelectedProfile] = useState(demoData.profiles[0]);
  const [showNewCheckIn, setShowNewCheckIn] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState({
    feelSafe: "",
    feelSupported: "",
    emotionalTone: "",
    safetyRating: 5,
    notes: ""
  });

  const handleAddCheckIn = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const updatedProfile = {
      ...selectedProfile,
      recentCheckIns: [
        { 
          date: today, 
          safety: newCheckIn.safetyRating, 
          supported: newCheckIn.feelSupported, 
          excited: newCheckIn.feelSafe 
        },
        ...selectedProfile.recentCheckIns.slice(0, 2)
      ],
      checkIns: selectedProfile.checkIns + 1,
      averageSafety: parseFloat(((selectedProfile.averageSafety * selectedProfile.checkIns + newCheckIn.safetyRating) / (selectedProfile.checkIns + 1)).toFixed(1))
    };

    const updatedProfiles = demoData.profiles.map(p => 
      p.id === selectedProfile.id ? updatedProfile : p
    );

    setDemoData({ profiles: updatedProfiles });
    setSelectedProfile(updatedProfile);
    setNewCheckIn({ feelSafe: "", feelSupported: "", emotionalTone: "", safetyRating: 5, notes: "" });
    setShowNewCheckIn(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">BoundarySpace</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/demo" className="text-indigo-600 font-medium">Demo</a>
              <a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <div className="flex items-center space-x-4">
                <a href="/api/login" className="text-gray-600 hover:text-gray-900">Log In</a>
                <a href="/pricing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Subscribe
                </a>
              </div>
            </div>
            <div className="md:hidden">
              <a href="/pricing" className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Try BoundarySpace Demo
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Explore how relationship tracking works with pre-populated data. Add your own check-ins to see the system in action.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800 text-sm">
              🎯 This is a demo with sample data. Your real relationships and personal information will be private and secure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Relationship List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Relationships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoData.profiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProfile.id === profile.id
                        ? 'bg-indigo-100 border-2 border-indigo-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{profile.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {profile.status}
                      </Badge>
                    </div>
                    <div className={`text-sm font-medium ${getHealthColor(profile.healthScore)}`}>
                      {profile.healthScore}% Health
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {profile.greenFlags} green, {profile.redFlags} red flags
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProfile.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Status: {selectedProfile.status}</span>
                      <span>Last interaction: {selectedProfile.lastInteraction}</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${getHealthBg(selectedProfile.healthScore)} mt-4 sm:mt-0`}>
                    <div className={`text-2xl font-bold ${getHealthColor(selectedProfile.healthScore)}`}>
                      {selectedProfile.healthScore}%
                    </div>
                    <div className="text-sm text-gray-600">Health Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{selectedProfile.greenFlags}</div>
                    <div className="text-sm text-gray-600">Green Flags</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">{selectedProfile.redFlags}</div>
                    <div className="text-sm text-gray-600">Red Flags</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{selectedProfile.checkIns}</div>
                    <div className="text-sm text-gray-600">Check-ins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{selectedProfile.averageSafety}/10</div>
                    <div className="text-sm text-gray-600">Avg Safety</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Behavioral Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Behavioral Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProfile.flags.map((flag, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        flag.type === 'green'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {flag.type === 'green' ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {flag.category}
                        </Badge>
                      </div>
                      <div className={`font-medium ${
                        flag.type === 'green' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {flag.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Check-ins */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Recent Check-ins
                  </CardTitle>
                  <Button
                    onClick={() => setShowNewCheckIn(!showNewCheckIn)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add Check-in
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNewCheckIn && (
                  <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">New Emotional Check-in</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Do you feel safe and excited?
                          </label>
                          <Select value={newCheckIn.feelSafe} onValueChange={(value) => setNewCheckIn({...newCheckIn, feelSafe: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="unsure">Unsure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Do you feel supported?
                          </label>
                          <Select value={newCheckIn.feelSupported} onValueChange={(value) => setNewCheckIn({...newCheckIn, feelSupported: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="unsure">Unsure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Safety Rating (1-10)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={newCheckIn.safetyRating}
                          onChange={(e) => setNewCheckIn({...newCheckIn, safetyRating: parseInt(e.target.value) || 5})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes (optional)
                        </label>
                        <Textarea
                          value={newCheckIn.notes}
                          onChange={(e) => setNewCheckIn({...newCheckIn, notes: e.target.value})}
                          placeholder="Any additional thoughts or observations..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={handleAddCheckIn} className="bg-indigo-600 hover:bg-indigo-700">
                          Save Check-in
                        </Button>
                        <Button variant="outline" onClick={() => setShowNewCheckIn(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {selectedProfile.recentCheckIns.map((checkIn, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900">{checkIn.date}</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={checkIn.supported === 'yes' ? 'default' : 'secondary'}>
                            Supported: {checkIn.supported}
                          </Badge>
                          <Badge variant={checkIn.excited === 'yes' ? 'default' : 'secondary'}>
                            Safe: {checkIn.excited}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-indigo-600">
                        {checkIn.safety}/10
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to track your real relationships?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This demo shows just a fraction of BoundarySpace's capabilities. Get access to advanced analytics, 
            boundary management, timeline visualization, and much more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/pricing'}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-3 text-lg"
              onClick={() => window.location.href = '/faq'}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}