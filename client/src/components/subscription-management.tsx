import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, AlertTriangle, CheckCircle, ExternalLink, RefreshCw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SubscriptionStatus {
  status: string;
  hasSubscription: boolean;
  subscriptionId?: string;
  customerId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  priceId?: string;
  amount?: number;
  currency?: string;
  interval?: string;
  message?: string;
}

export function SubscriptionManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subscription status
  const { data: subscription, isLoading: statusLoading, error } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/subscription/status'],
    retry: 1,
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/cancel");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Cancelled",
        description: data.message || "Your subscription has been cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/reactivate");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Reactivated",
        description: data.message || "Your subscription has been reactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reactivate subscription",
        variant: "destructive",
      });
    },
  });

  // Update payment method mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/update-payment");
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe customer portal
      window.open(data.portalUrl, '_blank');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to open payment portal",
        variant: "destructive",
      });
    },
  });

  const handleCreateCheckout = async () => {
    try {
      const response = await apiRequest("POST", "/api/subscription/checkout");
      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Error",
          description: "Unable to create checkout session",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  const handleRefreshStatus = () => {
    setIsLoading(true);
    queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] })
      .finally(() => setIsLoading(false));
  };

  if (statusLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Subscription</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "There was an error loading your subscription status."}
            </p>
            <Button onClick={handleRefreshStatus} variant="outline" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatAmount = (amount?: number, currency?: string) => {
    if (!amount || !currency) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // No subscription case
  if (!subscription.hasSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-6">
              {subscription.message || "You don't have an active subscription."}
            </p>
            <Button onClick={() => window.location.href = '/checkout'}>
              Subscribe Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active subscription case
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subscription Status */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Current Plan</h3>
            <p className="text-sm text-muted-foreground">BoundarySpace Premium</p>
          </div>
          <div className="flex items-center gap-2">
            {subscription.status === 'active' ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">
                {subscription.status}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Billing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-1">Amount</h4>
            <p className="text-sm text-muted-foreground">
              {formatAmount(subscription.amount, subscription.currency)}
              {subscription.interval && ` per ${subscription.interval}`}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Next Billing Date</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Cancellation Warning */}
        {subscription.cancelAtPeriodEnd && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Subscription Cancelled</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. 
                  You'll retain access until then.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => updatePaymentMutation.mutate()}
            disabled={updatePaymentMutation.isPending}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {updatePaymentMutation.isPending ? "Opening..." : "Manage Payment"}
          </Button>

          {subscription.cancelAtPeriodEnd ? (
            <Button 
              onClick={() => reactivateMutation.mutate()}
              disabled={reactivateMutation.isPending}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {reactivateMutation.isPending ? "Reactivating..." : "Reactivate Subscription"}
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          )}
        </div>

        {/* Refresh Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefreshStatus}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Refreshing..." : "Refresh Status"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubscriptionManagement;