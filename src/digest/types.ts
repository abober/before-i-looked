export type JobStatus = 'ok' | 'retry' | 'fail';

export type DigestRow = {
  job: string;
  owner: string | null;
  runs: number;
  retries: number;
  lastStatus: JobStatus;
  lastError: string | null;
  firstAt: string;
  lastAt: string;
};

export type LineCounts = { ok: number; retry: number; fail: number };

export type NightRead = {
  rows: DigestRow[];
  badLines: number;
  lineCounts: LineCounts;
};

export type ReadNight = (runsDir: string, night: string) => NightRead;
