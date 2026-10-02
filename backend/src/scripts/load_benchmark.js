/**
 * The Law Kaksha - High-Concurrency Load Benchmark Runner
 * Measures local throughput, latency percentiles (p50, p90, p95, p99), and error rates
 */

const http = require("http");

const BASE_URL = process.env.API_URL || "http://localhost:5000";

async function runBenchmarkForEndpoint(path, totalRequests = 500, concurrency = 50) {
  const url = new URL(path, BASE_URL);
  const latencies = [];
  let successful = 0;
  let failed = 0;

  console.log(`[Load Benchmark] Testing ${path} (${totalRequests} requests, concurrency: ${concurrency})...`);
  const startTime = Date.now();

  let activeRequests = 0;
  let sentRequests = 0;

  return new Promise((resolve) => {
    function launchNext() {
      if (sentRequests >= totalRequests) {
        if (activeRequests === 0) {
          finish();
        }
        return;
      }

      sentRequests++;
      activeRequests++;
      const reqStart = process.hrtime.bigint();

      const req = http.get(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          agent: new http.Agent({ keepAlive: true }),
        },
        (res) => {
          res.on("data", () => {});
          res.on("end", () => {
            const reqEnd = process.hrtime.bigint();
            const latencyMs = Number(reqEnd - reqStart) / 1e6;
            latencies.push(latencyMs);

            if (res.statusCode >= 200 && res.statusCode < 400) {
              successful++;
            } else {
              failed++;
            }
            activeRequests--;
            launchNext();
          });
        }
      );

      req.on("error", () => {
        failed++;
        activeRequests--;
        launchNext();
      });

      req.end();
    }

    function finish() {
      const durationSeconds = (Date.now() - startTime) / 1000;
      latencies.sort((a, b) => a - b);

      const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
      const p90 = latencies[Math.floor(latencies.length * 0.9)] || 0;
      const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
      const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
      const rps = Math.round(totalRequests / (durationSeconds || 1));

      const result = {
        endpoint: path,
        totalRequests,
        concurrency,
        durationSeconds: durationSeconds.toFixed(2),
        throughputRps: rps,
        successful,
        failed,
        errorRatePercent: ((failed / totalRequests) * 100).toFixed(2),
        p50Ms: p50.toFixed(2),
        p90Ms: p90.toFixed(2),
        p95Ms: p95.toFixed(2),
        p99Ms: p99.toFixed(2),
      };

      console.log(`  -> Throughput: ${rps} req/s | p50: ${result.p50Ms}ms | p95: ${result.p95Ms}ms | Errors: ${result.errorRatePercent}%`);
      resolve(result);
    }

    for (let i = 0; i < concurrency; i++) {
      launchNext();
    }
  });
}

async function runAllBenchmarks() {
  console.log("=================================================================");
  console.log("THE LAW KAKSHA — API PERFORMANCE & LOAD BENCHMARK (PHASE 8)");
  console.log("=================================================================\n");

  const results = [];
  results.push(await runBenchmarkForEndpoint("/api/health", 1000, 50));
  results.push(await runBenchmarkForEndpoint("/api/catalog", 500, 30));
  results.push(await runBenchmarkForEndpoint("/api/public/site-data", 500, 30));
  results.push(await runBenchmarkForEndpoint("/api/public/section16-comparison", 500, 30));

  console.log("\n=================================================================");
  console.log("BENCHMARK SUMMARY TABLE");
  console.log("=================================================================");
  console.table(results);
  return results;
}

if (require.main === module) {
  runAllBenchmarks();
}

module.exports = { runAllBenchmarks };
