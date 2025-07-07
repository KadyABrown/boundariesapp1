import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface StripeSubscriptionButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function StripeSubscriptionButton({ className, children, disabled }: StripeSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/get-or-create-subscription");
      const data = await response.json();
      
      if (data.clientSecret) {
        // Store client secret in localStorage and navigate to subscribe page
        localStorage.setItem('stripeClientSecret', data.clientSecret);
        window.location.href = '/subscribe';
      } else {
        throw new Error("Failed to create subscription");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscription}
      disabled={disabled || isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export default StripeSubscriptionButton;