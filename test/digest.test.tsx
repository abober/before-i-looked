import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import type { RigConfig } from '../src/config.js';

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

  it('returns the same jobs in the same order as the page', async () => {
    const app = createApp(config);
    const html = await (await app.request('/digest/2026-10-28')).text();
    const jsonRes = await app.request('/api/digest/2026-10-28');
    const body = (await jsonRes.json()) as { rows: { job: string }[] };
    expect(jsonRes.status).toBe(200);
    expect(body.rows.map((row) => row.job)).toEqual(jobs);
    let from = 0;
    for (const job of body.rows.map((row) => row.job)) {
      const at = html.indexOf(job, from);
      expect(at).toBeGreaterThanOrEqual(0);
      from = at + job.length;
    }
  });
});

function tempConfig(): RigConfig {
  return {
    adapter: 'shim',
    installed: '2026-10-29T14:06:00+01:00',
    beatEverySeconds: 60,
    runsDir: mkdtempSync(join(tmpdir(), 'rig-runs-')),
  };
}

const goodLine = '{"at":"2026-10-02T01:00:00+01:00","job":"lane/sync","status":"ok","owner":"rook"}\n';

describe('digest route tests', () => {
  it('returns 200 for the page and the JSON', async () => {
    const cfg = tempConfig();
    writeFileSync(join(cfg.runsDir, '2026-10-02.jsonl'), goodLine);
    const app = createApp(cfg);
    expect((await app.request('/digest/2026-10-02')).status).toBe(200);
    expect((await app.request('/api/digest/2026-10-02')).status).toBe(200);
  });

  it('returns 404 when the night file is missing', async () => {
    const app = createApp(tempConfig());
    expect((await app.request('/digest/2026-10-03')).status).toBe(404);
    expect((await app.request('/api/digest/2026-10-03')).status).toBe(404);
  });

  it('renders nothing ran for an empty file', async () => {
    const cfg = tempConfig();
    writeFileSync(join(cfg.runsDir, '2026-10-04.jsonl'), '');
    const app = createApp(cfg);
    const page = await app.request('/digest/2026-10-04');
    expect(page.status).toBe(200);
    expect(await page.text()).toContain('nothing ran');
    const body = (await (await app.request('/api/digest/2026-10-04')).json()) as { rows: unknown[] };
    expect(body.rows).toEqual([]);
  });

  it('still renders a night that contains a bad line', async () => {
    const cfg = tempConfig();
    writeFileSync(join(cfg.runsDir, '2026-10-05.jsonl'), `${goodLine}{"job":"lane/sy\n`);
    const app = createApp(cfg);
    const page = await app.request('/digest/2026-10-05');
    expect(page.status).toBe(200);
    expect(await page.text()).toContain('lane/sync');
    const body = (await (await app.request('/api/digest/2026-10-05')).json()) as {
      rows: { job: string }[];
      badLines: number;
    };
    expect(body.badLines).toBe(1);
    expect(body.rows.map((row) => row.job)).toEqual(['lane/sync']);
  });
});
