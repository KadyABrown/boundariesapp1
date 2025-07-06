import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Play, Eye, BarChart3, Users, Heart } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">BoundarySpace</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/"}
              >
                ← Back to Home
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try It Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Header */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            See BoundarySpace 
            <span className="text-purple-600"> In Action</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore how BoundarySpace helps you understand relationship patterns and make informed decisions about your personal connections.
          </p>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="h-20 w-20 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Demo</h3>
                <p className="text-gray-600">Watch a 3-minute walkthrough of key features</p>
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 mt-4"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Start Interactive Demo
                </Button>
              </div>
            </div>
            <p className="text-gray-500 text-center">
              Click above to experience BoundarySpace with sample data
            </p>
          </div>
        </div>
      </section>

      {/* Feature Previews */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Key Features Preview
          </h2>

          <div className="space-y-20">
            {/* Baseline Assessment Preview */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="h-8 w-8 text-purple-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Personal Baseline Assessment</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Start with a comprehensive quiz that maps your communication style, emotional needs, 
                  and boundary requirements. This becomes your personal foundation for evaluating all relationships.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    25+ multiple choice questions
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Covers communication, emotional, and boundary preferences
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Creates your unique relationship compatibility profile
                  </li>
                </ul>
              </div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Sample Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-semibold">When someone gives you feedback, you prefer:</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-purple-50 rounded border border-purple-200">
                        <span className="text-purple-800">→ Direct and specific guidance</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border">
                        Gentle suggestions with examples
                      </div>
                      <div className="p-3 bg-gray-50 rounded border">
                        Questions that help me self-reflect
                      </div>
                      <div className="p-3 bg-gray-50 rounded border">
                        Written feedback I can process privately
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interaction Tracking Preview */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="shadow-lg order-2 md:order-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Energy Impact Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Before Interaction</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        <span className="font-semibold">6/10</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>After Interaction</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                        <span className="font-semibold">3/10</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-sm text-red-600 font-semibold">
                        -3 Energy Impact
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Consistent pattern detected over 5 interactions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Comprehensive Interaction Tracking</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Log detailed interactions with before/after measurements of energy, anxiety, and self-worth. 
                  The app automatically identifies patterns and their impact on your well-being.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Pre and post interaction measurements
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Automatic pattern recognition
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Physical symptom tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Analytics Preview */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-8 w-8 text-green-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Relationship Analytics</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Get intelligent insights comparing all your relationships. See which connections energize you 
                  and which ones consistently drain your emotional resources.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Cross-relationship health comparison
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Boundary violation rate analysis
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Compatibility scoring based on your baseline
                  </li>
                </ul>
              </div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Relationship Health Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">Sarah (Best Friend)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-green-200 rounded-full">
                          <div className="w-10/12 h-full bg-green-600 rounded-full"></div>
                        </div>
                        <span className="font-semibold text-green-700">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span className="font-medium">Alex (Colleague)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-yellow-200 rounded-full">
                          <div className="w-6/12 h-full bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="font-semibold text-yellow-700">68%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="font-medium">Jordan (Dating)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-red-200 rounded-full">
                          <div className="w-3/12 h-full bg-red-600 rounded-full"></div>
                        </div>
                        <span className="font-semibold text-red-700">34%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Try BoundarySpace?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start with your personal baseline assessment and begin tracking your first relationship interactions.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-12 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Begin Your Assessment
          </Button>
          <p className="text-sm text-purple-200 mt-4">
            No signup required • Start immediately • Completely free
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold">BoundarySpace</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering healthier relationships through data-driven insights.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2025 BoundarySpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}