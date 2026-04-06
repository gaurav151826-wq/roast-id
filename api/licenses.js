import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      // List recent roast_licenses and attach brain_rot_level where available
      const { data, error } = await supabase
        .from('roast_licenses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;

      const issueIds = data.map(d => d.issue_id).filter(Boolean);
      let extras = [];
      if (issueIds.length > 0) {
        const extrasRes = await supabase.from('roast_card_extras').select('*').in('issue_id', issueIds);
        extras = extrasRes.data || [];
      }
      const extrasMap = {};
      extras.forEach(e => { extrasMap[e.issue_id] = e; });

      const merged = data.map(d => ({
        ...d,
        brain_rot_level: extrasMap[d.issue_id]?.brain_rot_level ?? 50,
        is_verified: d.is_verified || false,
        downloads: d.downloads || 0,
        shares: d.shares || 0,
        views: d.views || 0,
      }));

      return res.status(200).json(merged);
    }

    if (req.method === 'POST') {
      const { name, status, achievements, luck_level, brain_rot_level, issue_id } = req.body;

      const { data, error } = await supabase
        .from('roast_licenses')
        .insert({
          name,
          status,
          achievements,
          luck_level,
          issue_id,
        })
        .select()
        .single();
      if (error) throw error;

      // Create extras row for brain rot (best-effort)
      try {
        await supabase.from('roast_card_extras').insert({ issue_id, brain_rot_level: brain_rot_level ?? 50 });
      } catch (e) {}

      const result = {
        ...data,
        brain_rot_level: brain_rot_level ?? 50,
        is_verified: data.is_verified || false,
        downloads: data.downloads || 0,
        shares: data.shares || 0,
        views: data.views || 0,
      };

      return res.status(201).json(result);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
