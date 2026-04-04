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

    // 1. GET: Fetching the recent roasts
    if (req.method === 'GET') {
      const { data, error } = await db
        .from('roast_licenses') // ✅ FIXED: Changed from 'cards'
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return Response.json(data || []); // Returns empty array if no data
    }

    // 2. POST: Creating a new roast
    if (req.method === 'POST') {
      const { name, status, achievements, luck_level, issue_id } = await req.json();
      
      const { data, error } = await db
        .from('roast_licenses') // ✅ FIXED: Changed from 'cards'
        .insert({
          name,
          status,
          achievements,
          luck_level,
          issue_id,
          // Note: brain_rot_level is skipped here because it's in a different table
        })
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
  path: '/api/licenses',
};
