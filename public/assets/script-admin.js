const el = Object.fromEntries(
  ["user", "zone", "link"].map(id => [id, ["", document.getElementById(id)]])
);
el.user[0] = el.user[1].previousElementSibling;
el.zone[0] = el.zone[1].previousElementSibling;
el.link = Array.from(el.link[1].children);
const urls = {
  user: [
    "https://dash.cloudflare.com/USER/workers-and-pages",
    "https://dash.cloudflare.com/USER/workers/d1",
    "https://dash.cloudflare.com/USER/workers/kv/namespaces",
    "https://dash.cloudflare.com/USER/r2/overview",
  ],
  zone: [
    "https://dash.cloudflare.com/USER/ZONE/dns/records",
    "https://dash.cloudflare.com/USER/ZONE/caching/configuration",
    "https://dash.cloudflare.com/USER/ZONE/rules/overview",
  ]
};
const data = {};

renderBG();

json.result.forEach((domain) => {
  if (data[domain.account.id]) {
    data[domain.account.id].push([domain.name, domain.id]);
  } else {
    data[domain.account.id] = [
      [domain.name, domain.id]
    ];
    const li = document.createElement("li");
    li.role = "option";
    li.dataset.value = domain.account.id;
    li.append(
      Object.assign(document.createElement("span"), { textContent: domain.account.name.toLowerCase().split("'")[0] }),
      Object.assign(document.createElement("code"), { textContent: domain.account.id })
    );
    el.user[1].append(li);
  }
});

el.user[1].addEventListener("click", (e) => {
  const target = e.target.closest("li");
  if (!target || target.dataset.value == el.user[1].dataset.value) return;

  el.user[0].innerHTML = target.innerHTML;
  el.user[1].dataset.value = target.dataset.value;
  el.user[1].querySelector("[aria-selected]")?.removeAttribute("aria-selected");
  target.ariaSelected = "true";
  setTimeout(() => { el.user[1].style.pointerEvents = "none"; }, 1);
  setTimeout(() => { el.user[1].removeAttribute("style"); }, 201);

  el.zone[0].tabIndex = "0";
  el.zone[0].textContent = "";
  el.zone[1].dataset.value = "";
  el.zone[1].replaceChildren();
  data[target.dataset.value].forEach((zone) => {
    const li = document.createElement("li");
    li.role = "option";
    li.dataset.value = zone[0];
    li.append(
      Object.assign(document.createElement("span"), { textContent: zone[0] }),
      Object.assign(document.createElement("code"), { textContent: zone[1] })
    );
    el.zone[1].append(li);
  });

  el.link[0].replaceChildren();
  el.link[1].replaceChildren();
  urls.user.forEach((url) => {
    const a = document.createElement("a");
    a.rel = "noopener noreferrer nofollow";
    a.target = "_blank";
    a.textContent = url.split("USER")[1];
    a.href = url
      .replace("USER", el.user[1].dataset.value);
    el.link[0].append(a);
  });
});

el.zone[1].addEventListener("click", (e) => {
  const target = e.target.closest("li");
  if (!target || target.dataset.value == el.zone[1].dataset.value) return;

  el.zone[0].innerHTML = target.innerHTML;
  el.zone[1].dataset.value = target.dataset.value;
  el.zone[1].querySelector(["aria-selected"])?.removeAttribute("aria-selected");
  target.ariaSelected = "true";
  setTimeout(() => { el.zone[1].style.pointerEvents = "none"; }, 1);
  setTimeout(() => { el.zone[1].removeAttribute("style"); }, 201);

  el.link[1].replaceChildren();
  urls.zone.forEach((url) => {
    const a = document.createElement("a");
    a.rel = "noopener noreferrer nofollow";
    a.target = "_blank";
    a.textContent = url.split("ZONE")[1];
    a.href = url
      .replace("USER", el.user[1].dataset.value)
      .replace("ZONE", el.zone[1].dataset.value);
    el.link[1].append(a);
  });
});


function renderBG(element = document.querySelector(".bg div")) {
  let points = Array.from({length: 15}, () => [Math.random(), Math.random()]);
  function draw() {
    points = points.map(([x,y]) =>
      Math.random() > 0.5
        ? [x + (Math.random()-0.5) / 2, y + (Math.random()-0.5) / 2]
        : [Math.random(), Math.random()]
    );
    element.style.clipPath = `polygon(${points.map(([x,y]) => `${(x*100).toFixed(1)}% ${(y*100).toFixed(1)}%`).join(",")})`;
  }
  function jump() {
    draw();
    setTimeout(jump, 7500 + 2500 * Math.random());
  }
  jump();
  setTimeout(draw, 10);
}
