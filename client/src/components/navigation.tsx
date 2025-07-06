import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Menu, Bell, BarChart3, BookOpen, Settings, Target, Heart, Flag, User, LogOut, Users, Brain, Crown } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isAdmin = user?.email === "hello@roxzmedia.com" || user?.id === "44415082";
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3, current: location === "/" },
    { name: "Boundaries", href: "/boundaries", icon: Target, current: location === "/boundaries" },
    { name: "Relationships", href: "/relationships", icon: Heart, current: location === "/relationships" || location.startsWith("/relationships/") },
    { name: "My Baseline", href: "/baseline", icon: Brain, current: location === "/baseline" },
    { name: "Friends", href: "/friends", icon: Users, current: location === "/friends" },
    { name: "Insights", href: "/insights", icon: BarChart3, current: location === "/insights" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Crown, current: location === "/admin" }] : []),
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
            
            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {(user?.firstName && user?.lastName) 
                        ? `${user.firstName} ${user.lastName}` 
                        : "User"
                      }
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email || ""}
                    </p>
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
                <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
