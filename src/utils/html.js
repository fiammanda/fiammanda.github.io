import { marked } from "./mark.js";

const config = {
  get year() {
    return new Date().getFullYear();
  },
  title: "The F Word",
  author: "Fiammanda",
  nickname: "吾不禁英俊地笑了起来",
  description: "这个没有味道的单词在你舌尖溶解并且提供半天份量的毫无营养。",
  html: {
    icon: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght,FILL@100..700,0..1&icon_names=arrow_back,arrow_outward,arrow_right,content_paste,directions_railway,error,favorite,format_quote,inventory,mode_comment,reply,shield_person,sports_esports,tag,terminal,visibility",
  },
  svg: {
    logo:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><g><path d="M249 18h3l1 1 3 1c3-1 9 3 12 7l3 4 10 14 2 4c2 6 1 15-1 23l-3 7 8-1h2a49 49 0 0 0 26-1l10-2 3-1 13 10c15 16 18 22 18 30 0 7-4 12-11 13l-2 1c-1 1-10-1-16-3a464 464 0 0 0-25-9l-6-2h-4l-2-2-1 1h-2l-1-1-9-1c-7 0-10 1-9 3l-1 1-10 8-9 9c-2-1-13 8-13 10l-1 1-8 6-8 5 1-1v-1l-2 2c-1 2-1 2-1 0l1-3 1-1h-2c-5 5-7 6-9 6l-2 1-1 1-3 2-5 2-4 2c-1 2-1 1-1-1l2-5 1-3 4-11 6-14 2-4 1 2-1 5 2-3 2-4 1-2 2-6 1-5v-1l2 1-1-2v-2h-1c-2 0-2 0-1-1s0-1-1 0c-2 1-4 2-3 0h-7l-2 2c0 1 0 2 2 1l5-1h5c0 2-6 3-15 4-1 0-2 0-1 1l-3 1-6 1-5 1-4 2h-1l-1-2-1 1c1 1 0 1-2 1l-2 1h-2c-1-2-2-1-2 0s0 2-1 1h-7c-1 2 1 8 3 8v1c0 3 4 13 5 13l1 2 2 3s1 0 0 0l1 4v7l-2 3c2 4-10 9-19 9a41 41 0 0 1-9-1l-3-2c-1-3-7-8-9-8s-6-6-6-8l-2-5-2-3-1-3-2-3-11 5-15 5-8 1H71l-5-1c-4-1-11-4-14-7l-6-9-2-3-2-2-1-4c-1-3 0-3 2-4l5-3 2-2 1-1-2-1h-1l4-1 5-1 17-4 2-1 3-1 2-1c-1-2 0-2 1-1l2 1 5-1 4-1h8l9-2c5-1 8-3 9-4V71l-1 2-1 3V58l1-1c0-3 2-10 4-11 5-3 9-2 9 2l1 1c2 0 7 9 7 12l2 8 1 5 1 2 1 3v3l1 1 1 2v3l1 2c4 1 6 0 13-1l7-1h3c2-2 10-3 26-4a432 432 0 0 0 33-5l1-2 1-6 1-8-1-6-1-11c-1-14-2-18-3-19-2-3-1-3 7-4l9-4c3-1 4-2 6-1zm-28 71c-4 1-2 2 2 2l4-1-6-1zm-20 21h-3c-2 1-2 3 0 3l2-1 1-1c1 1 1 1 0 0v-1z"/><path d="M267 147c3 2 13 2 12 0h1l7 2c4 1 5 0 8-1 5-2 12-3 11 0l2 3 2 1h1l1 2 2 4c3 3 6 5 10 5 2-1 6 2 6 5l3 5 2 5c0 2 1 2 2 3l1 7-2 15c-1 12-5 30-8 30v3l-2 4c-2 2-2 2 0 2 2 1 1 4-1 4v-1c2-2 2-2 0-2l-2 3c-1 3-1 3 1 2 2 0 1 0 0 1-2 1-3 4-3 7v4l-1 4 1 2 2-10 1-2v9l-2 4c-3 2-4 10-1 10l2 1h-2l-1 1c0 1 0 2 2 1 3 0 3 0 0 2l-1 1c2-1 2 3 0 4l-2 6c-1 4 0 5 1 6 2 1 2 1 0 1h-2l-1 4c-1 1-1 2 1 1s2 0-1 3c-1 1-2 2-1 3v2l-3 13-2 3-1 6c0 5-3 13-5 14l-1 3-1 3-1 1v2l-1 2-2 4-4 7c-1 6-7 11-14 10l-3 1-13-1c-2 0-10-7-10-9l-2-2-2-5-3-5c-3-2-3-3-3-9v-8l-5-2c-5-3-8-7-7-8l8 2c5 1 8 2 11 1 3 0 4 0 3 1-1 2 7 0 9-2l2-3v-2l1-2v-1l3-4c3-6 2-9-1-9-6 0-22-11-34-23-13-13-15-16-16-19l-1-7c-1-4 0-6 2-9 2-2 3-2 6-1 6 2 13 6 20 11l8 5 7 2a88 88 0 0 0 10 4l6 1h1l2 1 2-1v-21c-1 0-2 5-1 7l-2 1-1-13 2-31v-20c-1-6-2-12-5-16-2-2-2-2-6-2-3 1-5 1-8-1l-5-1-12-5-3-4-1-4-2-3c-2-1-2-1-1-2l2-2 5-5h1c0-2 5-7 7-7l1-1 4-2c4-1 6-1 10 1zm16 90c0-1 0-1 0 0l-1 5v13a334 334 0 0 0 1-19zm13 22v1l2-1c1-2 0-2-2 0zm1 2-1 1v7l2-4-1-4zm-11 7c-1-2-1-2-1 7v7l1-2 1-6-1-6zm9 6 1 4 1-3c0-6-2-6-2-1zm0 6-1 1v4l1-1 1-2-1-2zm23 2 1 3c2 0 2 0 1-2-2-3-2-3-2-1zm-42 37-1 2 1 1 1-2-1-1zm-1 6c-1-1-1 0-2 1l-2 4v2l2-2 2-5zM163 181c5 3 10 5 11 4l3 3 3 2c1-1 7 7 8 10 2 9 1 10-5 12l-6 4-5 2h-4l-3 16-1 3-2 4-4 9-3 5v2l-1 1-1 2-1 2-1 5v3c3 1 9 5 10 7l2 1c2 0 5 4 6 8s1 5-1 6c-5 5-14 6-22 3l-7-1c-2 0-5-2-8-5l-8-6-3-2-9-2c-7 0-9 1-9 2v3l-1 2c0 1-2 4-5 6-4 4-5 5-9 4h-7c-3 0-15-8-15-10l-1-1c-1 0-7-10-7-12l-2-4-1-5v-5l1-5 1-2c-1-1 0-2 1-3l4-16c5-24 5-22 9-30 2-4 3-7 2-8h2c2 0 4 6 4 8-1 3 4 2 11-1 8-4 9-5 13-9 2-2 2-2 0-2-1-1 1-2 6-3 7-2 16-5 20-8l12-3 7-1c1-2 5 0 16 5zm-55 26c-10 0-12 0-18 2l-9 4c-2 1-2 1-2 5 2 14 6 18 11 12 3-3 8-3 15 0 2 1 4 2 5 1s1 0 2 1l10 1 11 2c3 2 4 1 3-3-2-14-7-23-13-24l-15-1zm-6 38c-14 0-15 0-11 8l5 12c0 2 6 2 9 0 3-3 6-4 11-5l5-1h11c1 0 2 0 2-2 1-1 0-2-2-2l-11-1-3-1-1-1-4-4c-3-3-4-3-11-3zm39 13v1l2 2c2 0 2 0 0-2l-2-1zm0 3c-3-2-3 2-1 6l2 2v-3c1-2 0-4-1-5zm5 5h-2c-1 2 0 3 2 2v-2z"/><path d="m204 176 4 2 3 2 10 8c3 2 4 10 3 15-2 5-1 6 1 5l1 1h4l20-2 13 2 6 3 5 6c3 6 3 7 2 11-2 4-2 5-7 10-2 3-3 3-6 2l-6-1-6-2-4-2c-2 0-6-2-7-4s-4-5-9-7c-9-5-12-5-12-1l-1 3-1 2c1 0-3 12-5 13v-2c2-2 2-2 0 0l-3 6-3 7c-1 1 0 1 1 1v1h-4v2c2 3 2 4 1 6v3l-1 1c-2 0-2-4-1-5 2-2 1-3 0-2l-2 3c0 4-3 12-5 13v-8l2-7 1-5 1-13 1-9a136 136 0 0 0 1-45v-7c0-6 0-6 3-6zM281 267v1l-1 3c1 1 0 1-1 2-2 0-2 0-1-1l1-2v-1l1-1 1-1z"/><path d="m202 270-2 2c-1 2-2 2 0-1l2-1zM322 273l2 1-1 2-1-2v-1zM183 314c0 1-3 9-5 9l1-2 1-4 1-2 2-1zM178 325l-2 3-2 4-4 7-6 10 1-1 2-1c1 1-3 5-5 4l-1 1-2 2-1 3h-2c-4-3-4-3-2-6l2-4 3-3c3-1 10-7 14-13l5-6z"/><path d="m170 343 1 1-1 1-1-1 1-1z"/></g></svg>`,
    radio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="14" height="14"><g><circle cx="40" cy="40" r="32" /></g><g><circle cx="40" cy="40" r="16" /></g></svg>`,
    mode:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 530" width="20" height="20"><g><path d="M452.4 187.4V77.6H342.6L265 0l-77.6 77.6H77.6v109.8L0 265l77.6 77.6v109.8h109.8L265 530l77.6-77.6h109.8V342.6L530 265ZM265 428a163 163 0 1 1 163-163 163 163 0 0 1-163 163" /></g><g><circle cx="265" cy="265" r="114" /></g></svg>`,
    nav:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="16" height="16"><rect x="0" y="5" rx="2" width="80" height="10" /><rect x="0" y="35" rx="2" width="80" height="10" /><rect x="0" y="65" rx="2" width="56" height="10" /></svg>`,
    toc:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="16" height="16"><circle cx="68" cy="10" r="8" /><circle cx="40" cy="40" r="8" /><circle cx="68" cy="40" r="8" /><circle cx="12" cy="70" r="8" /><circle cx="40" cy="70" r="8" /><circle cx="68" cy="70" r="8" /></svg>`,
    emoji: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="18" height="18"><path d="M620-520q25 0 42.5-17.5T680-580t-17.5-42.5T620-640t-42.5 17.5T560-580t17.5 42.5T620-520m-280 0q25 0 42.5-17.5T400-580t-17.5-42.5T340-640t-42.5 17.5T280-580t17.5 42.5T340-520m140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260m0 180q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93"/></svg>`,
    reply: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="18" height="18"><path d="M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480t58.5-141.5T480-680t141.5 58.5T680-480v58q0 26 17 44t43 18 43-18 17-44v-58q0-134-93-227t-227-93-227 93-93 227 93 227 227 93h200v80zm0-280q50 0 85-35t35-85-35-85-85-35-85 35-35 85 35 85 85 35"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="18" height="18"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144zM480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/></svg>`,
    send:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 960" width="18" height="18"><path d="M440 620h80V500h120v-80H520V300h-80v120H320v80h120zM100 940V220c0-22 7.8-40.8 23.5-56.5S158 140 180 140h600c22 0 40.8 7.8 56.5 23.5S860 198 860 220v480c0 22-7.8 40.8-23.5 56.5S802 780 780 780H260zm126-240h554V220H180v525zm-46 0V220z"/></svg>`,
  }
};

config.html.comment = `<div class="post-comment" id="comment">
  <form>
    <fieldset>
      <label><input name="name" placeholder="昵称" maxlength="20" type="text" required /></label>
      <label><input name="mail" placeholder="邮箱" maxlength="100" type="email" /><span></span></label>
      <label><input name="link" placeholder="链接" maxlength="100" type="url" /><span></span></label>
      <input name="pid" type="hidden" />
      <input name="rid" type="hidden" />
    </fieldset>
    <textarea name="text" placeholder="支持 Markdown 格式；只有昵称与内容必填~" maxlength="5000" required></textarea>
    <div>
      <button type="button" aria-label="toggle-emoji">${config.svg.emoji}</button>
      <button type="button" aria-label="cancel-reply" disabled>${config.svg.reply} <span></span> ${config.svg.close}</button>
      <button type="submit" aria-label="submit">${config.svg.send}</button>
    </div>
    <ul aria-hidden="true">
      <li>⁄(⁄ ⁄•⁄ω  ⁄•⁄ ⁄)⁄</li>
      <li>▼・ᴥ・▼</li>
      <li>Ꮚ･ꈊ･Ꮚ</li>
      <li>ʕ•ᴥ•ʔ</li>
      <li>ヽ(✿ﾟ▽ﾟ)ノ</li>
      <li>(つ´ω\`)つ</li>
      <li>(　ﾟ∀ﾟ) ﾉ♡</li>
      <li>(◉３◉)</li>
      <li>(/≧▽≦)/</li>
      <li>(≧ロ≦)</li>
      <li>(((( ；ﾟДﾟ)))</li>
      <li>(ﾟДﾟ;≡;ﾟДﾟ)</li>
      <li>( ´∀｀)σ)∀\`)</li>
      <li>（ ^_^）o自自o（^_^ ）</li>
      <li>|´・ω・)ノ</li>
      <li>ヾ(≧∇≦*)ゝ</li>
      <li>(☆ω☆)</li>
      <li>（╯‵□′）╯︵┴─┴</li>
      <li>￣﹃￣</li>
      <li>(/ω＼)</li>
      <li>∠( ᐛ 」∠)＿</li>
      <li>(๑•̀ㅁ•́ฅ)</li>
      <li>→_→</li>
      <li>୧(๑•̀⌄•́๑)૭</li>
      <li>٩(ˊᗜˋ*)و</li>
      <li>(ノ°ο°)ノ</li>
      <li>(´இ皿இ｀)</li>
      <li>⌇●﹏●⌇</li>
      <li>(ฅ´ω\`ฅ)</li>
      <li>(╯°A°)╯︵○○○</li>
      <li>φ(￣∇￣o)</li>
      <li>ヾ(´･ ･｀｡)ノ"</li>
      <li>( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃</li>
      <li>(ó﹏ò｡)</li>
      <li>Σ(っ °Д °;)っ</li>
      <li>( ,,´･ω･)ﾉ"(´っω･｀｡)</li>
      <li>╮(╯▽╰)╭ </li>
      <li>o(*////▽////*)q</li>
      <li>＞﹏＜</li>
      <li>(ㆆᴗㆆ)</li>
      <li>(｡•ˇ‸ˇ•｡)</li>
    </ul>
  </form>
  <ul></ul>
</div>`;

const detail = ({ date, count, rating, fandom, character, summary, source, sourcelink, notes }, mapping) => {
  return `
    <div class="post-meta">
      <p>
        <time>${date}</time>
        <span>${count}K words</span>
      </p>
      <p>
        <span>${rating}</span>
        <span>${fandom}</span>
        ${character ? `<span>${character.join(" ")}</span>` : ``}
      </p>
      ${source ? sourcelink
        ? `<p lang="en">译自 <a target="_blank" rel="noopener noreferrer nofollow" href="${sourcelink}">${source}</a></p>`
        : `<p lang="en">译自 ${source}</p>`
      : ``}
    </div>
    <div class="post-summary">${marked.parse(summary)}</div>
    ${notes ? `<div class="post-notes">${marked.parse(notes)}</div>` : ``}
  `;
};

const handle = {

  "feed": (data, host) => {
    const urls = Object.keys(data).filter((path) => /\/notes\/.+/.test(path)).slice(0, 20);
    const text = `<?xml version="1.0" encoding="UTF-8" ?>

      <feed xmlns="http://www.w3.org/2005/Atom">

        <title>${config.title}</title>
        <subtitle>${config.description}</subtitle>
        <link href="${host}" />
        <link href="${host}/feed.xml" rel="self" />
        <updated>${data[urls[0]].date}T00:00:00+08:00</updated>
        <id>${host}</id>
        <author>
          <name>${config.author}</name>
        </author>

        ${urls.map((link) => {
          const {date, title, summary, tags} = data[link];
          return `<entry>
          <title>${title}</title>
          <link href="${host}${link}" />
          <id>${host}${link}</id>
          <published>${date}T00:00:00+08:00</published>
          <updated>${date}T00:00:00+08:00</updated>
          <summary>${summary || "暂无简介。"}</summary>
          ${tags?.map((tag) => `<category term="${tag}" />`).join("\n    ")}
        </entry>`}).join("\n\n  ")}

      </feed>`.replace(/      /g, "");
    return text;
  },

  "sitemap": (data, host) => {
    const urls = [host + "/", ...Object.keys(data).map(key => `${host}${key}`)];
    const text = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map((link) => `<url><loc>${link}</loc></url>`).join("\n  ")}
    </urlset>`.replace(/    /g, "");
    return text;
  },

  "admin": async (c) => {
    const resp = await fetch("https://api.cloudflare.com/client/v4/zones", {
      headers: {
        "Authorization": `Bearer ${c.env.AUTH}`,
      },
    });
    const json = await resp.json();

    let html = `<!DOCTYPE html>
      <html lang="zh">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
          <meta name="author" content="${config.author}" />
          <title>Admin | ${config.author.toLowerCase()}</title>
          <link rel="icon" href="/favicon.png" type="image/png" />
          <link rel="apple-touch-icon" href="/favicon.png">
          <link rel="apple-touch-icon-precomposed" href="/favicon.png">
          <link rel="stylesheet" href="/assets/style-admin.css" />
          <script defer src="/assets/script-admin.js"></script>
        </head>
        <body>
          <div class="bg"><div></div></div>
          <main>
            <div>
              <p role="combobox" aria-controls="user" tabindex="0"></p>
              <ul id="user" role="listbox"></ul>
            </div>
            <div>
              <p role="combobox" aria-controls="zone" tabindex="-1"></p>
              <ul id="zone" role="listbox"></ul>
            </div>
            <article id="link">
              <section></section>
              <section></section>
            </article>
          </main>
          <script>const json = ${JSON.stringify(json)}</script>
        </body>
      </html>
    `;
    html = html.replace(/\n+\s*/g, "");
    return html;
  },

  "error": (status, redirect = false) => {
    const text = status == 503
      ? `<h1>卡住啦</h1><p>请过几分钟再来看看，或者喊站长来修服务器`
      : redirect
        ? `<h1>走丢啦</h1><p>内容或许在搬家过程中遗失，也有可能还在站内或者换了<a target="_blank" href="https://lab.fiammanda.com">地址</a>`
        : `<h1>迷路啦</h1><p>这个地址空空如也`;
    const page = {
      title: status,
      type: "error",
      main: `<article>${text} <span role="img">≦(._.)≧</span></p></article><aside data-text="${status}"></aside>`
    };
    return layout(page);
  },

  "index": () => {
    return layout({
      title: config.title,
      type: "index",
      summary: "高龄同人女纯手搓个站。",
      main: `<article>
        <h1><svg viewBox="2 -80 288 80" xmlns="http://www.w3.org/2000/svg"><text>${config.title}</text></svg></h1>
        <p>${config.description}</p>
        <p>感谢访问高龄同人女的手搓站点 ヽ(✿ﾟ▽ﾟ)ノ 仅支持现代浏览器！</p>
        <div>
          <ul>
            <li><a target="_blank" href="https://lab.fiammanda.com">我的小玩意儿</a></li>
          </ul>
          <ul>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://archiveofourown.org/users/fiammanda">AO3</a></li>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://space.bilibili.com/159653">BiliBili</a></li>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://fiammanda.lofter.com">Lofter</a></li>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://weibo.com/fiammanda">Weibo</a></li>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.youtube.com/fiammanda">YouTube</a></li>
          </ul>
          <ul>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.travellings.cn/go.html">开往</a></li>
            <li><a target="_blank" rel="noopener noreferrer nofollow" href="https://blogs.quest">穿梭</a></li>
          </ul>
        </div>
      </article>`
    });
  },

  "memos": async (data, page, slug, c) => {
    page.l = marked.parse(data["/memos/"]["contents"]);
    if (!slug) {
      page.summary = `个人收集总结。`;
      page.m = `<article>${marked.parse(page.raw).replace(/<(h\d) /g, `<$1 class="page-title" `)}</article>`;
    } else {
      page.summary = `关于 ${page.title} 的个人收集总结。`.replace(/([一-龥]) ([一-龥])/g, "$1$2");
      page.m = `<article>${marked.parse(page.raw)}</article>`;
      page.r = marked.toc(page.raw, 5);
      page.stat = true;
    }
    return layout(page);
  },

  "notes": async (data, page, slug, c) => {
    const list = data["/notes/"]["index"];

    if (!slug) {
      page.summary = `个人冲浪简报。`;
      page.main = `
        <section class="layout-m">
          <h1 class="page-title">${page.title}</h1>
          <div class="post-list">${list.map((path) => {
            const { title, tags, date, summary } = data[path];
            return `<article class="${tags ? tags.map(tag => `post-tag-${tag.toLowerCase()}`).join(" ") : "post-tag-none"}">
              <div>
                <time class="post-date">${date}</time>
                <p class="post-tags">${tags?.map(tag => `<span data-tag="${tag.toLowerCase()}"></span>`).join("")}</p>
              </div>
              <div>
                <h2><a href="${path}">${title}</a></h2>
                <p>${summary}</p>
              </div>
            </article>`;
          }).join("")}</div>
        </section>
        <aside class="layout-r">
          <nav class="post-nav">
            <strong>In This List</strong>
            <ul role="radiogroup">
              ${Object.entries(data["/notes/"]["tags"]).map(([tag, count]) => `
                <li role="radio" data-tag="${tag.toLowerCase()}">
                  ${config.svg.radio}
                  <span> ${tag}</span>
                  <sup> ${count}</sup>
                </li>
              `).join("")}
            </ul>
          </nav>
        </aside>
      `;

    } else {
      const i = list.indexOf(`/notes/${slug}/`);
      i < list.length && (page.prev = list[i+1]);
      i > 0 && (page.next = list[i-1]);

      page.stat = true;
      page.m = `<article>
        <ul class="post-meta">
          <li class="post-date"><time>${page.date}</time></li>
          <li class="post-tags">${page.tags?.join(" ")}</li>
        </ul>
        <h1 class="post-title">${page.title}</h1>
        <div class="post-body">${marked.parse(page.raw)}</div>
        <ul class="post-page">
          <li>${page.prev ? `<a rel="prev" href="${page.prev}">${data[page.prev]["title"]}</a>` : ``}</li>
          <li>${page.next ? `<a rel="next" href="${page.next}">${data[page.next]["title"]}</a>` : ``}</li>
        </ul>
        ${config.html.comment}
      </article>`;
      page.r = marked.toc(page.raw, 4);

    }

    return layout(page);
  },

  "works": async (data, page, slug, c) => {

    if (!slug) {
      page.summary = "个人同人闯作归档。";
      page.main = `<article>
        <h1 class="page-title">${page.title}</h1>
        <p>本站分级参照 AO3；CP 不区分体位，以角色姓氏字母为序。</p>
        <hr />
        <aside>
          <p>无差贵乱，觉得艹等于被艹，苏等于泥塑。</p>
          <p>但爱却不等于被爱。</p>
          <p>真难啊。</p>
        </aside>
        <h2 class="page-title" class="page-title">Updates</h2>
        <ul class="update-list">${data["/works/"]["index"].map((path) => {
          const { title, date, fandom, character, rating, summary, count, source, sourcelink, note } = data[path];
          return `<li>
            <a href="${path}">${title}</a>
            <p>
              <time>${date}</time>
              <span>${count}K</span>
              <span>${rating}</span>
              <span>${fandom}</span>
              ${character && (`<span>${character.map((c) => `<span data-name="${c}" data-abbr="${data["/works/"]["term"][c]}"></span>`).join(" ")}</span>`)}
            </p>
          </li>`;
        }).join("")}</ul>
        <h2 class="page-title">Fandoms</h2>
        <ul class="fandom-list">${Object.keys(data).filter((path) => data[path]["nameo"]).map((path) => {
          const { index, title, nameo } = data[path];
          return `<li>
            <a href="${path}">
              <p>${index.length}</p>
              <p>
                <span>${title}</span>
                <span>${nameo}</span>
              </p>
            </a>
          </li>`;
        }).join("")}</ul>
      </article>`;

    } else if (page.index) {
      page.summary = slug === "misc" ? `杂七杂八同人闯作。` : `${page.title}同人闯作。`;

      page.main = `
        <section class="layout-m">
          <h1 class="page-title">${page.namee || page.nameo}</h1>
          <p class="page-subtitle">${page.title}</p>
          <div class="post-list">
            ${page.index.map((path) => {
              const { title, character } = data[path];
              return `<article class="${character ? character.map((tag) => `post-tag-${tag}`).join(" ") : `post-tag-无主要角色`}">
                <h2><a href=${path}>${title.replace(/(\w)'(\w)/g, `$1<span lang="en">’</span>$2`)}</a></h2>
                ${detail(data[path], data["/works/"]["term"])}
              </article>
            `;
            }).join("")}
          </div>
        </section>
        <aside class="layout-r">
          ${slug === "misc" ? `` : `<nav class="post-nav">
            <strong>In This List</strong>
            <ul role="radiogroup">
              ${Object.entries(page.characters).map(([character, count]) => (`
                <li role="radio" data-tag="${character}">
                  ${config.svg.radio}
                  <span> ${character}</span>
                  <sup> ${count}</sup>
                </li>
              `)).join("")}
            </ul>
          </nav>`}
        </aside>`;

    } else {
      page.parent = `/works/${data["/works/"]["term"][page.fandom] || "misc"}/`;
      page.stat = true;

      page.l = `<a href="${page.parent}" data-name="${data[page.parent]["nameo"]}">${data[page.parent]["title"]}</a>`;
      page.m = `<article>
        ${detail(page, data["/works/"]["term"])}
        <div class="post-body">
          ${marked.parse(page.raw)
            .replace(/<strong>(.+?)<\/strong>/g, (_, content) => {
              return `<strong>${content.replace(/([一-龥])/g, "<span>$1</span>")}</strong>`;
            })
            .replace(/<p>(\[\^\d+\]: .+?)<\/p>/, (_, content) => {
              const li = content.replace(/\[\^(\d)+\]: ([^\[]+)/g, `<li id="fn-$1"><sup><a href="#fnref-$1">$1</a></sup>$2</li>`);
              return `<ol role="note">${li}</ol>`;
            })
            .replace(/\[\^(\d+)\]/g, `<sup id="fnref-$1"><a href="#fn-$1">$1</a></sup>`)
            .replace(/(<a href="http[^>]+?>\d+<\/a>)/g, `<sup>$1</sup>`)
          }
        </div>
        ${config.html.comment}
      </article>`;
      page.r = marked.toc(page.raw);
    }

    return layout(page);
  }
};

function layout(page) {
  let html = `<!DOCTYPE html>
    <html lang="zh" class="load-init">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no" />
        <meta name="author" content="${config.author}" />
        ${page.summary ? `<meta name="description" content="${page.summary}">` : ""}
        <title>${page.title} | ${config.author.toLowerCase()}</title>
        <link rel="alternate" href="${page.host}/feed.xml" type="application/atom+xml" title="The F Feed" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png">
        <link rel="apple-touch-icon-precomposed" href="/favicon.png">
        <link rel="preload" href="/assets/incompleeta.woff2" as="font" />
        <link rel="preload" href="/assets/script.js" as="script" />
        <link rel="preload" href="/assets/style.css" as="style" />
        <link rel="preload" href="/assets/style-${page.type}.css" as="style" />
        <link rel="preconnect" href="https://rsms.me/" crossorigin>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap" />
        <link rel="stylesheet" href="${config.html.icon}" />
        <link rel="stylesheet" href="https://fontsapi.zeoseven.com/292/main/result.css" />
        <link rel="stylesheet" href="/assets/style.css" />
        <link rel="stylesheet" href="/assets/style-${page.type}.css" />
        <script src="/assets/script.js"></script>
        <script src="https://stats.fiammanda.com/script.js" data-website-id="88a0bbcc-c97f-4e1b-8375-31348b5c3bee" data-domains="fiammanda.com" defer></script>
      </head>
      <body>
        <div id="page">
          <header>
            <div role="img">${config.svg.logo}</div>
            <nav class="site-nav">
              <a rel="home" href="/">${config.svg.logo}</a>
              <p>
                <a href="/memos/">Memos</a>
                <a href="/notes/">Notes</a>
                <a href="/works/">Works</a>
              </p>
            </nav>
            <div class="backdrop"></div>
            <div role="menubar">
              <button aria-label="toggle-nav">${config.svg.nav}</button>
              <button aria-label="toggle-toc"${page.r || page.main?.includes("post-nav") ? "" : " disabled"}>${config.svg.toc}</button>
            </div>
          </header>
          <main>
  `;
  html += page.main || `
    <div class="layout-l">
      <nav class="page-nav">${page.l || ""}</nav>
      <div class="layout-b">${page.stat ? "<span></span>" : ""}</div>
    </div>
    <div class="layout-m">${page.m || ""}</div>
    <div class="layout-r">
      <nav class="post-nav">${page.r || ""}</nav>
      <div class="layout-b">${page.stat ? `
        <ul class="post-stat">
          ${page.type === "memos" ? `` : `<li><a href="#comment" aria-label="post-comment"><span></span></a></li>`}
          <li><button aria-label="post-like"><span></span></button></li>
          <li><button aria-label="post-view"><span></span></button></li>
        </ul>
      ` : ``}</div>
    </div>
  `;
  html += `
        </main>
        <div>
          <button aria-label="toggle-menu-show"></button>
        </div>
        <footer>
          <p>(<span>c</span>) ${config.year} ${config.author}</p>
          <button aria-label="toggle-mode">${config.svg.mode}</button>
        </footer>
      </div>
    </body>
  </html>`;
  html = html.replace(/\n+\s*/g, "");
  return html;
}

export { handle };