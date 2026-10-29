import type { NightRead } from '../digest/types.js';

function mark(row: { retries: number; lastStatus: string }): string {
  return row.retries >= 3 || row.lastStatus === 'fail' ? 'warn' : '';
}

export function DigestPage({ night, data }: { night: string; data: NightRead }) {
  return (
    <>
      <h1>digest · {night}</h1>
      {data.rows.length === 0 && data.badLines === 0 ? (
        <p>nothing ran</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>job</th>
              <th>owner</th>
              <th>runs</th>
              <th>retries</th>
              <th>last status</th>
              <th>last error</th>
              <th>first</th>
              <th>last</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr class={mark(row)}>
                <td>{row.job}</td>
                <td>{row.owner ?? '—'}</td>
                <td>{row.runs}</td>
                <td>{row.retries}</td>
                <td>{row.lastStatus}</td>
                <td>{row.lastError ?? '—'}</td>
                <td>{row.firstAt}</td>
                <td>{row.lastAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
