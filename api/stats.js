import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { data, error } = await supabase
      .from('cards')
      .select('status, luck_level, brain_rot_level, downloads, shares, views');
    if (error) throw error;

    const total = data.length;
    const statusCounts = {};
    let totalLuck = 0;
    let totalRot = 0;
    let totalDownloads = 0;
    let totalShares = 0;
    data.forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      totalLuck += r.luck_level || 0;
      totalRot += r.brain_rot_level || 0;
      totalDownloads += r.downloads || 0;
      totalShares += r.shares || 0;
    });
    const avgLuck = total > 0 ? Math.round(totalLuck / total) : 0;
    const avgRot = total > 0 ? Math.round(totalRot / total) : 0;
    const topStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0];

    return res.status(200).json({
      total,
      avgLuck,
      avgRot,
      totalDownloads,
      totalShares,
      topStatus: topStatus ? topStatus[0] : null,
      statusCounts,
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
