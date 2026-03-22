async function fetchFile(c, key) {
  const req = new Request(`https://fiammanda/r2/${key}`);
  const res = await caches.default.match(req);
  if (!res) return await cacheFile(c, req, key);
  const file = key.endsWith(".json") ? await res.json() : await res.text();
  c.executionCtx.waitUntil((async () => {
    const tag = res.headers.get("ETag");
    const obj = await c.env.R2.get(key, {
      onlyIf: { etagDoesNotMatch: tag }
    });
    if (obj.body) await cacheFile(c, req, key, obj);
  })());
  return file;
}

async function cacheFile(c, req, key, obj) {
  obj ||= await c.env.R2.get(key);
  if (!obj) throw new Error("File not found.");
  const txt = await obj.text();
  const res = new Response(txt, {
    headers: {
      "content-type": key.endsWith(".json") ? "application/json" : "text/plain",
      "etag": obj.etag,
      "cache-control": "max-age=604800, stale-while-revalidate=86400"
    }
  });
  c.executionCtx.waitUntil(caches.default.put(req, res));
  return key.endsWith(".json") ? JSON.parse(txt) : txt;
}

export { fetchFile };