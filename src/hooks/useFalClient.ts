
import { useEffect, useState } from 'react';
import * as falApi from '@fal-ai/client';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from "@/providers/AuthProvider";

export const useFalClient = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const initializeFalClient = async () => {
      try {
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to use the text generation feature.",
            variant: "destructive",
          });
          setIsError(true);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          toast({
            title: "Authentication Error",
            description: "Please log in again to use this feature.",
            variant: "destructive",
          });
          setIsError(true);
          return;
        }

        const falKey = localStorage.getItem('FAL_KEY');
        if (!falKey) {
          const { data, error: invokeError } = await supabase.functions.invoke('get-secret', {
            body: { name: 'FAL_KEY' },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
            }
          });

          if (invokeError) {
            console.error('Error fetching FAL_KEY:', invokeError);
            toast({
              title: "Error",
              description: "Failed to fetch FAL API key. Please try again.",
              variant: "destructive",
            });
            setIsError(true);
            return;
          }

          if (data?.value) {
            localStorage.setItem('FAL_KEY', data.value);
            falApi.fal.config({
              credentials: data.value
            });
            console.log('Fal.ai client initialized with secret');
            setIsInitialized(true);
            return;
          }
        } else {
          falApi.fal.config({
            credentials: falKey
          });
          console.log('Fal.ai client initialized from localStorage');
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize fal.ai client:', err);
        localStorage.removeItem('FAL_KEY');
        toast({
          title: "Error",
          description: "Failed to initialize Fal.ai client. Please check your API key.",
          variant: "destructive",
        });
        setIsError(true);
      }
    };

    initializeFalClient();
  }, [toast, user]);

  return { isInitialized, isError };
};
