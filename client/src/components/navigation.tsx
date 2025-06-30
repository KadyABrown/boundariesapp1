import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Menu, Bell, BarChart3, BookOpen, Settings, Target, Heart, Flag } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3, current: location === "/" },
    { name: "Boundaries", href: "/boundaries", icon: Target, current: location === "/boundaries" },
    { name: "Relationships", href: "/relationships", icon: Heart, current: location === "/relationships" || location.startsWith("/relationships/") },
    { name: "Flag Examples", href: "/flag-examples", icon: Flag, current: location === "/flag-examples" },
    { name: "Insights", href: "/insights", icon: BarChart3, current: location === "/insights" },
  ];

  const handleNavigation = (href: string) => {
    setLocation(href);
    setIsSheetOpen(false);
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-neutral-800">BoundarySpace</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`${
                  item.current
                    ? "text-primary border-b-2 border-primary"
                    : "text-neutral-500 hover:text-neutral-700"
                } pb-1 font-medium transition-colors`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4 text-neutral-400" />
            </Button>
            
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImageUrl || ""} />
              <AvatarFallback className="bg-primary text-white text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">BoundarySpace</h2>
                </div>
                
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className={`${
                          item.current
                            ? "bg-primary text-white"
                            : "text-neutral-600 hover:bg-neutral-100"
                        } w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                  
                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    <button 
                      className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={() => window.location.href = '/api/logout'}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
