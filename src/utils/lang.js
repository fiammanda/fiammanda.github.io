import { Prism } from "prism-esm";
import { loader as markup } from "prism-esm/components/prism-markup.js";
import { loader as json } from "prism-esm/components/prism-json.js";
import { loader as yaml } from "prism-esm/components/prism-yaml.js";
import { loader as css } from "prism-esm/components/prism-css.js";
import { loader as clike } from "prism-esm/components/prism-clike.js";
import { loader as javascript } from "prism-esm/components/prism-javascript.js";
import { loader as typescript } from "prism-esm/components/prism-typescript.js";
import { loader as bash } from "prism-esm/components/prism-bash.js";
import { loader as batch } from "prism-esm/components/prism-batch.js";
import { loader as powershell } from "prism-esm/components/prism-powershell.js";

const prism = new Prism();

const loaders = {
  markup,
  json,
  yaml,
  css,
  clike,
  javascript,
  typescript,
  bash,
  batch,
  powershell,
};

function prismHighlight(langs = []) {
  langs.forEach(lang => {
    const loader = loaders[lang];
    if (loader) loader(prism);
  });
}

export { prism, prismHighlight };