import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const config = {
  adapter: 'shim',
  installed: '2026-10-29T14:06:00+01:00',
  beatEverySeconds: 60,
  runsDir: 'runs',
};

const jobs = [
  'digest/render',
  'fixtures/refresh',
  'lane/sync',
  'notes/backup',
  'rig/rotate-logs',
];

describe('digest page', () => {
  it('renders 2026-10-28 locally, sorted, with marks', async () => {
    const res = await createApp(config).request('/digest/2026-10-28');
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('digest · 2026-10-28');
    expect(html).toContain('>—<');
    let from = 0;
    for (const job of jobs) {
      const at = html.indexOf(job, from);
      expect(at).toBeGreaterThanOrEqual(0);
      from = at + job.length;
    }
    expect(html).toMatch(/<tr class="warn">\s*<td>fixtures\/refresh/);
    expect(html).toMatch(/<tr class="warn">\s*<td>notes\/backup/);
    expect(html).not.toMatch(/<tr class="warn">\s*<td>lane\/sync/);
    expect(html).toContain('2026-10-29T01:30:00+01:00');
  });
});
