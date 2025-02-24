
import { supabase } from "@/integrations/supabase/client";
import { ModelType } from '@/types/modelTypes';

export const generateText = async (prompt: string, selectedModel: ModelType) => {
  // Get the Supabase session for authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Authentication required');
  }

  // Get the Supabase URL from the client
  const supabaseUrl = supabase.getClientUrl();

  // Make a POST request to the Edge Function
  const response = await fetch(
    `${supabaseUrl}/functions/v1/fal`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        modelId: 'fal-ai/any-llm',
        input: {
          prompt,
          model: selectedModel,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.error || 'Failed to generate text';
    } catch (e) {
      errorMessage = `Failed to generate text: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
};
