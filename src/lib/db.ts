type LicensePayload = {
  name: string;
  status: string;
  achievements: string;
  luck_level?: number;
  brain_rot_level?: number;
  issue_id: string;
};

export async function saveLicense(payload: LicensePayload): Promise<any> {
  const endpoints = ['/api/licenses', '/.netlify/functions/licenses'];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) return res.json();
      // try next endpoint on non-ok responses
    } catch (err) {
      // swallow and try next endpoint
    }
  }

  throw new Error('Failed to save license: no reachable endpoint');
}

export default { saveLicense };
