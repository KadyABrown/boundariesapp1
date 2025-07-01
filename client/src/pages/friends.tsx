import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  UserPlus, 
  Users, 
  Search, 
  Mail, 
  Phone, 
  UserCheck, 
  UserX, 
  Shield,
  Circle,
  MessageCircle,
  Settings,
  Heart
} from "lucide-react";

interface Friend {
  id: number;
  status: string;
  circleTag?: string;
  createdAt: string;
  friend: {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    profileImageUrl?: string;
  };
}

interface FriendRequest {
  id: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    profileImageUrl?: string;
  };
}

interface SearchResult {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profileImageUrl?: string;
}

export default function Friends() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"username" | "email" | "phone">("username");
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // Fetch friends
  const { data: friends = [], isLoading: friendsLoading } = useQuery<Friend[]>({
    queryKey: ["/api/friends"],
    enabled: isAuthenticated,
  });

  // Fetch friend requests (received)
  const { data: receivedRequests = [], isLoading: requestsLoading } = useQuery<FriendRequest[]>({
    queryKey: ["/api/friend-requests/received"],
    enabled: isAuthenticated,
  });

  // Fetch sent friend requests
  const { data: sentRequests = [], isLoading: sentLoading } = useQuery<FriendRequest[]>({
    queryKey: ["/api/friend-requests/sent"],
    enabled: isAuthenticated,
  });

  // Fetch shared relationship data from friends
  const { data: sharedData = [], isLoading: sharedLoading } = useQuery({
    queryKey: ["/api/friends/shared-data"],
    enabled: isAuthenticated,
  });

  // Search users mutation
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("GET", `/api/users/search?q=${encodeURIComponent(query)}&type=${searchBy}`);
      return await response.json();
    },
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("POST", "/api/friend-requests", { receiverId: userId });
    },
    onSuccess: () => {
      toast({ title: "Friend request sent!" });
      queryClient.invalidateQueries({ queryKey: ["/api/friend-requests/sent"] });
      setIsSearchDialogOpen(false);
    },
  });

  // Accept friend request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("PATCH", `/api/friend-requests/${requestId}/accept`);
    },
    onSuccess: () => {
      toast({ title: "Friend request accepted!" });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friend-requests/received"] });
    },
  });

  // Decline friend request mutation
  const declineRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      await apiRequest("DELETE", `/api/friend-requests/${requestId}`);
    },
    onSuccess: () => {
      toast({ title: "Friend request declined" });
      queryClient.invalidateQueries({ queryKey: ["/api/friend-requests/received"] });
    },
  });

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery.trim());
    }
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.username) {
      return `@${user.username}`;
    } else if (user?.email) {
      return user.email;
    }
    return "Unknown User";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Friends</h1>
          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Find Friends</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Search by</Label>
                  <Select value={searchBy} onValueChange={(value: any) => setSearchBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="username">Username</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Search</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchBy === "username" ? "Enter username..." :
                        searchBy === "email" ? "Enter email address..." :
                        "Enter phone number..."
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={searchMutation.isPending}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Search Results */}
                {searchMutation.data && (
                  <div className="space-y-2">
                    <Label>Search Results</Label>
                    {searchMutation.data.length === 0 ? (
                      <p className="text-sm text-neutral-500">No users found</p>
                    ) : (
                      <div className="space-y-2">
                        {searchMutation.data.map((user: SearchResult) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.profileImageUrl} />
                                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{getDisplayName(user)}</p>
                                {user.email && <p className="text-sm text-neutral-500">{user.email}</p>}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => sendRequestMutation.mutate(user.id)}
                              disabled={sendRequestMutation.isPending}
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="friends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Shared Data
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Requests ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Friends List */}
          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {friendsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : friends.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500">No friends yet</p>
                    <p className="text-sm text-neutral-400">Start by adding some friends!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {friends.map((friendship) => (
                      <div key={friendship.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={friendship.friend.profileImageUrl} />
                            <AvatarFallback>{getUserInitials(friendship.friend)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getDisplayName(friendship.friend)}</p>
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              {friendship.friend.email}
                              {friendship.circleTag && (
                                <Badge variant="secondary" className="text-xs">
                                  {friendship.circleTag}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shared Data */}
          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Shared Relationship Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sharedLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                        <div className="h-20 bg-neutral-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : sharedData.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500">No shared relationship data</p>
                    <p className="text-sm text-neutral-400">Friends can share their relationship profiles with you here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sharedData.map((profile: any) => (
                      <div key={`${profile.userId}-${profile.id}`} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{profile.name}</h3>
                            {profile.nickname && (
                              <p className="text-sm text-neutral-500">"{profile.nickname}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {profile.relationshipType || 'Connection'}
                            </Badge>
                            <p className="text-xs text-neutral-500">
                              Shared by {profile.sharedBy?.firstName} {profile.sharedBy?.lastName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {profile.relationshipStatus && (
                            <div>
                              <span className="font-medium">Status:</span> {profile.relationshipStatus}
                            </div>
                          )}
                          {profile.dateMet && (
                            <div>
                              <span className="font-medium">Met:</span> {new Date(profile.dateMet).toLocaleDateString()}
                            </div>
                          )}
                          {profile.howMet && (
                            <div>
                              <span className="font-medium">How:</span> {profile.howMet}
                            </div>
                          )}
                          {profile.currentStatus && (
                            <div>
                              <span className="font-medium">Current:</span> {profile.currentStatus}
                            </div>
                          )}
                        </div>
                        
                        {profile.importantNotes && (
                          <div className="mt-3 p-3 bg-neutral-50 rounded">
                            <p className="text-sm"><span className="font-medium">Notes:</span> {profile.importantNotes}</p>
                          </div>
                        )}
                        
                        {profile.customTags && profile.customTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {profile.customTags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friend Requests */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Friend Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-16 h-8 bg-neutral-200 rounded"></div>
                          <div className="w-16 h-8 bg-neutral-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : receivedRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500">No pending requests</p>
                    <p className="text-sm text-neutral-400">Friend requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {receivedRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.user.profileImageUrl} />
                            <AvatarFallback>{getUserInitials(request.user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getDisplayName(request.user)}</p>
                            <p className="text-sm text-neutral-500">{request.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => acceptRequestMutation.mutate(request.id)}
                            disabled={acceptRequestMutation.isPending}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => declineRequestMutation.mutate(request.id)}
                            disabled={declineRequestMutation.isPending}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sent Requests */}
          <TabsContent value="sent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Sent Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sentLoading ? (
                  <div className="space-y-3">
                    {[1].map(i => (
                      <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500">No sent requests</p>
                    <p className="text-sm text-neutral-400">Requests you send will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.user.profileImageUrl} />
                            <AvatarFallback>{getUserInitials(request.user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getDisplayName(request.user)}</p>
                            <p className="text-sm text-neutral-500">{request.user.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}