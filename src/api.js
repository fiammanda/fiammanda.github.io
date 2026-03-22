import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { marked } from "./utils/mark";

const app = new Hono();

app.use("*", (c, next) => {
  const { referer } = c.req.header();
  if (referer && c.env.HOST.split(" ").some((key) => referer.includes(key))) {
    return next();
  } else {
    const [username, password] = c.env.SIGN.split(":");
    return basicAuth({ username, password })(c, next);
  }
  return c.json({message: "Forbidden"}, 403);
});

app.get("/counter/:type{first|visit|view|like|comment}/:url{.*}", async (c) => {
  const type = c.req.param("type");
  const url = "/" + (c.req.param("url") || "");
  const sql = {
    first: "visits = visits + 1, views = views + 1, updated = CURRENT_TIMESTAMP",
    visit: "visits = visits + 1, views = views + 1, updated = CURRENT_TIMESTAMP",
    view: "views = views + 1, updated = CURRENT_TIMESTAMP",
    like: "likes = likes + 1",
    comment: "comments = comments + 1"
  };
  const sqt = {
    visit: "views = views + 1, updated = CURRENT_TIMESTAMP",
  };
  const ops = [
    c.env.D1.prepare(`UPDATE counter SET ${sqt[type] || sql[type]} WHERE url = ?`).bind("-").run(),
    c.env.D1.prepare(`INSERT INTO counter (url, title) VALUES (?, ?) ON CONFLICT(url) DO UPDATE SET ${sql[type]} RETURNING views, likes, comments`).bind(url, decodeURIComponent(c.req.header("page-title"))).first()
  ];
  const [_, res] = await Promise.all(ops);
  return c.json(res);
});

app.get("/comment/:url{.+}", async (c) => {
  const url = "/" + (c.req.param("url") || "");
  if (/^\/(notes\/[-\w]+|works\/\d+)\/$/.test(url)) {
    const key = new Request(c.req.url);
    const val = await caches.default.match(key);
    if (val) return val;
    const sql = await c.env.D1.prepare(`SELECT id, rid, pid, name, link, text FROM comment WHERE url = ? ORDER BY id ASC`).bind(url).run();
    const res = c.json(sql.results, 200, {
      "cache-control": "public, max-age=21600, stale-while-revalidate=21600"
    });
    c.executionCtx.waitUntil(caches.default.put(key, res.clone()));
    return res;
  } else {
    return c.json({ message: "Not Found" }, 404);
  }
});

app.post("/comment", async (c) => {
  const now = new Date();
  const id = Math.floor(now.getTime() / 1e3);
  const ip = c.req.header("cf-connecting-ip") || null;
  const ua = c.req.header("user-agent") || null;
  const time = now.toISOString().replace("T", " ").slice(0, -5);
  const { rid, pid, link, url, title, name, mail, text: md } = await c.req.json();
  const text = marked.parse(md).replace(/\n+\s*/g, "");
  await c.env.D1
    .prepare(`INSERT INTO comment (id, rid, pid, url, title, name, mail, link, text, time, ip, ua) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, rid, pid, url, title, name, mail, link, text, time, ip, ua).run();
  await caches.default.delete(new Request(c.req.url + url));
  return c.json({ id, text });
});

export { app };