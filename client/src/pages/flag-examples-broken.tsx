import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  Upload,
  FileSpreadsheet,
  Download,
  ArrowLeft,
  Home
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import PairedFlagCard from "@/components/paired-flag-card";

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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState("");
  const { toast } = useToast();

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

  const handleImportCSV = async () => {
    if (!csvData.trim()) {
      toast({
        title: "No Data",
        description: "Please paste your CSV data first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/import-paired-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Import Successful",
          description: result.message,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/paired-flags'] });
        setIsImportDialogOpen(false);
        setCsvData("");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import CSV data. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = `,,Red & Green Flag example bank,,,,,
Green Flag 💚,Red Flag 🚩,Behavior/Description,Example,Impact (Why it Matters),Worth Addressing? (Red Flags),Action Steps (How to Address It),Theme
Keeps their promises and always follows through.,Cancels plans or breaks promises way too often without a good reason.,"Healthy communication involves active listening—focusing on the other person's words, tone, and body language. A red flag arises when someone consistently talks over you or invalidates what you're expressing, leaving you feeling unheard.",They promise to help you move but cancel last minute without a good reason.,"Consistent unreliability undermines trust, leaving you feeling unsupported and questioning their priorities.",Always worth addressing,"Communicate Clearly
Address the pattern calmly and express how it makes you feel.
Example: "I've noticed plans keep falling through, and it's disappointing because I value spending time together."

Set Expectations
Share what you need moving forward.
Example: "I understand things come up, but consistency is important to me. If plans change, I'd appreciate more notice or effort to reschedule."

Observe & Decide
Watch for changes in their behavior. If they continue breaking promises without valid reasons, evaluate if this aligns with your standards and what you want in a relationship.",Trust`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paired-flags-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading relationship patterns...</p>
          </div>
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
        
        <div className="flex gap-3 flex-wrap">
          {/* Import/Export buttons removed per user request */}
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

      {/* Paired Flag Table */}
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
                        {flag.greenFlag?.exampleScenario || flag.redFlag?.exampleScenario || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 max-w-md">
                        {flag.greenFlag?.emotionalImpact || flag.redFlag?.emotionalImpact || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 max-w-md whitespace-pre-line">
                        {flag.greenFlag?.actionSteps || flag.redFlag?.actionSteps || '-'}
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
                      <p className="text-neutral-600 italic">{flag.greenFlag?.exampleScenario || flag.redFlag?.exampleScenario || '-'}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-700">Impact:</h5>
                      <p className="text-neutral-600">{flag.greenFlag?.emotionalImpact || flag.redFlag?.emotionalImpact || '-'}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-neutral-700">Action Steps:</h5>
                      <p className="text-neutral-600 whitespace-pre-line">{flag.greenFlag?.actionSteps || flag.redFlag?.actionSteps || '-'}</p>
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
              <DialogHeader>
                <DialogTitle>Import Your Paired Flag Data</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-2">
                    Paste your CSV data with paired green/red flags per row:
                  </p>
                  <Textarea
                    placeholder="Green Flag,Red Flag,Description,Example,Impact,Worth Addressing,Action Steps,Theme"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    className="min-h-48 font-mono text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleImportCSV} className="flex-1">
                    Import Data
                  </Button>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search patterns or themes..."
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

      {/* Paired Flag Table */}
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
                : "Import your CSV data to see relationship patterns"}
            </p>
            {pairedFlags.length === 0 && (
              <Button 
                variant="outline" 
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Your Data
              </Button>
            )}
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
                    <tr key={`${flag.theme}-${index}`} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-4 py-4 text-sm font-medium text-neutral-800 capitalize">
                        {flag.theme.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-4 text-sm text-green-800 max-w-xs">
                        {flag.greenFlag?.title || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-red-800 max-w-xs">
                        {flag.redFlag?.title || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 max-w-md">
                        {flag.greenFlag?.description || flag.redFlag?.description || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 max-w-md italic">
                        {flag.greenFlag?.exampleScenario || flag.redFlag?.exampleScenario || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 max-w-md">
                        {flag.greenFlag?.emotionalImpact || flag.redFlag?.emotionalImpact || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 max-w-md whitespace-pre-line">
                        {flag.greenFlag?.actionSteps || flag.redFlag?.actionSteps || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="lg:hidden space-y-4">
              {filteredFlags.map((flag, index) => (
                <div key={`${flag.theme}-${index}`} className="bg-white shadow-sm rounded-lg p-4 border border-neutral-200">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded capitalize">
                      {flag.theme.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                        <h4 className="text-sm font-semibold text-green-800 mb-1">Green Flag 💚</h4>
                        <p className="text-sm text-green-700">{flag.greenFlag?.title || '-'}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                        <h4 className="text-sm font-semibold text-red-800 mb-1">Red Flag 🚩</h4>
                        <p className="text-sm text-red-700">{flag.redFlag?.title || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <h5 className="font-medium text-neutral-700">Description:</h5>
                        <p className="text-neutral-600">{flag.greenFlag?.description || flag.redFlag?.description || '-'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-neutral-700">Example:</h5>
                        <p className="text-neutral-600 italic">{flag.greenFlag?.exampleScenario || flag.redFlag?.exampleScenario || '-'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-neutral-700">Impact:</h5>
                        <p className="text-neutral-600">{flag.greenFlag?.emotionalImpact || flag.redFlag?.emotionalImpact || '-'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-neutral-700">Action Steps:</h5>
                        <p className="text-neutral-600 whitespace-pre-line">{flag.greenFlag?.actionSteps || flag.redFlag?.actionSteps || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {filteredFlags.length > 0 && (
        <div className="text-center mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            Educational reference library for healthy relationship patterns
          </p>
        </div>
      )}
    </div>
  );
}