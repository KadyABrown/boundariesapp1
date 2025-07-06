import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "What is BoundarySpace?",
    answer: "BoundarySpace is a relationship health tracking application that helps you understand how your relationships impact your emotional well-being. Through a personal baseline assessment and detailed interaction tracking, you can identify patterns and make informed decisions about your relationships."
  },
  {
    question: "How does the baseline assessment work?",
    answer: "The baseline assessment is a comprehensive quiz covering your communication style, emotional needs, boundary requirements, and core values. This creates a personalized foundation that the app uses to analyze all your relationships and provide compatibility insights."
  },
  {
    question: "What kind of data do I track?",
    answer: "You can track energy levels, anxiety, self-worth, physical symptoms, and emotional states before and after interactions. The app also tracks interaction types, duration, boundary events, and recovery patterns to provide comprehensive relationship analytics."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. All your relationship data is completely private and encrypted. We never share personal information with third parties, and you have full control over your data. Your privacy and emotional safety are our top priorities."
  },
  {
    question: "Can I track multiple relationships?",
    answer: "Yes, you can track unlimited relationships of any type - romantic, friendships, family, colleagues, etc. The app provides cross-relationship analytics to help you understand which connections are most beneficial for your well-being."
  },
  {
    question: "How long does it take to see patterns?",
    answer: "You'll start seeing basic insights after just a few interactions, but meaningful patterns typically emerge after 1-2 weeks of consistent tracking. The more data you provide, the more accurate and helpful the insights become."
  },
  {
    question: "Do I need to track every interaction?",
    answer: "No, you only track interactions when you want to. Many users focus on tracking interactions that feel significant or when they notice emotional changes. The app is designed to be helpful without being overwhelming."
  },
  {
    question: "What if I'm in an abusive relationship?",
    answer: "BoundarySpace can help you document patterns and recognize red flags, but it's not a substitute for professional help. If you're in an abusive situation, please reach out to local domestic violence resources or call the National Domestic Violence Hotline: 1-800-799-7233."
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export all your data at any time. This includes your baseline assessment, relationship profiles, interaction logs, and analytics. Your data belongs to you, and you should have full access to it."
  },
  {
    question: "Is BoundarySpace a replacement for therapy?",
    answer: "No, BoundarySpace is a self-help tool that complements but doesn't replace professional therapy or counseling. The insights can be valuable to discuss with a therapist, but they shouldn't be considered professional mental health advice."
  },
  {
    question: "What makes BoundarySpace different from other apps?",
    answer: "BoundarySpace focuses specifically on relationship patterns and their impact on your well-being. Unlike general mood trackers, it provides detailed analysis of how specific people and interactions affect your emotional and physical health over time."
  },
  {
    question: "Can I use this for work relationships?",
    answer: "Absolutely. Many users track relationships with colleagues, managers, and clients to understand workplace dynamics and their impact on stress and job satisfaction. The insights can help with boundary setting and professional development."
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a>
              <a href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
              <a href="/demo" className="text-gray-600 hover:text-purple-600 transition-colors">Demo</a>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* FAQ Header */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked 
            <span className="text-purple-600"> Questions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to know about BoundarySpace and how it can help improve your relationship health.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <Card key={index} className="border shadow-sm">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{item.question}</span>
                    {openItems.includes(index) ? (
                      <Minus className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                {openItems.includes(index) && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The best way to understand BoundarySpace is to try it yourself. Start with the baseline assessment and explore the features hands-on.
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-lg px-12 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Try BoundarySpace Now
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Start your journey today
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
            <a href="/demo" className="hover:text-white transition-colors">Demo</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2025 BoundarySpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}