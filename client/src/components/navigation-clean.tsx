import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { UserCircle, BarChart3, Users, Shield } from 'lucide-react';

export default function NavigationClean() {
  const [location] = useLocation();

  const navItems = [
    { href: '/baseline', label: 'Baseline', icon: UserCircle },
    { href: '/relationships', label: 'Relationships', icon: Users },
    { href: '/boundaries', label: 'Boundaries', icon: Shield }
  ];

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">BoundarySpace</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.startsWith(item.href);
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <UserCircle className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}