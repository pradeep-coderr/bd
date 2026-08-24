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
    add column if not exists latitude_precise double precision,
    add column if not exists longitude_precise double precision,
    add column if not exists accuracy double precision
`);
console.log("precise location columns ready");
await client.end();
