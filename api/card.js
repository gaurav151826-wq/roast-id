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
      // Primary card data lives in `roast_licenses`.
      const { data, error } = await supabase
        .from('roast_licenses')
        .select('*')
        .eq('issue_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Card not found' });
        }
        throw error;
      }

      // Try to fetch brain rot extras (optional table). Provide sensible defaults when missing.
      let brain_rot_level = 50;
      try {
        const { data: extra, error: extraErr } = await supabase
          .from('roast_card_extras')
          .select('brain_rot_level')
          .eq('issue_id', id)
          .single();
        if (!extraErr && extra) brain_rot_level = extra.brain_rot_level ?? 50;
      } catch (e) {}

      // Merge and return a stable shape that the frontend expects.
      const result = {
        id: data.id,
        name: data.name,
        status: data.status,
        achievements: data.achievements,
        luck_level: data.luck_level,
        brain_rot_level,
        issue_id: data.issue_id,
        is_verified: data.is_verified || false,
        downloads: data.downloads || 0,
        shares: data.shares || 0,
        views: data.views || 0,
        created_at: data.created_at,
      };

      // Best-effort: increment `views` if that column exists; ignore errors if not present.
      try {
        await supabase
          .from('roast_licenses')
          .update({ views: (data.views || 0) + 1 })
          .eq('issue_id', id);
      } catch (e) {}

      return res.status(200).json(result);
    }

    if (req.method === 'PUT') {
      const { action } = req.body;
      try {
        // Read current row to decide whether metric columns exist. If they don't, updates will be ignored.
        const { data: current } = await supabase.from('roast_licenses').select('*').eq('issue_id', id).single();

        if (action === 'download') {
          try {
            await supabase.from('roast_licenses').update({ downloads: (current?.downloads || 0) + 1 }).eq('issue_id', id);
          } catch (e) {}
        } else if (action === 'share') {
          try {
            await supabase.from('roast_licenses').update({ shares: (current?.shares || 0) + 1 }).eq('issue_id', id);
          } catch (e) {}
        } else if (action === 'verify') {
          try {
            await supabase.from('roast_licenses').update({ is_verified: true }).eq('issue_id', id);
          } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
