import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ChevronRight, Shield, Users, TrendingUp, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function FAQ() {
  const { user } = useAuth();
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is BoundarySpace and how does it work?",
          a: "BoundarySpace is a relationship health tracking app that helps you understand patterns, set boundaries, and build healthier connections. You create profiles for important relationships, log emotional check-ins, track behavioral flags, and receive insights about your relationship dynamics."
        },
        {
          q: "How do I get started with BoundarySpace?",
          a: "Simply sign up for an account, complete your personal baseline assessment to understand your communication style and needs, then start creating relationship profiles and logging your experiences. The app guides you through each step."
        },
        {
          q: "Is there a free trial?",
          a: "Yes! We offer a 7-day free trial so you can explore all features before committing to a subscription. No credit card required to start."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "Is my relationship data private and secure?",
          a: "Absolutely. Your data is encrypted with enterprise-grade security and stored securely. We never share your personal relationship information with third parties. You have full control over what you share and with whom."
        },
        {
          q: "Can other people see my relationship data?",
          a: "Only if you choose to share it. BoundarySpace includes friend circles and privacy controls that let you selectively share specific relationships with trusted friends or therapists. By default, everything is private to you."
        },
        {
          q: "What happens to my data if I cancel?",
          a: "You can export your data at any time. If you cancel, your data remains secure and accessible until you choose to delete your account. We provide clear data export options and respect your right to your information."
        }
      ]
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          q: "What is the baseline assessment?",
          a: "The baseline assessment is a comprehensive questionnaire that identifies your communication style, emotional needs, boundary preferences, and relationship patterns. This creates a personalized foundation for comparing and understanding your relationships."
        },
        {
          q: "How do behavioral flags work?",
          a: "Behavioral flags are green (healthy) and red (concerning) behaviors you observe in relationships. The app includes an extensive library of examples across categories like Communication, Trust, Respect, and Emotional Safety. You simply mark which behaviors you've observed."
        },
        {
          q: "What are emotional check-ins?",
          a: "Emotional check-ins are brief surveys you complete after interactions to track how you felt (safe, supported, excited) and rate your emotional state. Over time, this creates a pattern of how relationships affect your wellbeing."
        },
        {
          q: "How does the health score work?",
          a: "The health score (0-100%) is calculated based on the ratio of green to red flags, emotional check-in patterns, safety ratings, and compatibility with your personal baseline. It provides a quick visual indicator of relationship health."
        }
      ]
    },
    {
      category: "Relationships & Tracking",
      questions: [
        {
          q: "What types of relationships can I track?",
          a: "You can track any relationship that matters to you - romantic partners, friends, family members, colleagues, or anyone else. Each relationship can be customized with different privacy settings and tracking preferences."
        },
        {
          q: "How often should I log interactions?",
          a: "There's no requirement - log as often as feels helpful. Some users check in after every significant interaction, others do weekly reviews. The app works with whatever frequency suits your lifestyle."
        },
        {
          q: "Can I track multiple relationships at once?",
          a: "Yes! The app is designed to handle multiple relationships simultaneously. You can compare health scores, see cross-relationship patterns, and understand how different relationships affect you differently."
        }
      ]
    },
    {
      category: "Pricing & Subscription",
      questions: [
        {
          q: "How much does BoundarySpace cost?",
          a: "BoundarySpace costs $12.99/month or save 20% with an annual subscription. This includes all features, unlimited relationship profiles, and full access to analytics and insights."
        },
        {
          q: "Can I cancel anytime?",
          a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period, and you can always export your data."
        },
        {
          q: "Do you offer refunds?",
          a: "We offer a 7-day free trial to ensure the app meets your needs before you subscribe. All subscriptions are final once the trial period ends."
        }
      ]
    },
    {
      category: "Support & Help",
      questions: [
        {
          q: "Is BoundarySpace a replacement for therapy?",
          a: "No, BoundarySpace is a self-awareness and tracking tool, not a replacement for professional therapy or counseling. It can complement therapeutic work by helping you track patterns and progress, but it's not meant to diagnose or treat mental health conditions."
        },
        {
          q: "Can I share my data with my therapist?",
          a: "Yes! The app includes export features and sharing controls specifically designed to help you share relevant insights with therapists, counselors, or other mental health professionals."
        },
        {
          q: "What if I need help using the app?",
          a: "We provide comprehensive help documentation, video tutorials, and email support. Our team is responsive and committed to helping you get the most out of BoundarySpace."
        },
        {
          q: "Will you add new features?",
          a: "Yes! We're actively developing new features based on user feedback. Your subscription includes access to all future updates and improvements at no additional cost."
        }
      ]
    }
  ];

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
              <a href="/demo" className="text-gray-600 hover:text-gray-900">Demo</a>
              <a href="/faq" className="text-indigo-600 font-medium">FAQ</a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              {user ? (
                <a href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Dashboard
                </a>
              ) : (
                <div className="flex items-center space-x-4">
                  <a href="/api/login" className="text-gray-600 hover:text-gray-900">Log In</a>
                  <a href="/pricing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Subscribe
                  </a>
                </div>
              )}
            </div>
            <div className="md:hidden">
              {user ? (
                <a href="/dashboard" className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">
                  Dashboard
                </a>
              ) : (
                <a href="/api/login" className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">
                  Log In
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to know about BoundarySpace and relationship health tracking.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Getting Started</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Privacy & Security</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Features</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Support</div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqData.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 10 + itemIndex; // Unique index
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 pr-4">{item.q}</h3>
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you get the most out of BoundarySpace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg w-full sm:w-auto"
              onClick={() => window.location.href = 'mailto:support@boundaryspace.com'}
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-3 text-lg w-full sm:w-auto"
              onClick={() => window.location.href = '/demo'}
            >
              Try Demo
            </Button>
          </div>
        </div>

        {/* Ready to Start CTA */}
        <div className="mt-12 text-center bg-indigo-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of users building healthier, more fulfilling relationships with BoundarySpace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg w-full sm:w-auto"
              onClick={() => window.location.href = '/pricing'}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 text-lg w-full sm:w-auto"
              onClick={() => window.location.href = '/demo'}
            >
              Try Demo First
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}