import pg from "pg";

const c = new pg.Client({
  host: "db.nahfbixbpplwbnrzuudt.supabase.co",
  port: 5432,
  user: "postgres",
  password: process.env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
await c.connect();
const r = await c.query(
  "select column_name from information_schema.columns where table_name = 'visits' order by ordinal_position"
);
console.log("total:", r.rows.length);
console.log(r.rows.map((x) => x.column_name).slice(-8).join(", "));
await c.end();
