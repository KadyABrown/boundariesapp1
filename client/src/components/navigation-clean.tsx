import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Menu, Bell, BarChart3, BookOpen, Settings, Target, Heart, Flag, User, LogOut, Users, Brain, Crown } from "lucide-react";

export default function NavigationClean() {
  const [location, setLocation] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // For now, we'll use basic user data - this will be replaced with actual user data from API
  const user = { email: "user@example.com", name: "User" };
  const isAdmin = false;
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3, current: location === "/" },
    { name: "Baseline", href: "/baseline", icon: Brain, current: location === "/baseline" },
    { name: "Relationships", href: "/relationships", icon: Heart, current: location === "/relationships" || location.startsWith("/relationships/") },
    { name: "Boundaries", href: "/boundaries", icon: Shield, current: location === "/boundaries" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Crown, current: location === "/admin" }] : []),
  ];

  const handleNavigation = (href: string) => {
    setLocation(href);
    setIsSheetOpen(false);
  };

  const userInitials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
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
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* User Menu & Mobile Navigation */}
          <div className="flex items-center space-x-4">
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.name || undefined} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 px-0"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open main menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-semibold">BoundarySpace</span>
                  </div>
                  
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          item.current
                            ? "bg-primary/10 text-primary"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-neutral-200">
                    <div className="flex items-center space-x-3 p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.name || undefined} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-900">{user?.name || "User"}</span>
                        <span className="text-xs text-neutral-500">{user?.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 px-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => window.location.href = '/api/logout'}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}