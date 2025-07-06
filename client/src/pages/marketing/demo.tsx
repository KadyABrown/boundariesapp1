import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shield, Plus, CheckCircle, User, Heart, TrendingDown, TrendingUp, Clock } from "lucide-react";

const MarketingNavigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-lg">BoundarySpace</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Try BoundarySpace
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default function DemoPage() {
  const [step, setStep] = useState(1);
  
  // Relationship Profile Data
  const [name, setName] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [profileCreated, setProfileCreated] = useState(false);

  // CIT Tracking Data
  const [preEnergy, setPreEnergy] = useState([7]);
  const [preAnxiety, setPreAnxiety] = useState([3]);
  const [preMood, setPreMood] = useState([8]);
  const [postEnergy, setPostEnergy] = useState([4]);
  const [postAnxiety, setPostAnxiety] = useState([7]);
  const [postMood, setPostMood] = useState([5]);
  const [interactionLogged, setInteractionLogged] = useState(false);

  const handleCreateProfile = () => {
    if (name && relationshipType) {
      setProfileCreated(true);
      setTimeout(() => setStep(2), 1000);
    }
  };

  const handleLogInteraction = () => {
    setInteractionLogged(true);
    setTimeout(() => setStep(3), 1500);
  };

  const resetDemo = () => {
    setStep(1);
    setName("");
    setRelationshipType("");
    setProfileCreated(false);
    setInteractionLogged(false);
    setPreEnergy([7]);
    setPreAnxiety([3]);
    setPreMood([8]);
    setPostEnergy([4]);
    setPostAnxiety([7]);
    setPostMood([5]);
  };

  const energyChange = postEnergy[0] - preEnergy[0];
  const anxietyChange = postAnxiety[0] - preAnxiety[0];
  const moodChange = postMood[0] - preMood[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <MarketingNavigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Experience Relationship Health Tracking
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              See how BoundarySpace helps you understand the real impact of your relationships through profile creation and interaction tracking with before/after measurements.
            </p>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center gap-4 mb-12">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                Create Profile
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                Track Interaction
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
                See Insights
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            
            {/* Step 1: Create Relationship Profile */}
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create Relationship Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Person's Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Alex"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={profileCreated}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Relationship Type</Label>
                      <Select value={relationshipType} onValueChange={setRelationshipType} disabled={profileCreated}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose relationship type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="romantic">Romantic Partner</SelectItem>
                          <SelectItem value="family">Family Member</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="colleague">Colleague</SelectItem>
                          <SelectItem value="acquaintance">Acquaintance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!profileCreated ? (
                      <Button 
                        onClick={handleCreateProfile}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={!name || !relationshipType}
                      >
                        Create Profile
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Profile Created Successfully!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Your Relationships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profileCreated ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                          <div className="flex items-center gap-3 mb-2">
                            <Heart className="h-5 w-5 text-purple-600" />
                            <h4 className="font-semibold text-purple-800">{name}</h4>
                          </div>
                          <p className="text-sm text-purple-600 mb-2 capitalize">
                            {relationshipType.replace('-', ' ')}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Ready for tracking
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg opacity-60">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <h4 className="font-semibold">Jordan</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Friend</p>
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Health Score: 85%
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Create your first relationship profile to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Comprehensive Interaction Tracking */}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Track Interaction with {name}
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
                            disabled={interactionLogged}
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
                            disabled={interactionLogged}
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
                            disabled={interactionLogged}
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
                            disabled={interactionLogged}
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
                            disabled={interactionLogged}
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
                            disabled={interactionLogged}
                          />
                        </div>
                      </div>
                    </div>

                    {!interactionLogged ? (
                      <Button 
                        onClick={handleLogInteraction}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Log Interaction
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Interaction Logged Successfully!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Live Impact Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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

                      {interactionLogged && (
                        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Interaction Impact</h4>
                          <p className="text-sm text-blue-700">
                            {energyChange < -2 ? "Significant energy drain detected. " : ""}
                            {anxietyChange > 2 ? "Notable anxiety increase. " : ""}
                            {moodChange < -2 ? "Mood impact identified. " : ""}
                            Data saved for pattern analysis.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Insights & Analytics */}
            {step === 3 && (
              <div className="text-center space-y-8">
                <Card className="shadow-lg max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      Relationship Health Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">72%</div>
                          <div className="text-sm text-gray-600">Health Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">-3.0</div>
                          <div className="text-sm text-gray-600">Avg Energy Impact</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">5</div>
                          <div className="text-sm text-gray-600">Interactions Tracked</div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-2">Pattern Alert</h4>
                        <p className="text-sm text-yellow-700">
                          This relationship shows consistent energy drain patterns. Consider discussing boundaries or taking breaks between interactions.
                        </p>
                      </div>

                      <Button 
                        onClick={resetDemo}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Try Another Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Pattern Recognition</h3>
                    <p className="text-sm text-gray-600">
                      Automatically identifies trends in how relationships affect your well-being over time.
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Health Scoring</h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive health scores based on energy impact, boundary respect, and emotional safety.
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Personalized Insights</h3>
                    <p className="text-sm text-gray-600">
                      Actionable recommendations based on your unique patterns and baseline preferences.
                    </p>
                  </div>
                </div>
              </div>
            )}
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