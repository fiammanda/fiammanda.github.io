import { marked } from "marked";
import { prism, prismHighlight } from "./lang.js";

prismHighlight(["markup", "json", "yaml", "css", "clike", "javascript", "typescript", "bash", "batch", "powershell"]);

/*
  // https://wakamaifondue.com/
  // let arr = [...document.querySelector(".content").children].map(g => parseInt(g.dataset.cp, 16)).sort((a, b) => a - b);
  let arr = [...document.querySelectorAll(`[alt="Unicode value"]`)].slice(2).map(g => parseInt(g.textContent, 16));
  let reg = "const regen = /^[\\s";
  let s = arr[0];
  let e = arr[0];

  for (let i = 1; i <= arr.length; i++) {
    if (arr[i] !== e + 1) {
      reg += s === e
        ? `\\u${s.toString(16).padStart(4, "0")}`
        : `\\u${s.toString(16).padStart(4, "0")}-\\u${e.toString(16).padStart(4, "0")}`;
      s = arr[i];
    }
    e = arr[i];
  }
  reg += "]+$/;";
  console.log(reg);
*/

const emoji = Object.fromEntries(
  ["1f47b", "1f47e", "1f47f", "1f4a9", "1f600", "1f601", "1f602", "1f603", "1f604", "1f605", "1f606", "1f607", "1f608", "1f609", "1f60a", "1f60b", "1f60c", "1f60d", "1f60e", "1f60f", "1f610", "1f611", "1f612", "1f613", "1f614", "1f615", "1f616", "1f617", "1f618", "1f619", "1f61a", "1f61b", "1f61c", "1f61d", "1f61e", "1f61f", "1f620", "1f621", "1f622", "1f623", "1f624", "1f625", "1f626", "1f627", "1f628", "1f629", "1f62a", "1f62b", "1f62c", "1f62d", "1f62e-200d-1f4a8", "1f62e", "1f62f", "1f630", "1f631", "1f632", "1f633", "1f634", "1f635-200d-1f4ab", "1f635", "1f636-200d-1f32b-fe0f", "1f636", "1f637", "1f641", "1f642", "1f643", "1f644-200d-2063", "1f644", "1f910", "1f911", "1f912", "1f913", "1f914", "1f915", "1f917", "1f920", "1f921", "1f922", "1f923", "1f924", "1f925", "1f927", "1f928", "1f929", "1f92a", "1f92b", "1f92c", "1f92d", "1f92e", "1f92f", "1f970", "1f971", "1f972", "1f973", "1f974", "1f975", "1f976", "1f978", "1f979", "1f97a", "1f9d0", "1fa99", "1fae0", "1fae1", "1fae2", "1fae3", "1fae4", "1fae5", "1fae8", "2639", "263a"].map(code => [
    String.fromCodePoint(...code.split("-").map(hex => parseInt(hex, 16))),
    `https://cdn.fiammanda.com/emoji/${code}.svg`
  ])
);
const regem = new RegExp(`(${Object.keys(emoji).join("|")})`, `g`);
const regen = /^[\s\u0021-\u007e\u00a0-\u00ac\u00ae-\u0148\u014a-\u01c3\u01c5-\u0254\u0256-\u027b\u027e-\u0284\u0286-\u0290\u0292-\u02a4\u02a6-\u0304\u0306-\u030a\u030c\u030f\u0313\u0315\u031b\u0323\u0326-\u0328\u032c\u0337-\u0338\u0342-\u0343\u0346-\u036f\u0374-\u0376\u037a-\u037f\u0384-\u038a\u038c\u038e-\u03a1\u03a3-\u03d7\u03dc-\u03dd\u03f0-\u03f6\u03f9-\u03fa\u03fc-\u0479\u0480-\u049d\u04a0-\u04ff\u052f\u0e3f\u1d00\u1d0d\u1d1b\u1d43\u1d47-\u1d49\u1d4d\u1d4f-\u1d50\u1d52\u1d56-\u1d58\u1d5b\u1d62-\u1d65\u1d9c\u1da0\u1dbb\u1dbf-\u1df5\u1dfc-\u1e9b\u1e9d-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fc4\u1fc6-\u1fd3\u1fd6-\u1fdb\u1fdd-\u1fef\u1ff2-\u1ff4\u1ff6-\u1ffe\u2000-\u200b\u2010-\u2027\u202f-\u2055\u2057\u205f\u2070-\u2071\u2074-\u208e\u2090-\u209c\u20a0-\u20af\u20b1-\u20b5\u20b8-\u20ba\u20bc-\u20c0\u20db-\u20de\u20e8\u20f0\u2100-\u2101\u2103\u2105-\u2106\u2109\u2113\u2116-\u2117\u211e-\u2122\u2126\u212a-\u212b\u212e\u2132\u213b\u214d\u2150-\u217f\u2183-\u2186\u2189\u2190-\u2199\u21a9-\u21aa\u21b0-\u21b1\u21b3-\u21b5\u21ba-\u21bb\u21d0\u21d2\u21d4\u21de-\u21df\u21e4-\u21e5\u21e7\u21ea\u2202\u2205-\u2206\u220f\u2211-\u2212\u221a\u221e\u222b\u2236\u2248\u2260\u2264-\u2265\u2295-\u2298\u2303-\u2305\u2318\u2325-\u2327\u232b\u2380\u2387\u238b\u23ce-\u23cf\u2423\u2460-\u2468\u24b6-\u24cf\u24ea\u25a0-\u25a2\u25aa\u25b2-\u25b3\u25b6-\u25b7\u25ba-\u25bd\u25c0-\u25c1\u25c4-\u25c7\u25ca-\u25cb\u25cf\u25e6\u25ef\u2600\u2605-\u2606\u263c\u2661\u2665\u266a-\u266b\u26a0\u2713\u2717\u2756\u2764\u2780-\u2788\u27ef\u27f5-\u27fa\u2913\u2a38\u2b06\u2b12-\u2b13\u2b1c\u2b24\u2c7c\u2c7f\u2dff\u2e18\ua69f\ua7ff\ua92e\ue000\ue002-\ue05e\ue06a-\ue0bd\ue0c8-\ue0cc\ue0dc-\ue0e6\ue0f3-\ue0f5\ue106\ue109-\ue10a\ue10c-\ue10f\ue111-\ue113\ue117-\ue118\ue121-\ue122\ue124\ue12a-\ue15e\ue163\ue1c3\ue1d2-\ue1df\ue1e1-\ue2dc\uee01-\uee07\uee09-\uee0a\uee0c-\uee12\uee14\uee17\uee1d-\uee45\uee47-\uee84\uee87-\ueed6\ueed8-\ueee1\uf6c3\ufeff\u1f12f-\u1f149\u1f16a-\u1f16b\u1f850\u1f852]+$/;

const idify = (tokens) => {
  return tokens.filter((token) => ["text", "codespan"].includes(token.type)).map((token) => token.text).join("").trim().replace(/\s+/g, "-").toLowerCase();
};

const renderer = {
  code({ text, lang }) {
    lang ||= "code";
    const plan = prism.languages[lang];
    const html = plan ? prism.highlight(text, plan, lang) : text;
    return `<pre data-lang="${lang}">
      <code>${html.replace(/\n/g, "&#10;")}</code>
      <button>${lang}</button>
    </pre>`;
  },
  heading({ depth, text, tokens }) {
    const lang = regen.test(text) ? ` lang="en"` : ``;
    return `<h${depth} id="${idify(tokens)}"${lang}>${this.parser.parseInline(tokens)}</h${depth}>
`;
  },
  image({ href, title, text }) {
    if (href.startsWith("/assets")) {
      href = "https://cdn.fiammanda.com" + href.slice(7);
    }
    return `<img src="${href}"${text ? ` alt="${text}"` : ``} loading="lazy" onload="this.removeAttribute('onload')" />`;
  },
  link({ href, title, text, tokens }) {
    let target = "";
    if (href.startsWith("/assets")) {
      href = "https://cdn.fiammanda.com" + href.slice(7);
      target = ` target="_blank"`;
    } else if (href.startsWith("/memos")) {
      href = href.replace(/(\/memos\/).+\/(.+)/, "$1$2/");
    } else if (href.startsWith("/notes")) {
      href = href.replace(/(\/notes\/)[-\d]+(.+)/, "$1$2/");
    } else if (href.startsWith("http")) {
      target = ` target="_blank" rel="noopener noreferrer nofollow"`;
    }
    let html = href.startsWith("http");
    return `<a href="${href}"${target}>${this.parser.parseInline(tokens)}</a>`;
  },
  listitem({checked, loose, task, text, tokens}) {
    let lang = regen.test(text) ? ` lang="en"` : ``;
    let html = "";
    if (task) {
      const checkbox = this.checkbox({ checked: !!checked });
      if (loose) {
        if (tokens[0]?.type === "paragraph") {
          tokens[0].text = checkbox + " " + tokens[0].text;
          if (tokens[0].tokens && tokens[0].tokens.length > 0 && tokens[0].tokens[0].type === "text") {
            tokens[0].tokens[0].text = checkbox + " " + escape(tokens[0].tokens[0].text);
            tokens[0].tokens[0].escaped = true;
          }
        } else {
          tokens.unshift({
            type: "text",
            raw: checkbox + " ",
            text: checkbox + " ",
            escaped: true
          });
        }
      } else {
        html += checkbox + " ";
      }
    }
    html += this.parser.parse(tokens, !!loose);
    return `<li${lang}>${html}</li>
`;
  },
  paragraph({ text, tokens }) {
    const lang = regen.test(text) ? ` lang="en"` : ``;
    const html = this.parser.parseInline(tokens).split("&lt;!type")[0];
    const type = this.parser.parseInline(tokens).slice(html.length + 5, -4);
    return `<p${type ? ` class="${type}"` : lang}>${lang ? html : html.replace(/(\w)’(\w)/g, `$1<span lang="en">’</span>$2`)}</p>
`;
  }
};

const hooks = {
  preprocess(markdown) {
    const codes = [];
    markdown = markdown.replace(/(`[^`]+?`|```[\s\S]+?```|<style>[\s\S]+?<\/style>)/g, (match) => {
      const key = `@@CODE${codes.length}@@`;
      codes.push(match);
      return key;
    });
    markdown = markdown
      .replace(/(\w)'(\w)/g, `$1’$2`)
      .replace(/(^|[\s\(\[{])'([^"]+?)"([\s\)\]}.,!?]|$)/g, `$1‘$2’$3`)
      .replace(/(^|[\s\(\[{])"([^"]+?)"([\s\)\]}.,!?]|$)/g, `$1“$2”$3`)
      .replace(/([：、，。！？；“”‘’（）「」『』《》【】]{2,})/g, (_, content) => {
        return `<span class="type-punctuation">${content.replace(/(.)/g, `<span>$1</span>`)}</span>`;
      })
      .replace(/<span>([“‘（「『《【]<\/span>)/g, `<span class="type-punctuation-start">$1`);
    codes.forEach((block, i) => {
      markdown = markdown.replace(new RegExp(`@@CODE${i}@@`, "g"), () => block);
    });
    return markdown.replace(/^---[\s\S]*?---\s*/, ``);
  },
  postprocess(html) {
    return html
      .replace(regem, e => `<img class="emoji" draggable="false" alt="${e}" src="${emoji[e]}">`)
      .replace(/<del>(.+)<\/del>/g, (_, content) => {
        return `<del>${content.replace(/<a/g, `<a tabindex="-1"`)}</del>`;
      })
      .replace(`<p lang="en">END</p>`, `<p class="type-end">END</p>`);
  }
};

marked.toc = (markdown, level = 3) => {
  const tokens = marked.lexer(markdown.replace(/^---[\s\S]*?---\s*/, ""));
  const headings = tokens.filter(t => t.type === "heading" && t.depth > 1 && t.depth < level);
  if (headings.length === 0) return ``;
  return `<strong>On This Page</strong>
    <ul>${headings.map((heading) => {
      const id = idify(heading.tokens);
      const md = heading.tokens.filter((token) => ["text", "codespan"].includes(token.type)).map((token) => token.raw).join("").trim();
      return `<li><a class="heading-${heading.depth}" href="#${id}">${marked.parseInline(md)}</a></li>`;
    }).join("\n")}</ul>
    <svg xmlns="http://www.w3.org/2000/svg"><path /></svg>`;
};

marked.use({
  breaks: true,
  gfm: true,
  renderer,
  hooks
});

export { marked };