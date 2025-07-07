import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ShopifyPaymentButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ShopifyPaymentButton({ className, children, disabled }: ShopifyPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = () => {
    // Redirect to the marketing pricing page for subscription signup
    window.location.href = '/pricing';
  };

  return (
    <Button
      onClick={handlePayment}
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

export default ShopifyPaymentButton;