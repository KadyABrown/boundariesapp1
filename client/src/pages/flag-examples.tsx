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
  Download
} from "lucide-react";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Red & Green Flag Example Bank</h1>
          <p className="text-neutral-600 mt-2">Educational reference library for relationship patterns</p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={() => {
              fetch('/api/import-user-csv', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                  toast({
                    title: "Sample Data Loaded",
                    description: data.message,
                  });
                  queryClient.invalidateQueries({ queryKey: ['/api/paired-flags'] });
                })
                .catch(() => {
                  toast({
                    title: "Load Failed",
                    description: "Failed to load sample data",
                    variant: "destructive",
                  });
                });
            }}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Load Sample Data
          </Button>
          
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
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

      {/* Paired Flag Cards */}
      <div className="space-y-8">
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
          filteredFlags.map((flag, index) => (
            <PairedFlagCard 
              key={`${flag.theme}-${index}`}
              data={flag}
            />
          ))
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