import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  FileSpreadsheet,
  ArrowLeft,
  Home
} from "lucide-react";
import { Link } from "wouter";

interface PairedFlag {
  theme: string;
  greenFlag?: {
    id: number;
    title: string;
    description: string;
    exampleScenario: string;
    emotionalImpact: string;
    actionSteps: string;
  };
  redFlag?: {
    id: number;
    title: string;
    description: string;
    exampleScenario: string;
    emotionalImpact: string;
    actionSteps: string;
  };
}

export default function FlagExamples() {
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch paired flags data
  const { data: pairedFlags = [], isLoading } = useQuery<PairedFlag[]>({
    queryKey: ['/api/paired-flags'],
  });

  // Filter flags based on search and theme
  const filteredFlags = pairedFlags.filter(flag => {
    const matchesTheme = selectedTheme === "all" || flag.theme.toLowerCase() === selectedTheme.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      flag.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.greenFlag?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.redFlag?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTheme && matchesSearch;
  });

  // Get unique themes for filter dropdown
  const themes = Array.from(new Set(pairedFlags.map(flag => flag.theme))).sort();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-neutral-500">Loading relationship patterns...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="h-4 w-px bg-neutral-300"></div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Red & Green Flag Example Bank</h1>
          <p className="text-neutral-600 mt-2">Educational reference library for relationship patterns</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search flags by title, theme, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme.toLowerCase()}>
                {theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-neutral-600">
          Showing {filteredFlags.length} of {pairedFlags.length} relationship patterns
        </p>
      </div>

      {/* Paired Flag Content */}
      <div className="space-y-4">
        {filteredFlags.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No patterns found</h3>
            <p className="text-neutral-500 mb-4">
              {searchQuery || selectedTheme !== "all" 
                ? "Try adjusting your search or filter" 
                : "Flag examples will appear here once imported"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 border-b">Theme</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-b">Green Flag 💚</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 border-b">Red Flag 🚩</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 border-b">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 border-b">Example</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 border-b">Impact</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 border-b">Action Steps</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlags.map((flag, index) => (
                    <tr key={index} className="border-b hover:bg-neutral-50">
                      <td className="px-4 py-4 text-sm font-medium text-neutral-800 capitalize">
                        {flag.theme.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-4 text-sm text-green-700 font-medium max-w-xs">
                        {flag.greenFlag?.title || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-red-700 font-medium max-w-xs">
                        {flag.redFlag?.title || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 max-w-md">
                        {flag.greenFlag?.description || flag.redFlag?.description || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 max-w-md italic">
                        {flag.redFlag?.exampleScenario || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 max-w-md">
                        {flag.redFlag?.emotionalImpact || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 max-w-md whitespace-pre-line">
                        {flag.redFlag?.actionSteps || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredFlags.map((flag, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-full capitalize">
                      {flag.theme.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Green Flag */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        💚 Green Flag
                      </h4>
                      <p className="font-medium text-neutral-800">{flag.greenFlag?.title || 'N/A'}</p>
                    </div>
                    
                    {/* Red Flag */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-700 flex items-center gap-2">
                        🚩 Red Flag  
                      </h4>
                      <p className="font-medium text-neutral-800">{flag.redFlag?.title || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium text-neutral-700">Description:</h5>
                      <p className="text-neutral-600">{flag.greenFlag?.description || flag.redFlag?.description || '-'}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-700">Example:</h5>
                      <p className="text-neutral-600 italic">{flag.redFlag?.exampleScenario || '-'}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-700">Impact:</h5>
                      <p className="text-neutral-600">{flag.redFlag?.emotionalImpact || '-'}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-700">Action Steps:</h5>
                      <p className="text-neutral-600 whitespace-pre-line">{flag.redFlag?.actionSteps || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}