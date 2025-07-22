import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import BaselinePageClean from './pages/baseline-clean';
import RelationshipsPageClean from './pages/relationships-clean';
import BoundariesPageClean from './pages/boundaries-clean';
import NavigationClean from './components/navigation-clean';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <NavigationClean />
        
        <main className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={BaselinePageClean} />
            <Route path="/baseline" component={BaselinePageClean} />
            <Route path="/relationships" component={RelationshipsPageClean} />
            <Route path="/boundaries" component={BoundariesPageClean} />
            <Route>
              <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Page Not Found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            </Route>
          </Switch>
        </main>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;