const http = require('http');

// FIX: guard against missing payload before accessing .values
function computeStats(job) {
  if (!job.payload || !job.payload.values) {
    throw new Error('Invalid job payload: missing values (job id=' + job.id + ')');
  }
  const values = job.payload.values;
  const sum = values.reduce((a, b) => a + b, 0);
  return { sum, avg: sum / values.length };
}

function processJob(job) {
  try {
    const stats = computeStats(job);
    console.log('[worker] job ' + job.id + ' ok', JSON.stringify(stats));
  } catch (err) {
    console.error('[worker] job ' + job.id + ' FAILED:', err.stack);
  }
}

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', service: 'nimbus-ops-demo' }));
}).listen(process.env.PORT || 3000, () => console.log('[server] listening on 3000'));

// Background worker — every 20s. Every 3rd job is malformed → triggers the bug.
let n = 0;
setInterval(() => {
  n++;
  const job = n % 3 === 0 ? { id: n } : { id: n, payload: { values: [1, 2, 3, n] } };
  processJob(job);
}, 20000);
console.log('[boot] nimbus-ops-demo started');
