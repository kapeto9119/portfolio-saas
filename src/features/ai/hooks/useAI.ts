import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseAIOptions<T> {
  endpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAI<T>({
  endpoint,
  onSuccess,
  onError,
  successMessage = "Operation completed successfully!",
  errorMessage = "Operation failed. Please try again.",
}: UseAIOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (payload: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }

      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    data,
    error,
    reset: () => {
      setData(null);
      setError(null);
    },
  };
} 