const date = new Date();
const dark = window.matchMedia("(prefers-color-scheme: dark)").matches || (window.matchMedia("(hover: hover)").matches && (date.getHours() < 8 || date.getHours() > 18));
const html = document.documentElement;
const type = performance.getEntriesByType("navigation")[0].type;
const pathname = location.pathname;
const handler = [
  { selector: `.post-comment form li`, operator: insertEmoji },
  { selector: `.backdrop`, operator: handleMenu },
  { selector: `button[aria-label="toggle-nav"]`, operator: handleNav },
  { selector: `button[aria-label="toggle-toc"]`, operator: handleToc },
  { selector: `button[aria-label="toggle-mode"]`, operator: handleMode },
  { selector: `button[aria-label="toggle-emoji"]`, operator: handleEmoji },
  { selector: `button[aria-label="cancel-reply"]`, operator: cancelReply },
  { selector: `button[aria-label="handle-reply"]`, operator: handleReply },
  { selector: `button[aria-label="post-like"]`, operator: handleLike },
  { selector: `pre[data-lang] button`, operator: handleCode },
  { selector: `li[role="radio"]`, operator: handleFilter },
  { selector: `ol[aria-label="footnote"] li`, operator: cancelNote },
  { selector: `a[href^="#fn-"]`, operator: handleNote },
  { selector: `a[href^="#"]`, operator: handleHash },
  { selector: `a[href^="/"]:not([target])`, operator: handleLink },
  { selector: `footer p span`, operator: handleFooter }
];
const comment = [];
const counter = [];
comment[0] = JSON.parse(sessionStorage.getItem("comment") || "{}");
comment[1] = JSON.parse(localStorage.getItem("comment") || "{\"data\":{}}");
counter[0] = JSON.parse(sessionStorage.getItem("counter") || "{}");
counter[1] = JSON.parse(localStorage.getItem("counter") || "{}");
comment[1] = Object.fromEntries(Object.entries(comment[1]).sort(([x], [y]) => x.localeCompare(y)));
counter[1] = Object.fromEntries(Object.entries(counter[1]).sort(([x], [y]) => x.localeCompare(y)));

if (dark && !localStorage.getItem("mode") || localStorage.getItem("mode") === "dark") {
  html.dataset.mode = "dark";
}

if (type === "back_forward" || !type) {
  html.removeAttribute("class");
} else if (type === "navigate" && sessionStorage.getItem("load")) {
  html.classList = sessionStorage.getItem("load");
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fetch("/api/comment" + pathname).then((res) => res.json()).then((res) => {
        comment[0][pathname] = res;
        sessionStorage.setItem("comment", JSON.stringify(comment[0]));
        res.forEach(data => loadComment(data));
        comment[1][pathname]?.rid && document.querySelector(`[data-id="${comment[1][pathname]["rid"]}"] [aria-label="handle-reply"]`).click();
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .5 });

document.addEventListener("DOMContentLoaded", () => {
  const current = document.querySelector(`[href="${pathname}"]`);
  if (current) {
    current.ariaCurrent = "page";
    current.tabIndex = -1;
  }

  document.getElementById("page").addEventListener("click", (e) => {
    const target = e.target;
    if (!target) return;
    for (const { selector, operator } of handler) {
      const el = target.closest(selector);
      if (el) {
        operator(el, e);
        break;
      }
    }
  });

  if (document.querySelector(".page-nav") && sessionStorage.getItem("scroll")) {
    document.querySelector(".page-nav").scrollTop = sessionStorage.getItem("scroll");
    sessionStorage.removeItem("scroll");
  }

  if (document.querySelector(`.post-stat`)) {
    counter[1][pathname] && document.querySelector(`[aria-label="post-like"]`).classList.add("active");
  }

  if (document.querySelector(`.post-comment`)) {
    if (comment[0][pathname]) {
      comment[0][pathname].forEach(data => loadComment(data));
      comment[1][pathname]?.rid && document.querySelector(`[data-id="${comment[1][pathname]["rid"]}"] [aria-label="handle-reply"]`).click();
    } else {
      observer.observe(document.querySelector(".post-comment"));
    }

    if (comment[1]["data"]) {
      document.querySelector(`[name="name"]`).value = comment[1]["data"]["name"] || "";
      document.querySelector(`[name="mail"]`).value = comment[1]["data"]["mail"] || "";
      document.querySelector(`[name="link"]`).value = comment[1]["data"]["link"] || "";
    }
    if (comment[1][pathname]) {
      document.querySelector(`[name="text"]`).value = comment[1][pathname]["text"];
    }

    document.querySelector(`.post-comment [name="link"]`).addEventListener("focus", (e) => {
      if (!e.target.value) {
        e.target.value = "https://";
      }
    });
    document.querySelector(`.post-comment [name="link"]`).addEventListener("blur", (e) => {
      if (/^https?:\/\/$/.test(e.target.value)) {
        e.target.value = "";
      }
    });

    document.querySelector(`.post-comment textarea`).addEventListener("input", throttle((e) => {
      const el = e.target;
      const h0 = el.style.height;
      el.style.height = "auto";
      const h1 = el.scrollHeight + "px";
      el.style.height = h0;
      requestAnimationFrame(() => el.style.height = h1);
    }, 100));

    document.querySelector(`.post-comment form`).addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const json = new FormData(form);
      const data = Object.fromEntries(json.entries());
      form.ariaDisabled = "true";
      for (const key in data) {
        if (data[key].trim() === "") data[key] = null;
      }
      fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: pathname,
          title: document.title.slice(0, -12),
          ...data
        })
      }).then((res) => res.json()).then((res) => {
        data.id = res.id;
        data.text = res.text;
        data.rid && document.querySelector(`button[aria-label="cancel-reply"]`).click();
        loadComment(data);
        form.removeAttribute("aria-disabled");
        document.querySelector(`[name="text"]`).value = "";
        delete comment[1][pathname];
        localStorage.setItem("comment", JSON.stringify(counter[1]));
        comment[0][pathname].push(data);
        sessionStorage.setItem("comment", JSON.stringify(comment[0]));
        counter[0][pathname]["comments"]++;
        sessionStorage.setItem("counter", JSON.stringify(counter[0]));
        navigator.sendBeacon("/api/counter/comment" + pathname);
      });
    })

    window.addEventListener("beforeunload", () => {
      comment[1]["data"]["name"] = document.querySelector(`[name="name"]`).value;
      document.querySelector(`[name="mail"]`).validity.valid && (comment[1]["data"]["mail"] = document.querySelector(`[name="mail"]`).value);
      document.querySelector(`[name="link"]`).validity.valid && (comment[1]["data"]["link"] = document.querySelector(`[name="link"]`).value);
      const text = document.querySelector(`[name="text"]`).value.trim();
      if (text) {
        comment[1][pathname] = { text };
        comment[1][pathname]["rid"] = document.querySelector(`[name="rid"]`).value;
      } else {
        delete comment[1][pathname];
      }
      localStorage.setItem("comment", JSON.stringify(comment[1]));
    });
  }

  if (document.querySelector("aside[data-text]:empty")) {
    let el = document.querySelector("aside");
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 13.5">
      <defs>
        <filter id="filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="2" seed="${Date.now()}"/>
          <feColorMatrix type="matrix" values="
            1 0   0   0 0
            0 0 0.8   0 0
            0 0 1.2   0 0
            0 0   0 1.5 0"/>
        </filter>
        <pattern id="pattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
          <rect width="100%" height="100%" filter="url(#filter)" />
        </pattern>
      </defs>
      <text x="92.5%" y="98.5%" fill="url(#pattern)" text-anchor="end">${el.dataset.text}</text>
    </svg>`;
  } else {
    loadCounter(pathname);
  }

  drawTOC();

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleMode);

  window.addEventListener("pageshow", (e) => {
    setTimeout(() => { html.removeAttribute("class"); }, 1);
  });
});

function handleNav() {
  document.body.dataset.menu = "nav";
}
function handleToc() {
  document.body.dataset.menu = "toc";
}
function handleMenu() {
  delete document.body.dataset.menu;
}

function handleMode() {
  const mode = html.dataset.mode;
  if (localStorage.getItem("mode")) {
    if (dark !== (localStorage.mode === "dark")) {
      localStorage.removeItem("mode");
    } else {
      localStorage.mode = dark ? "light" : "dark";
    }
  } else {
    localStorage.mode = mode === "dark" ? "light" : "dark";
  }
  html.dataset.mode = mode === "dark" ? "light" : "dark";
}

function insertEmoji(target) {
  const input = document.querySelector(".post-comment textarea");
  const value = input.value;
  const i0 = input.selectionStart;
  const i1 = input.selectionEnd;
  const s = [value[i0 - 1] ? " " : "", value[i1] ? " " : ""];
  input.value = value.slice(0, i0) + s[0] + target.textContent + s[1] + value.slice(i1);
  input.selectionStart = input.selectionEnd = i0 + target.textContent.length + s[0].length + s[1].length;
  input.focus(); 
}
function handleEmoji(target) {
  if (target.className) {
    target.removeAttribute("class");
    document.querySelector("form ul").ariaHidden = "true";
  } else {
    target.className = "active";
    document.querySelector("form ul").removeAttribute("aria-hidden");
  }
}

function cancelReply(target) {
  document.querySelector(`[aria-label="handle-reply"][tabindex]`).removeAttribute("tabindex");
  document.querySelector(`[name="rid"]`).removeAttribute("value");
  document.querySelector(`[name="pid"]`).removeAttribute("value");
  target.disabled = true;
  const c = document.querySelector(".post-comment");
  c.insertBefore(document.querySelector("form"), c.querySelector("ul"));
}
function handleReply(target) {
  const r = target.closest("li");
  const p = r.closest("li") || r;
  const f = document.querySelector("form");
  document.querySelector(`[name="rid"]`).value = r.dataset.id;
  document.querySelector(`[name="pid"]`).value = p.dataset.id;
  document.querySelector(`[aria-label="cancel-reply"]`).removeAttribute("disabled");
  document.querySelector(`[aria-label="cancel-reply"] span`).textContent = r.querySelector(`[role] + span`).textContent;
  document.querySelector(`[aria-label="handle-reply"][tabindex]`)?.removeAttribute("tabindex");
  target.tabIndex = -1;
  r.querySelector("ul") ? r.insertBefore(f, r.querySelector("ul")) : r.append(f);
  f.querySelector("textarea").focus();
}

function handleLike(target) {
  fetch("/api/counter/like" + pathname).then((res) => res.json()).then((res) => {
    const number = target.firstElementChild.dataset;
    number.next = +number.stat + 1;
    target.classList.add("active");
    counter[0][pathname]["likes"]++;
    counter[1][pathname] = 1;
    sessionStorage.setItem("counter", JSON.stringify(counter[0]));
    localStorage.setItem("counter", JSON.stringify(counter[1]));
  });
}

function handleCode(target) {
  const pre = target.closest(`pre[data-lang]`);
  navigator.clipboard.writeText(pre.firstElementChild.textContent).then(() => {
    pre.classList.add("active");
    setTimeout(() => {
      pre.removeAttribute("class");
    }, 1000);
  });
}

function handleFilter(target) {
  delete document.body.dataset.menu;
  const list = document.querySelector(`.post-list`).children;
  if (target.className) {
    target.removeAttribute("class");
    for (const item of list) {
      if (item.ariaHidden && item.dataset.height) {
        item.style.maxHeight = item.dataset.height + "px";
        item.removeAttribute("aria-hidden");
        setTimeout(() => {
          item.removeAttribute("style");
        }, 201);
      }
    }
  } else {
    const tag = "post-tag-" + target.dataset.tag;
    target.parentNode.querySelector(".active")?.removeAttribute("class");
    target.classList.add("active");
    for (const item of list) {
      if (item.classList.contains(tag) && item.dataset.height && item.ariaHidden) {
        item.style.maxHeight = item.dataset.height + "px";
        item.removeAttribute("aria-hidden");
        setTimeout(() => {
          item.removeAttribute("style");
        }, 200);
      } else if (!item.classList.contains(tag) && !item.ariaHidden) {
        item.dataset.height = item.offsetHeight;
        item.style.maxHeight = item.offsetHeight + "px";
        item.offsetHeight;
        item.setAttribute("aria-hidden", "true");
        item.removeAttribute("style");
      }
    }
  }
}

function cancelNote(target) {
  target.removeAttribute("class");
  document.querySelector(`sup a.active`)?.removeAttribute("class");
}

function handleNote(target, e) {
  e.preventDefault();
  if (!document.querySelector(`[aria-label="footnote"]`)) {
    const ol = document.createElement(`ol`);
    ol.ariaLabel = "footnote";
    ol.innerHTML = document.querySelector(`[role="note"]`).innerHTML.replace(/id="fn-/g, `data-note="`).replace(/<a href="#fnref-\d+">(\d+)<\/a>/g, `$1`);
    document.querySelector(`.post-body`).append(ol);
    target.offsetHeight;
  }
  if (target.className) {
    document.querySelector(`[aria-label="footnote"] .active`)?.removeAttribute("class");
    target.removeAttribute("class");
  } else {
    document.querySelector(`[aria-label="footnote"] .active`)?.removeAttribute("class");
    document.querySelector(`sup a.active`)?.removeAttribute("class");
    document.querySelector(`[data-note="${target.getAttribute("href").slice(4)}"]`).classList.add("active");
    target.classList.add("active");
  }
}

function handleHash(target, e) {
  e.preventDefault();
  delete document.body.dataset.menu;
  const id = target.getAttribute("href").slice(1);
  const el = document.getElementById(id);
  if (el) {
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - 40
    });
    if (el.nodeName === "SUP") {
      const a = el.firstElementChild;
      setTimeout(() => { a.classList.add("active"); }, 200);
      setTimeout(() => { a.removeAttribute("class"); }, 1200);
    }
  }
}

function handleLink(target, e) {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
  e.preventDefault();
  fetch(target.href, { cache: "force-cache" }).catch(() => {});
  delete document.body.dataset.menu;
  document.querySelector("[aria-current]")?.removeAttribute("tabindex");
  let diff = target.closest(".page-nav ul a") ? "load-part" : "load-main";
  if (location.pathname.split("/")[1] !== target.getAttribute("href").split("/")[1]) {
    diff += " load-jump";
  }
  if (document.querySelector(".page-nav")?.scrollTop) {
    sessionStorage.setItem("scroll", document.querySelector(".page-nav").scrollTop);
  }
  sessionStorage.setItem("load", diff);
  html.className = "exit " + diff;
  setTimeout(() => { location.href = target.href; }, 100);
}

function handleFooter() {
  window.open("/admin/", "_blank");
}

function loadCounter(pathname = location.pathname, title = document.title.slice(0, -12)) {
  if (Object.keys(counter[1]).length === 0) {
    fetch("/api/counter/first" + pathname, {
      headers: { "Page-Title": encodeURIComponent(title) }
    }).then((res) => res.json()).then((res) => {
      if (!res.views) return;
      document.querySelector(`[aria-label="post-view"] span`)?.setAttribute("data-stat", res.views);
      document.querySelector(`[aria-label="post-like"] span`)?.setAttribute("data-stat", res.likes);
      document.querySelector(`[aria-label="post-comment"] span`)?.setAttribute("data-stat", res.comments);
      counter[0][pathname] = res;
      counter[1][pathname] = 0;
      sessionStorage.setItem("counter", JSON.stringify(counter[0]));
      localStorage.setItem("counter", JSON.stringify(counter[1]));
    });
  } else if (!counter[1].hasOwnProperty(pathname)) {
    fetch("/api/counter/visit" + pathname, {
      headers: { "Page-Title": encodeURIComponent(title) }
    }).then((res) => res.json()).then((res) => {
      if (!res.views) return;
      document.querySelector(`[aria-label="post-view"] span`)?.setAttribute("data-stat", res.views);
      document.querySelector(`[aria-label="post-like"] span`)?.setAttribute("data-stat", res.likes);
      document.querySelector(`[aria-label="post-comment"] span`)?.setAttribute("data-stat", res.comments);
      counter[0][pathname] = res;
      counter[1][pathname] = 0;
      sessionStorage.setItem("counter", JSON.stringify(counter[0]));
      localStorage.setItem("counter", JSON.stringify(counter[1]));
    });
  } else if (!counter[0][pathname]) {
    fetch("/api/counter/view" + pathname).then((res) => res.json()).then((res) => {
      if (!res.views) return;
      document.querySelector(`[aria-label="post-view"] span`)?.setAttribute("data-stat", res.views);
      document.querySelector(`[aria-label="post-like"] span`)?.setAttribute("data-stat", res.likes);
      document.querySelector(`[aria-label="post-comment"] span`)?.setAttribute("data-stat", res.comments);
      counter[0][pathname] = res;
      sessionStorage.setItem("counter", JSON.stringify(counter[0]));
    });
  } else if (counter[0][pathname] && document.querySelector(".post-stat")) {
    const res = counter[0][pathname];
    document.querySelector(`[aria-label="post-view"] span`)?.setAttribute("data-stat", res.views);
    document.querySelector(`[aria-label="post-like"] span`)?.setAttribute("data-stat", res.likes);
    document.querySelector(`[aria-label="post-comment"] span`)?.setAttribute("data-stat", res.comments);
  }
}

function loadComment({ id, rid, pid, name, mail, link, text }, ul = document.querySelector(`.post-comment > ul`)) {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.innerHTML = `
    <div class="comment-info">
      <span role="img">${link === "/" ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><g><path d="M249 18h3l1 1 3 1c3-1 9 3 12 7l3 4 10 14 2 4c2 6 1 15-1 23l-3 7 8-1h2a49 49 0 0 0 26-1l10-2 3-1 13 10c15 16 18 22 18 30 0 7-4 12-11 13l-2 1c-1 1-10-1-16-3a464 464 0 0 0-25-9l-6-2h-4l-2-2-1 1h-2l-1-1-9-1c-7 0-10 1-9 3l-1 1-10 8-9 9c-2-1-13 8-13 10l-1 1-8 6-8 5 1-1v-1l-2 2c-1 2-1 2-1 0l1-3 1-1h-2c-5 5-7 6-9 6l-2 1-1 1-3 2-5 2-4 2c-1 2-1 1-1-1l2-5 1-3 4-11 6-14 2-4 1 2-1 5 2-3 2-4 1-2 2-6 1-5v-1l2 1-1-2v-2h-1c-2 0-2 0-1-1s0-1-1 0c-2 1-4 2-3 0h-7l-2 2c0 1 0 2 2 1l5-1h5c0 2-6 3-15 4-1 0-2 0-1 1l-3 1-6 1-5 1-4 2h-1l-1-2-1 1c1 1 0 1-2 1l-2 1h-2c-1-2-2-1-2 0s0 2-1 1h-7c-1 2 1 8 3 8v1c0 3 4 13 5 13l1 2 2 3s1 0 0 0l1 4v7l-2 3c2 4-10 9-19 9a41 41 0 0 1-9-1l-3-2c-1-3-7-8-9-8s-6-6-6-8l-2-5-2-3-1-3-2-3-11 5-15 5-8 1H71l-5-1c-4-1-11-4-14-7l-6-9-2-3-2-2-1-4c-1-3 0-3 2-4l5-3 2-2 1-1-2-1h-1l4-1 5-1 17-4 2-1 3-1 2-1c-1-2 0-2 1-1l2 1 5-1 4-1h8l9-2c5-1 8-3 9-4V71l-1 2-1 3V58l1-1c0-3 2-10 4-11 5-3 9-2 9 2l1 1c2 0 7 9 7 12l2 8 1 5 1 2 1 3v3l1 1 1 2v3l1 2c4 1 6 0 13-1l7-1h3c2-2 10-3 26-4a432 432 0 0 0 33-5l1-2 1-6 1-8-1-6-1-11c-1-14-2-18-3-19-2-3-1-3 7-4l9-4c3-1 4-2 6-1zm-28 71c-4 1-2 2 2 2l4-1-6-1zm-20 21h-3c-2 1-2 3 0 3l2-1 1-1c1 1 1 1 0 0v-1z"/><path d="M267 147c3 2 13 2 12 0h1l7 2c4 1 5 0 8-1 5-2 12-3 11 0l2 3 2 1h1l1 2 2 4c3 3 6 5 10 5 2-1 6 2 6 5l3 5 2 5c0 2 1 2 2 3l1 7-2 15c-1 12-5 30-8 30v3l-2 4c-2 2-2 2 0 2 2 1 1 4-1 4v-1c2-2 2-2 0-2l-2 3c-1 3-1 3 1 2 2 0 1 0 0 1-2 1-3 4-3 7v4l-1 4 1 2 2-10 1-2v9l-2 4c-3 2-4 10-1 10l2 1h-2l-1 1c0 1 0 2 2 1 3 0 3 0 0 2l-1 1c2-1 2 3 0 4l-2 6c-1 4 0 5 1 6 2 1 2 1 0 1h-2l-1 4c-1 1-1 2 1 1s2 0-1 3c-1 1-2 2-1 3v2l-3 13-2 3-1 6c0 5-3 13-5 14l-1 3-1 3-1 1v2l-1 2-2 4-4 7c-1 6-7 11-14 10l-3 1-13-1c-2 0-10-7-10-9l-2-2-2-5-3-5c-3-2-3-3-3-9v-8l-5-2c-5-3-8-7-7-8l8 2c5 1 8 2 11 1 3 0 4 0 3 1-1 2 7 0 9-2l2-3v-2l1-2v-1l3-4c3-6 2-9-1-9-6 0-22-11-34-23-13-13-15-16-16-19l-1-7c-1-4 0-6 2-9 2-2 3-2 6-1 6 2 13 6 20 11l8 5 7 2a88 88 0 0 0 10 4l6 1h1l2 1 2-1v-21c-1 0-2 5-1 7l-2 1-1-13 2-31v-20c-1-6-2-12-5-16-2-2-2-2-6-2-3 1-5 1-8-1l-5-1-12-5-3-4-1-4-2-3c-2-1-2-1-1-2l2-2 5-5h1c0-2 5-7 7-7l1-1 4-2c4-1 6-1 10 1zm16 90c0-1 0-1 0 0l-1 5v13a334 334 0 0 0 1-19zm13 22v1l2-1c1-2 0-2-2 0zm1 2-1 1v7l2-4-1-4zm-11 7c-1-2-1-2-1 7v7l1-2 1-6-1-6zm9 6 1 4 1-3c0-6-2-6-2-1zm0 6-1 1v4l1-1 1-2-1-2zm23 2 1 3c2 0 2 0 1-2-2-3-2-3-2-1zm-42 37-1 2 1 1 1-2-1-1zm-1 6c-1-1-1 0-2 1l-2 4v2l2-2 2-5zM163 181c5 3 10 5 11 4l3 3 3 2c1-1 7 7 8 10 2 9 1 10-5 12l-6 4-5 2h-4l-3 16-1 3-2 4-4 9-3 5v2l-1 1-1 2-1 2-1 5v3c3 1 9 5 10 7l2 1c2 0 5 4 6 8s1 5-1 6c-5 5-14 6-22 3l-7-1c-2 0-5-2-8-5l-8-6-3-2-9-2c-7 0-9 1-9 2v3l-1 2c0 1-2 4-5 6-4 4-5 5-9 4h-7c-3 0-15-8-15-10l-1-1c-1 0-7-10-7-12l-2-4-1-5v-5l1-5 1-2c-1-1 0-2 1-3l4-16c5-24 5-22 9-30 2-4 3-7 2-8h2c2 0 4 6 4 8-1 3 4 2 11-1 8-4 9-5 13-9 2-2 2-2 0-2-1-1 1-2 6-3 7-2 16-5 20-8l12-3 7-1c1-2 5 0 16 5zm-55 26c-10 0-12 0-18 2l-9 4c-2 1-2 1-2 5 2 14 6 18 11 12 3-3 8-3 15 0 2 1 4 2 5 1s1 0 2 1l10 1 11 2c3 2 4 1 3-3-2-14-7-23-13-24l-15-1zm-6 38c-14 0-15 0-11 8l5 12c0 2 6 2 9 0 3-3 6-4 11-5l5-1h11c1 0 2 0 2-2 1-1 0-2-2-2l-11-1-3-1-1-1-4-4c-3-3-4-3-11-3zm39 13v1l2 2c2 0 2 0 0-2l-2-1zm0 3c-3-2-3 2-1 6l2 2v-3c1-2 0-4-1-5zm5 5h-2c-1 2 0 3 2 2v-2z"/><path d="m204 176 4 2 3 2 10 8c3 2 4 10 3 15-2 5-1 6 1 5l1 1h4l20-2 13 2 6 3 5 6c3 6 3 7 2 11-2 4-2 5-7 10-2 3-3 3-6 2l-6-1-6-2-4-2c-2 0-6-2-7-4s-4-5-9-7c-9-5-12-5-12-1l-1 3-1 2c1 0-3 12-5 13v-2c2-2 2-2 0 0l-3 6-3 7c-1 1 0 1 1 1v1h-4v2c2 3 2 4 1 6v3l-1 1c-2 0-2-4-1-5 2-2 1-3 0-2l-2 3c0 4-3 12-5 13v-8l2-7 1-5 1-13 1-9a136 136 0 0 0 1-45v-7c0-6 0-6 3-6zM281 267v1l-1 3c1 1 0 1-1 2-2 0-2 0-1-1l1-2v-1l1-1 1-1z"/><path d="m202 270-2 2c-1 2-2 2 0-1l2-1zM322 273l2 1-1 2-1-2v-1zM183 314c0 1-3 9-5 9l1-2 1-4 1-2 2-1zM178 325l-2 3-2 4-4 7-6 10 1-1 2-1c1 1-3 5-5 4l-1 1-2 2-1 3h-2c-4-3-4-3-2-6l2-4 3-3c3-1 10-7 14-13l5-6z"/><path d="m170 343 1 1-1 1-1-1 1-1z"/></g></svg>` : drawAvatar(name)}</span>
      <span>${link ? `<a target="_blank" rel="noopener noreferrer nofollow" href="${link}">${name}</a>` : `${name}`}</span>
      <span>${rid ? `${comment[0][pathname].find((r) => r.id == rid).name}`: ``}</span>
      <time>${new Date(id * 1e3).toLocaleString("sv-SE")}</time>
      <button aria-label="handle-reply"></button>
    </div>
    <div class="comment-body">${text}</div>
  `;
  if (pid) {
    up = ul.querySelector(`[data-id="${pid}"] ul`);
    if (!up) {
      up = document.createElement(`ul`);
      ul.querySelector(`[data-id="${pid}"]`).append(up);
    }
    up.append(li);
  } else {
    ul.append(li);
  }
}

function drawTOC(selector = ".post-nav") {
  let nav, svg;
  let list = [];
  let pathLength = 0;
  let pathStartLast = 0;
  let pathEndLast = 0;
  const listing = () =>
    [...nav.querySelectorAll("li")]
      .map((item) => {
        const anchor = item.querySelector("a");
        const target = document.getElementById(anchor?.getAttribute("href")?.slice(1));
        return target ? { self: item, anchor, target } : null;
      })
      .filter(Boolean);

  function draw() {
    list = listing();
    const path = [];
    let pathIndent;
    list.forEach((item, i) => {
      const x = item.anchor.offsetLeft - 8;
      const y = item.self.offsetTop;
      const h = item.self.offsetHeight;
      if (i === 0) {
        path.push("M", x, y, "L", x, y + h);
        item.pathStart = 0;
      } else {
        if (pathIndent !== x) path.push("L", pathIndent, y);
        path.push("L", x, y);
        svg.setAttribute("d", path.join(" "));
        item.pathStart = svg.getTotalLength() || 0;
        path.push("L", x, y + h);
      }
      pathIndent = x;
      svg.setAttribute("d", path.join(" "));
      item.pathEnd = svg.getTotalLength();
    });
    pathLength = svg.getTotalLength();
    sync();
  }

  function sync() {
    let pathStart = pathLength;
    let pathEnd = 0;
    let active = 0;

    list.forEach((item, i) => {
      const next = list[i + 1];
      const nextTop = next ? next.target.getBoundingClientRect().top : Infinity;
      const thisTop = item.target.getBoundingClientRect().top;
      const isActive = thisTop < window.innerHeight - 32 && nextTop > 41;
      if (isActive) {
        pathStart = Math.min(item.pathStart, pathStart);
        pathEnd = Math.max(item.pathEnd, pathEnd);
        active++;
        item.self.classList.add("active");
      } else {
        item.self.removeAttribute("class");
      }
    });

    if (active > 0 && pathStart < pathEnd) {
      if (pathStart !== pathStartLast || pathEnd !== pathEndLast) {
        svg.setAttribute("stroke-dashoffset", "1");
        svg.setAttribute("stroke-dasharray", `1, ${pathStart}, ${pathEnd - pathStart}, ${pathLength}`);
        svg.setAttribute("opacity", "1");
      }
    } else {
      svg.setAttribute("opacity", "0");
    }

    pathStartLast = pathStart;
    pathEndLast = pathEnd;
  }

  const start = () => {
    nav = document.querySelector(selector);
    svg = nav?.querySelector("path");
    if (!nav || !svg) return;
    draw();
    window.addEventListener("resize", draw, false);
    window.addEventListener("scroll", throttle(sync, 100), false);
  };

  const pause = () => {
    window.removeEventListener("resize", draw, false);
    window.removeEventListener("scroll", throttle(sync, 100), false);
  };

  start();
  return { start, pause };
}

function drawAvatar(name) {
  let hash = name.length;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash | 0;
  }
  let sign = (n) => {
    return Math.floor(hash / Math.pow(10, n)) % 2 ? 1 : -1;
  }
  const colors = [
    "hsl(calc(var(--ch) - 20) 40 80)",
    "hsl(calc(var(--ch) - 10) 40 80)",
    "hsl(var(--ch) 40 80)",
    "hsl(calc(var(--ch) + 10) 40 80)",
    "hsl(calc(var(--ch) + 20) 40 80)"
  ];
  const shapes = [
    "M20 2a18 18 0 1 1 0 36 18 18 0 1 1 0-36",
    "M16.304 2.68a9.66 9.66 0 0 1 7.392 0l5.938 2.46a9.66 9.66 0 0 1 5.226 5.226l2.46 5.938a9.66 9.66 0 0 1 0 7.392l-2.46 5.938a9.66 9.66 0 0 1-5.226 5.226l-5.938 2.46a9.66 9.66 0 0 1-7.392 0l-5.938-2.46a9.66 9.66 0 0 1-5.226-5.226l-2.46-5.938a9.66 9.66 0 0 1 0-7.392l2.46-5.938a9.66 9.66 0 0 1 5.226-5.226z",
    "M16.396 3.495a8.3 8.3 0 0 1 7.208 0l7.545 3.633a8.3 8.3 0 0 1 4.494 5.636l1.863 8.164a8.3 8.3 0 0 1-1.603 7.027l-5.222 6.548a8.3 8.3 0 0 1-6.494 3.127h-8.374a8.3 8.3 0 0 1-6.494-3.127l-5.222-6.548a8.3 8.3 0 0 1-1.603-7.027l1.863-8.164a8.3 8.3 0 0 1 4.494-5.636z",
    "M16.536 2.519a6.93 6.93 0 0 1 6.928 0l9.943 5.74a6.93 6.93 0 0 1 3.464 6v11.482a6.93 6.93 0 0 1-3.464 6l-9.943 5.74a6.93 6.93 0 0 1-6.928 0l-9.943-5.74a6.93 6.93 0 0 1-3.464-6V14.259a6.93 6.93 0 0 1 3.464-6z",
    "M16.764 3.898a5.51 5.51 0 0 1 6.472 0l12.11 8.799a5.51 5.51 0 0 1 2 6.155L32.72 33.088a5.51 5.51 0 0 1-5.236 3.804H12.516a5.51 5.51 0 0 1-5.236-3.804L2.654 18.852a5.51 5.51 0 0 1 2-6.155z",
    "M14.343 1.943a8 8 0 0 1 11.314 0l12.4 12.4a8 8 0 0 1 0 11.314l-12.4 12.4a8 8 0 0 1-11.314 0l-12.4-12.4a8 8 0 0 1 0-11.314z",
    "M15.5 7.239a5.196 5.196 0 0 1 9 0L36.862 28.65a5.196 5.196 0 0 1-4.5 7.794H7.638a5.196 5.196 0 0 1-4.5-7.794z",
    "M11.2 10.4c.3-.1.5-.3.7-.5L17 3.4c.4-.5.8-.9 1.4-1.1.5-.2 1.1-.4 1.6-.4s1.1.1 1.6.4c.5.2 1 .6 1.4 1.1l5 6.6c.2.2.4.4.7.5l7.7 2.6c.8.3 1.5.7 1.9 1.4.5.7.7 1.4.7 2.3 0 .4-.1.8-.2 1.1-.1.4-.3.7-.5 1.1l-4.9 7q-.3.45-.3.9l.2 7.3c0 1.1-.3 2-1.1 2.8s-1.6 1.1-2.7 1.1c-.1 0-.4 0-1-.1l-8.1-2.3c-.3-.1-.5-.1-.8 0L11.5 38h-1c-1 0-1.9-.4-2.7-1.1-.8-.8-1.1-1.7-1.1-2.8l.2-7.4q0-.45-.3-.9l-4.9-7c-.3-.3-.4-.7-.5-1.1-.2-.3-.2-.6-.2-1 0-.8.2-1.5.7-2.2s1.1-1.2 1.9-1.4z",
    "m36.7 25.9-3.2-5.5c-.1-.2-.1-.5 0-.8l3.2-5.5c1.5-2.5-.4-5.7-3.3-5.7H27c-.3 0-.5-.1-.7-.4l-3.1-5.3c-1.5-2.5-5.1-2.5-6.6 0l-3 5.3c-.1.2-.4.4-.7.4H6.6c-2.9 0-4.7 3.2-3.3 5.7l3.2 5.5c.1.2.1.5 0 .8l-3.2 5.5c-1.5 2.5.4 5.7 3.3 5.7H13c.3 0 .5.1.7.4l3.1 5.3c1.5 2.5 5.1 2.5 6.6 0l3.1-5.3c.1-.2.4-.4.7-.4h6.4c2.7 0 4.5-3.2 3.1-5.7",
    "M14.4 34.8c-.3-.3-.6-.4-1-.4H9.2c-1 0-1.8-.4-2.5-1.1s-1.1-1.6-1.1-2.5v-4.2c0-.4-.2-.8-.4-1l-3-3.1c-.3-.4-.6-.8-.8-1.2s-.3-.8-.3-1.3.1-.9.3-1.3.4-.8.8-1.2l3-3.1c.3-.3.4-.6.4-1V9.2c0-1 .4-1.8 1.1-2.5s1.6-1.1 2.5-1.1h4.2c.4 0 .8-.2 1-.4l3.1-3c.4-.3.8-.6 1.2-.8s.9-.3 1.3-.3.9.1 1.3.3.8.4 1.2.8l3.1 3c.3.3.6.4 1 .4h4.2c1 0 1.8.4 2.5 1.1s1.1 1.6 1.1 2.5v4.2c0 .4.2.8.4 1l3 3.1c.3.4.6.8.8 1.2s.3.9.3 1.3-.1.9-.3 1.3-.4.8-.8 1.2l-3 3.1c-.3.3-.4.6-.4 1v4.2c0 1-.4 1.8-1.1 2.5s-1.6 1.1-2.5 1.1h-4.2c-.4 0-.8.2-1 .4l-3.1 3c-.4.3-.8.6-1.2.8s-.9.3-1.3.3-.9-.1-1.3-.3-.8-.4-1.2-.8z",
  ];
  const i = Math.abs(hash % colors.length);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <g>
      <rect width="40" height="40" fill="${colors[i]}" />
      <path d="${shapes[Math.abs(hash % shapes.length)]}" fill="#000" transform="translate(${hash % 9 * sign(1)} ${hash % 8 * sign(2)}) scale(${Math.abs(hash % 3) / 10 + 1}) rotate(${hash % 180} 20 20)" />
    </g>
    <g fill="${colors[i]}" transform="translate(${hash % 9 * sign(1)} ${hash % 8 * sign(2)}) scale(1.2) rotate(${hash % 10 * sign(5)} 20 20)">
      <rect x="${16.0 - Math.abs(hash % 6) / 2}" y="${18.5 - Math.abs(hash % 5) / 3}" width="1.5" height="${1.75 + hash % 5 % 2 * .25}" rx="1" />
      <rect x="${22.5 + Math.abs(hash % 6) / 2}" y="${18.5 - Math.abs(hash % 5) / 3}" width="1.5" height="${1.75 + hash % 5 % 2 * .25}" rx="1" />
      ${ hash % 2
        ? `<path d="M15 ${22 + Math.abs(hash % 10 % 3)} a1,${0.75 + Math.abs(hash % 25) / 100} 0 0,0 10,0" />`
        : `<path d="M17 ${22 + Math.abs(hash % 10 % 3)}c1 2 5 2 6 0" fill="none" stroke="${colors[i]}" stroke-linecap="round" />`
      }
    </g>
  </svg>`;
};

function throttle(fn, interval = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}
