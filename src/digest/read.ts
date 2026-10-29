import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DigestRow, JobStatus, NightRead } from './types.js';

const NIGHT = /^\d{4}-\d{2}-\d{2}$/;

type Parsed = {
  at: string;
  job: string;
  status: JobStatus;
  owner: string | null;
  error: string | null;
};

function isStatus(value: unknown): value is JobStatus {
  return value === 'ok' || value === 'retry' || value === 'fail';
}

function parseLine(raw: string): Parsed | undefined {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (typeof value !== 'object' || value === null) return undefined;
  const record = value as Record<string, unknown>;
  const { at, job, status, owner, error } = record;
  if (typeof at !== 'string' || Number.isNaN(Date.parse(at))) return undefined;
  if (typeof job !== 'string' || job === '') return undefined;
  if (!isStatus(status)) return undefined;
  if (owner !== null && typeof owner !== 'string') return undefined;
  if (error !== undefined && typeof error !== 'string') return undefined;
  return { at, job, status, owner, error: error ?? null };
}

function byTime(a: Parsed, b: Parsed): number {
  return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
}

export function readNight(runsDir: string, night: string): NightRead {
  if (!NIGHT.test(night)) {
    const error = new Error(`no night ${night}`) as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    throw error;
  }
  const text = readFileSync(join(runsDir, `${night}.jsonl`), 'utf8');
  const groups = new Map<string, Parsed[]>();
  let badLines = 0;

  for (const raw of text.split('\n')) {
    if (raw === '') continue;
    const line = parseLine(raw);
    if (!line) {
      badLines += 1;
      continue;
    }
    const list = groups.get(line.job);
    if (list) list.push(line);
    else groups.set(line.job, [line]);
  }

  const rows: DigestRow[] = [];
  for (const [job, lines] of groups) {
    const ordered = [...lines].sort(byTime);
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    if (!first || !last) continue;
    rows.push({
      job,
      owner: last.owner,
      runs: ordered.length,
      retries: ordered.filter((line) => line.status === 'retry').length,
      lastStatus: last.status,
      lastError: last.error,
      firstAt: first.at,
      lastAt: last.at,
    });
  }

  return { rows, badLines };
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

export function loadNight(runsDir: string, night: string): NightRead | undefined {
  try {
    const read = readNight(runsDir, night);
    const rows = [...read.rows].sort((a, b) => (a.job < b.job ? -1 : a.job > b.job ? 1 : 0));
    return { rows, badLines: read.badLines };
  } catch (error) {
    if (isMissing(error)) return undefined;
    throw error;
  }
}
