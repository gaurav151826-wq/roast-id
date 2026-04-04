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
    const { data, error } = await db
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

    return Response.json({
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
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const config = {
  path: '/api/stats',
};
