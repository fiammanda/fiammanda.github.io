import fs from "fs";
import { handle } from "../src/utils/html.js";

fs.writeFileSync("./public/index.html", handle["index"](), "utf8");

console.log("public/index.html generated.");