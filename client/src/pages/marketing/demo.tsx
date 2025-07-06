import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shield, Plus, CheckCircle, Calendar, TrendingUp } from "lucide-react";

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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState([5]);
  const [isCreated, setIsCreated] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const handleCreateBoundary = () => {
    if (title && category) {
      setIsCreated(true);
      setTimeout(() => setShowActivity(true), 1000);
    }
  };

  const resetDemo = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setImportance([5]);
    setIsCreated(false);
    setShowActivity(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <MarketingNavigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Interactive Boundary Demo
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Try creating a personal boundary and see how BoundarySpace helps you track and maintain healthy relationships through intelligent insights.
            </p>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Boundary Creation Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Your Boundary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Boundary Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., No work calls after 8 PM"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isCreated}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory} disabled={isCreated}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work-life">Work-Life Balance</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="personal-space">Personal Space</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="emotional">Emotional</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Importance Level: {importance[0]}/10</Label>
                    <Slider
                      value={importance}
                      onValueChange={setImportance}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={isCreated}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Why is this boundary important to you?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isCreated}
                    />
                  </div>

                  {!isCreated ? (
                    <Button 
                      onClick={handleCreateBoundary}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!title || !category}
                    >
                      Create Boundary
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Boundary Created Successfully!</span>
                      </div>
                      <Button 
                        onClick={resetDemo}
                        variant="outline"
                        className="w-full"
                      >
                        Try Another Boundary
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Preview */}
              <div className="space-y-6">
                {/* Boundary List Preview */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Your Boundaries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isCreated ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-purple-800">{title}</h4>
                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {importance[0]}/10
                            </span>
                          </div>
                          <p className="text-sm text-purple-600 mb-2">
                            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          {description && (
                            <p className="text-sm text-gray-600">{description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </div>
                        </div>
                        
                        {/* Sample existing boundaries */}
                        <div className="p-4 border rounded-lg opacity-60">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">Limit social media to 30 min/day</h4>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">8/10</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Social Media</p>
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Create your first boundary to see it appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Activity Feed Preview */}
                {showActivity && (
                  <Card className="shadow-lg animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Boundary Respected</p>
                            <p className="text-sm text-green-600">{title} • Just now</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">Progress Update</p>
                            <p className="text-sm text-blue-600">Boundary respect rate: 85% this week</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8">This is Just the Beginning</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Intelligent Tracking</h3>
                <p className="text-sm text-gray-600">
                  Monitor how relationships affect your energy, anxiety, and well-being with detailed analytics.
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Pattern Recognition</h3>
                <p className="text-sm text-gray-600">
                  Discover hidden patterns and get personalized insights based on your interaction data.
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Actionable Guidance</h3>
                <p className="text-sm text-gray-600">
                  Get specific recommendations for improving relationship health and maintaining boundaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Relationships?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start your journey toward healthier boundaries and more fulfilling relationships with personalized insights and intelligent tracking.
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