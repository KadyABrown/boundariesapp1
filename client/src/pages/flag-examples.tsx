import { Construction, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/navigation";

export default function FlagExamples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Coming Soon Icon */}
          <div className="mx-auto w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-8">
            <Construction className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Flag Examples
          </h1>
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            We're building a comprehensive library of relationship flag examples to help you 
            recognize healthy and unhealthy patterns. This feature will include paired examples 
            of green and red flags across different relationship themes.
          </p>

          {/* Feature Preview Card */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                What's Coming
              </CardTitle>
              <CardDescription>
                Features you can expect in the Flag Examples library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Paired Flag Cards</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Side-by-side comparison of healthy vs. unhealthy behaviors
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Themed Categories</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Organized by communication, trust, emotional safety, and more
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Real Examples</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Concrete scenarios and actionable guidance for each flag type
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Search & Filter</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Find relevant patterns by theme or search across descriptions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Link href="/dashboard">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg"
            >
              <Bell className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
          </Link>

          {/* Status Message */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            We're working hard to bring you this feature. Thank you for your patience!
          </p>
        </div>
      </div>
    </div>
  );
}