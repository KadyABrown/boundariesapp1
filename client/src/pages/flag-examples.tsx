import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Heart, 
  AlertTriangle, 
  BookmarkPlus, 
  BookmarkCheck,
  Plus,
  Upload,
  FileSpreadsheet 
} from "lucide-react";

export default function FlagExamples() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Fetch flag examples with filters
  const { data: flagExamples = [], isLoading: flagsLoading } = useQuery({
    queryKey: ['/api/flag-examples', { type: selectedType, theme: selectedTheme, search: searchQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedTheme !== "all") params.append("theme", selectedTheme);
      if (searchQuery) params.append("search", searchQuery);
      
      const url = `/api/flag-examples${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
      return response.json();
    },
    retry: false,
  });

  // Fetch user's saved flags
  const { data: savedFlags = [] } = useQuery({
    queryKey: ['/api/saved-flags'],
    retry: false,
    enabled: isAuthenticated,
  });

  const saveFlag = useMutation({
    mutationFn: async (flagId: number) => {
      await apiRequest("POST", "/api/saved-flags", { flagExampleId: flagId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-flags'] });
      toast({
        title: "Success",
        description: "Flag saved to your collection",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save flag",
        variant: "destructive",
      });
    },
  });

  const removeFlag = useMutation({
    mutationFn: async (flagId: number) => {
      await apiRequest("DELETE", `/api/saved-flags/${flagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-flags'] });
      toast({
        title: "Success",
        description: "Flag removed from your collection",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove flag",
        variant: "destructive",
      });
    },
  });

  // Get unique themes for filter dropdown
  const themes = Array.from(new Set(flagExamples.map((flag: any) => flag.theme))).sort();

  const isFlagSaved = (flagId: number) => {
    return Array.isArray(savedFlags) && savedFlags.some((saved: any) => saved.flagExampleId === flagId);
  };

  const handleSaveToggle = (flagId: number) => {
    if (isFlagSaved(flagId)) {
      removeFlag.mutate(flagId);
    } else {
      saveFlag.mutate(flagId);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor": return "bg-blue-100 text-blue-700 border-blue-200";
      case "moderate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "dealbreaker": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getAddressabilityColor = (addressability: string) => {
    switch (addressability) {
      case "always_worth_addressing": return "bg-green-100 text-green-700 border-green-200";
      case "sometimes_worth_addressing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "dealbreaker": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const formatAddressability = (addressability: string) => {
    return addressability.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Red & Green Flag Example Bank</h1>
            <p className="text-neutral-600 mt-2">Educational reference library for relationship patterns</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Flag Examples</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Upload a CSV file with flag examples. The file should include columns for:
                    Flag Type, Title, Description, Example Scenario, Emotional Impact, Addressability, Action Steps, Theme, and Severity.
                  </p>
                  <Input type="file" accept=".csv,.xlsx,.xls" />
                  <Button className="w-full">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {isAuthenticated && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flag
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Flag Example</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-neutral-600 mb-4">
                    Create a custom flag example for your personal reference library.
                  </div>
                  {/* Flag creation form would go here */}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search flags</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by title, description, theme, or scenario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="green">Green Flags</SelectItem>
                  <SelectItem value="red">Red Flags</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  {themes.map((theme: string) => (
                    <SelectItem key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Flag Examples Grid */}
        {flagsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 rounded"></div>
                    <div className="h-3 bg-neutral-200 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : flagExamples.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No flags found</h3>
            <p className="text-neutral-600">
              {searchQuery || selectedType !== "all" || selectedTheme !== "all"
                ? "Try adjusting your search or filters"
                : "The flag example library is empty. Import some examples to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flagExamples.map((flag: any) => (
              <Card key={flag.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {flag.flagType === "green" ? (
                        <Heart className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <Badge 
                        variant="secondary" 
                        className={flag.flagType === "green" 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {flag.flagType === "green" ? "Green Flag" : "Red Flag"}
                      </Badge>
                    </div>
                    
                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveToggle(flag.id)}
                        disabled={saveFlag.isPending || removeFlag.isPending}
                      >
                        {isFlagSaved(flag.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-blue-600" />
                        ) : (
                          <BookmarkPlus className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">{flag.title}</CardTitle>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {flag.theme.charAt(0).toUpperCase() + flag.theme.slice(1)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSeverityColor(flag.severity)}`}
                    >
                      {flag.severity.charAt(0).toUpperCase() + flag.severity.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-neutral-700 mb-1">Description</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{flag.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-700 mb-1">Example Scenario</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed italic">"{flag.exampleScenario}"</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-700 mb-1">Emotional Impact</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{flag.emotionalImpact}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-700 mb-2">Addressability</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAddressabilityColor(flag.addressability)}`}
                    >
                      {formatAddressability(flag.addressability)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-700 mb-1">Suggested Action Steps</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{flag.actionSteps}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}