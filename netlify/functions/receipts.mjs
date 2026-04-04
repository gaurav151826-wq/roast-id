import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  Netlify.env.get('NEXT_PUBLIC_SUPABASE_URL'),
  Netlify.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  try {
    const db = supabase();

    if (req.method === 'GET') {
      const { data, error } = await db
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return Response.json(data);
    }

    if (req.method === 'POST') {
      const { name, vibe, addictions, life_progress, transaction_id } = await req.json();
      const { data, error } = await db
        .from('receipts')
        .insert({ name, vibe, addictions, life_progress, transaction_id })
        .select()
        .single();
      if (error) throw error;
      return Response.json(data, { status: 201 });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (err) {
    console.error('API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const config = {
  path: '/api/receipts',
};
