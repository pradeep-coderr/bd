import pg from "pg";

const VID = process.env.TEST_VISIT_ID;

const c = new pg.Client({
  host: "db.nahfbixbpplwbnrzuudt.supabase.co",
  port: 5432,
  user: "postgres",
  password: process.env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
await c.connect();
await c.query("delete from answers where visit_id = $1", [VID]);
await c.query("delete from feelings where visit_id = $1", [VID]);
await c.query("delete from visits where id = $1", [VID]);
console.log("removed test visit", VID);
await c.end();
