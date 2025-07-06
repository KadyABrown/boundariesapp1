import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Heart, TrendingDown, TrendingUp, Clock, Brain, User, AlertTriangle, CheckCircle, Menu } from "lucide-react";

const MarketingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-lg">BoundarySpace</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Home
            </a>
            <a href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pricing
            </a>
            <a href="/demo" className="transition-colors hover:text-foreground/80 text-foreground">
              Demo
            </a>
            <a href="/faq" className="transition-colors hover:text-foreground/80 text-foreground/60">
              FAQ
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:block">
            <Button
              onClick={() => window.location.href = "/api/login"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Try BoundarySpace
            </Button>
          </div>
          
          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-6">
                <a 
                  href="/" 
                  className="text-lg font-medium transition-colors hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/pricing" 
                  className="text-lg font-medium transition-colors hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="/demo" 
                  className="text-lg font-medium transition-colors hover:text-purple-600 text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Demo
                </a>
                <a 
                  href="/faq" 
                  className="text-lg font-medium transition-colors hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </a>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/api/login";
                  }}
                  className="bg-purple-600 hover:bg-purple-700 mt-4"
                >
                  Try BoundarySpace
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default function DemoPage() {
  // CIT Tracking Data - users can adjust these
  const [preEnergy, setPreEnergy] = useState([7]);
  const [preAnxiety, setPreAnxiety] = useState([3]);
  const [preMood, setPreMood] = useState([8]);
  const [postEnergy, setPostEnergy] = useState([4]);
  const [postAnxiety, setPostAnxiety] = useState([7]);
  const [postMood, setPostMood] = useState([5]);

  // Sample relationship profile data
  const relationshipProfile = {
    name: "Alex",
    relationshipType: "Romantic Partner",
    dateMet: "March 2024",
    interactions: 12,
    greenFlags: 8,
    redFlags: 3
  };

  // Sample baseline preferences for compatibility
  const userBaseline = {
    communicationStyle: "Direct and specific",
    emotionalSupport: "High validation needs",
    conflictResolution: "Collaborative problem-solving",
    personalSpace: "Moderate space requirements"
  };

  // Calculate changes and compatibility
  const energyChange = postEnergy[0] - preEnergy[0];
  const anxietyChange = postAnxiety[0] - preAnxiety[0];
  const moodChange = postMood[0] - preMood[0];

  // Calculate health score based on changes
  const calculateHealthScore = () => {
    let score = 75; // Base score
    score += energyChange * 3; // Energy impact
    score -= anxietyChange * 2; // Anxiety impact (negative)
    score += moodChange * 2; // Mood impact
    return Math.max(0, Math.min(100, score));
  };

  // Calculate compatibility based on interaction patterns
  const calculateCompatibility = () => {
    let compatibility = 80; // Base compatibility
    if (energyChange < -2) compatibility -= 15;
    if (anxietyChange > 3) compatibility -= 10;
    if (moodChange < -2) compatibility -= 10;
    return Math.max(0, Math.min(100, compatibility));
  };

  const healthScore = calculateHealthScore();
  const compatibilityScore = calculateCompatibility();

  const resetDemo = () => {
    setPreEnergy([7]);
    setPreAnxiety([3]);
    setPreMood([8]);
    setPostEnergy([4]);
    setPostAnxiety([7]);
    setPostMood([5]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <MarketingNavigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Interactive Relationship Analysis Demo
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Explore a sample relationship profile and adjust the interaction tracking sliders to see how BoundarySpace analyzes relationship health and compatibility in real-time.
            </p>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            
            {/* Sample Relationship Profile */}
            <div className="mb-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-purple-600" />
                    Sample Relationship Profile: {relationshipProfile.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{relationshipProfile.relationshipType}</div>
                      <div className="text-sm text-gray-600">Relationship Type</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{relationshipProfile.interactions}</div>
                      <div className="text-sm text-gray-600">Interactions Tracked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{relationshipProfile.greenFlags}</div>
                      <div className="text-sm text-gray-600">Green Flags</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{relationshipProfile.redFlags}</div>
                      <div className="text-sm text-gray-600">Red Flags</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* CIT Interaction Tracker */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Interaction Tracking - Try Adjusting the Sliders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Before Interaction</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Energy Level: {preEnergy[0]}/10</Label>
                        <Slider
                          value={preEnergy}
                          onValueChange={setPreEnergy}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Anxiety Level: {preAnxiety[0]}/10</Label>
                        <Slider
                          value={preAnxiety}
                          onValueChange={setPreAnxiety}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Mood: {preMood[0]}/10</Label>
                        <Slider
                          value={preMood}
                          onValueChange={setPreMood}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3">After Interaction</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Energy Level: {postEnergy[0]}/10</Label>
                        <Slider
                          value={postEnergy}
                          onValueChange={setPostEnergy}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Anxiety Level: {postAnxiety[0]}/10</Label>
                        <Slider
                          value={postAnxiety}
                          onValueChange={setPostAnxiety}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Mood: {postMood[0]}/10</Label>
                        <Slider
                          value={postMood}
                          onValueChange={setPostMood}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={resetDemo}
                    variant="outline"
                    className="w-full"
                  >
                    Reset to Default Values
                  </Button>
                </CardContent>
              </Card>

              {/* Real-time Analysis */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Live Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                      <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded">
                          <div className="text-3xl font-bold text-purple-600">{healthScore}%</div>
                          <div className="text-sm text-purple-700">Health Score</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded">
                          <div className="text-3xl font-bold text-blue-600">{compatibilityScore}%</div>
                          <div className="text-sm text-blue-700">Compatibility</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">Energy Change</span>
                          <div className="flex items-center gap-2">
                            {energyChange < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            )}
                            <span className={`font-bold ${energyChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {energyChange > 0 ? '+' : ''}{energyChange}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">Anxiety Change</span>
                          <div className="flex items-center gap-2">
                            {anxietyChange > 0 ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            )}
                            <span className={`font-bold ${anxietyChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {anxietyChange > 0 ? '+' : ''}{anxietyChange}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">Mood Change</span>
                          <div className="flex items-center gap-2">
                            {moodChange < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            )}
                            <span className={`font-bold ${moodChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {moodChange > 0 ? '+' : ''}{moodChange}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="compatibility" className="space-y-4">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Your Baseline Preferences</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Communication:</strong> {userBaseline.communicationStyle}</div>
                            <div><strong>Emotional Support:</strong> {userBaseline.emotionalSupport}</div>
                            <div><strong>Conflict Style:</strong> {userBaseline.conflictResolution}</div>
                            <div><strong>Personal Space:</strong> {userBaseline.personalSpace}</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Compatibility Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {energyChange >= -1 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              )}
                              <span className="text-sm">Energy Impact: {energyChange >= -1 ? 'Positive' : 'Concerning'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {anxietyChange <= 2 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              )}
                              <span className="text-sm">Anxiety Management: {anxietyChange <= 2 ? 'Good' : 'Needs Attention'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {moodChange >= -1 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              )}
                              <span className="text-sm">Mood Support: {moodChange >= -1 ? 'Positive' : 'Challenging'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="insights" className="space-y-4">
                      <div className="space-y-4">
                        {energyChange < -2 && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="font-semibold text-yellow-800">Energy Drain Alert</span>
                            </div>
                            <p className="text-sm text-yellow-700">
                              Significant energy drain detected. Consider setting boundaries around interaction timing or duration.
                            </p>
                          </div>
                        )}
                        
                        {anxietyChange > 3 && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="font-semibold text-red-800">Anxiety Pattern</span>
                            </div>
                            <p className="text-sm text-red-700">
                              High anxiety increase noted. This may indicate a need for clearer communication or emotional support strategies.
                            </p>
                          </div>
                        )}
                        
                        {energyChange >= 0 && moodChange >= 0 && anxietyChange <= 1 && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-800">Positive Interaction</span>
                            </div>
                            <p className="text-sm text-green-700">
                              This interaction shows positive patterns. Consider what made this interaction successful for future reference.
                            </p>
                          </div>
                        )}
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-semibold text-blue-800 mb-2">Pattern Insights</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Track multiple interactions to identify patterns</li>
                            <li>• Compare with your baseline preferences for deeper insights</li>
                            <li>• Use data to have informed conversations about relationship needs</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Relationships?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start tracking your relationship patterns and discover insights that lead to healthier, more fulfilling connections.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => window.location.href = "/api/login"}
            >
              Try BoundarySpace
            </Button>
            <p className="text-sm opacity-75 mt-4">
              $12.99/month subscription • Cancel anytime
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}