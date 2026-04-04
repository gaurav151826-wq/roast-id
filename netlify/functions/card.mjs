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
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id parameter' }, { status: 400 });

    const db = supabase();

    if (req.method === 'GET') {
      const { data, error } = await db
        .from('cards')
        .select('*')
        .eq('issue_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return Response.json({ error: 'Card not found' }, { status: 404 });
        }
        throw error;
      }

      // Increment view count
      await db
        .from('cards')
        .update({ views: (data.views || 0) + 1 })
        .eq('issue_id', id);

      return Response.json(data);
    }

    if (req.method === 'PUT') {
      const { action } = await req.json();
      if (action === 'download') {
        const { data: card } = await db.from('cards').select('downloads').eq('issue_id', id).single();
        await db.from('cards').update({ downloads: (card?.downloads || 0) + 1 }).eq('issue_id', id);
      } else if (action === 'share') {
        const { data: card } = await db.from('cards').select('shares').eq('issue_id', id).single();
        await db.from('cards').update({ shares: (card?.shares || 0) + 1 }).eq('issue_id', id);
      } else if (action === 'verify') {
        await db.from('cards').update({ is_verified: true }).eq('issue_id', id);
      }
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (err) {
    console.error('API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const config = {
  path: '/api/card',
};
