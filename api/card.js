import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('issue_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Card not found' });
        }
        throw error;
      }

      // Increment view count
      await supabase
        .from('cards')
        .update({ views: (data.views || 0) + 1 })
        .eq('issue_id', id);

      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { action } = req.body;
      if (action === 'download') {
        const { data: card } = await supabase.from('cards').select('downloads').eq('issue_id', id).single();
        await supabase.from('cards').update({ downloads: (card?.downloads || 0) + 1 }).eq('issue_id', id);
      } else if (action === 'share') {
        const { data: card } = await supabase.from('cards').select('shares').eq('issue_id', id).single();
        await supabase.from('cards').update({ shares: (card?.shares || 0) + 1 }).eq('issue_id', id);
      } else if (action === 'verify') {
        await supabase.from('cards').update({ is_verified: true }).eq('issue_id', id);
      }
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
