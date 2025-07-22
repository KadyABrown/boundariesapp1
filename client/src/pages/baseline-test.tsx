import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";

export default function BaselineTestPage() {
  const { isAuthenticated } = useAuth();

  // Fetch current baseline data
  const { data: currentBaseline, isLoading: baselineLoading } = useQuery({
    queryKey: ["/api/baseline"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Baseline Test Page</h1>
        
        {baselineLoading ? (
          <div>Loading baseline data...</div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Baseline Data:</h2>
            <pre className="bg-white p-4 rounded border">
              {JSON.stringify(currentBaseline, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}