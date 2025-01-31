import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

export async function getChatBotResponses() {
  const { data, error } = await supabase
    .from('chatbot_responses')
    .select('*');
  
  if (error) {
    console.error('Error fetching chatbot data:', error);
    return null;
  }
  
  return data;
}

export async function findResponseForQuestion(question: string) {
  try {
    const { data, error } = await supabase
      .from('chatbot_responses')
      .select('*')
      .textSearch('question', `'${question}'`, {
        type: 'websearch',
        config: 'korean'
      });

    if (error) {
      console.error('Error searching responses:', error);
      return null;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error in findResponseForQuestion:', error);
    return null;
  }
} 