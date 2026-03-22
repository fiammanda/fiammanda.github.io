import { Hono } from "hono";
import { cache  } from "hono/cache";
import { appendTrailingSlash } from "hono/trailing-slash";
import { app as api } from "./api";
import { handle } from "./utils/html";
import { fetchFile } from "./utils/file";

const app = new Hono();
app.use("*", appendTrailingSlash());

app.route("/api", api);

app.get("/*.xml", cache({
  cacheName: "cache",
  cacheControl: "public, max-age=21600, stale-while-revalidate=21600",
}));
app.get("/*", cache({
  cacheName: "cache",
  cacheControl: "public, max-age=3600, stale-while-revalidate=3600",
}));

app.get("/admin/", async (c) => {
  return c.html(await handle["admin"](c));
});

app.on("GET", [
  "/",
  "/feed.xml",
  "/sitemap.xml",
  "/:type{memos|notes|works}/",
  "/:type{memos|notes|works}/:slug/"
], async (c) => {
  const path = c.req.path;
  const host = new URL(c.req.url).origin;
  if (path === "/") return c.html(handle["index"]());
  const data = await fetchFile(c, "data.json");
  if (path.endsWith(".xml")) return c.text(handle[path.slice(1, -4)](data, host), 200, {
    "content-type": "application/xml"
  });
  const page = data[path];
  if (!page) return c.notFound();
  const [_, type, slug, more] = path.split("/");
  page.raw = page.file ? await fetchFile(c, page.file) : null;
  page.type = type;
  page.host = host;
  return c.html(await handle[type](data, page, slug, c));
});

app.notFound((c) => {
  let referer = c.req.header("referer") || "";
  return c.html(handle["error"](404, referer.includes("fiammanda")), 404);
});

app.onError((e, c) => {
  console.error(e);
  return c.html(handle["error"](503), 503);
})

export default app;