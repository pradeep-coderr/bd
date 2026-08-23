import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

const REF = "nahfbixbpplwbnrzuudt";
const sql = readFileSync(join(process.cwd(), "supabase", "schema.sql"), "utf8");

const REGIONS = [
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "ap-south-1", "ap-south-2", "ap-southeast-1", "ap-southeast-2",
  "ap-northeast-1", "ap-northeast-2", "eu-central-1", "eu-central-2",
  "eu-west-1", "eu-west-2", "eu-north-1", "sa-east-1", "ca-central-1",
];

const candidates = [];
const uri = process.env.SUPABASE_DB_URI;
const pwd = process.env.SUPABASE_DB_PASSWORD;

if (uri) {
  candidates.push({ connectionString: uri });
} else if (pwd) {
  candidates.push({
    host: `db.${REF}.supabase.co`, port: 5432,
    user: "postgres", password: pwd, database: "postgres",
  });
  for (const r of REGIONS) {
    candidates.push({
      host: `aws-0-${r}.pooler.supabase.com`, port: 6543,
      user: `postgres.${REF}`, password: pwd, database: "postgres",
    });
  }
} else {
  console.error("Set SUPABASE_DB_URI or SUPABASE_DB_PASSWORD env var.");
  process.exit(1);
}

async function tryConnect(cfg) {
  const client = new pg.Client({
    ...cfg,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    query_timeout: 10000,
  });
  try {
    await client.connect();
    await client.query("select 1");
    return client;
  } catch {
    try { await client.end(); } catch {}
    return null;
  }
}

async function main() {
  for (const cfg of candidates) {
    const label = cfg.connectionString
      ? cfg.connectionString.split("@")[1]
      : `${cfg.host}:${cfg.port} (${cfg.user})`;
    const client = await tryConnect(cfg);
    if (!client) {
      console.log(`no  ${label}`);
      continue;
    }
    console.log(`yes ${label}`);
    await client.query(sql);
    const tables = await client.query(
      "select tablename from pg_tables where schemaname = 'public' order by tablename"
    );
    console.log("public tables now:", tables.rows.map((r) => r.tablename).join(", "));
    await client.end();
    console.log("done");
    return;
  }
  console.error("no host worked");
  process.exit(1);
}

main().catch((e) => {
  console.error("failed:", e.message);
  process.exit(1);
});
