import pg from "pg";

const client = new pg.Client({
  host: "db.nahfbixbpplwbnrzuudt.supabase.co",
  port: 5432,
  user: "postgres",
  password: process.env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

await client.connect();
await client.query(`
  alter table visits
    add column if not exists color_depth int,
    add column if not exists online boolean,
    add column if not exists webdriver boolean,
    add column if not exists orientation text,
    add column if not exists ua_brands text,
    add column if not exists ua_mobile boolean,
    add column if not exists ua_platform text,
    add column if not exists ua_model text,
    add column if not exists ua_full_version text,
    add column if not exists client_hints jsonb
`);
const r = await client.query(
  "select column_name from information_schema.columns where table_name = 'visits' order by ordinal_position"
);
console.log("visits columns (" + r.rows.length + "):", r.rows.map((x) => x.column_name).join(", "));
await client.end();
