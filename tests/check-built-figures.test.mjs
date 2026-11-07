import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { visibleText, zeroFigures } from "../scripts/check-built-figures.mjs";

test("a built page that says « more than 0 » or « plus de 0 » is caught, through React's text markers (krizaka-internal#2806)", () => {
  assert.deepEqual(zeroFigures("<p>more than <!-- -->0<!-- --> open-source repositories</p>"), ["more than 0"]);
  assert.deepEqual(zeroFigures("<p>plus de&nbsp;<span>0</span> dépôts</p>"), ["plus de 0"]);
  assert.deepEqual(zeroFigures("<p>More than 0 packages</p>"), ["More than 0"]);
});

test("a real figure, a decimal or a figure in a script is not a zero figure", () => {
  assert.deepEqual(zeroFigures("<p>more than <!-- -->5<!-- --> repositories, plus de 40 paquets</p>"), []);
  assert.deepEqual(zeroFigures("<p>more than 0.5 s, plus de 05</p>"), []);
  assert.deepEqual(zeroFigures('<script>self.__next_f.push("more than 0")</script><p>ok</p>'), []);
  assert.equal(visibleText("<b>a</b><!-- -->b"), " a b");
});

test("npm run build runs the figures check on the built pages, in the built-output guard step", () => {
  const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
  assert.match(
    JSON.parse(read("package.json")).scripts.build,
    /node scripts\/check-code-names\.mjs \.next\/server\/app/,
  );
  const guard = read("scripts/check-code-names.mjs");
  assert.match(guard, /import \{ figureReport \} from "\.\/check-built-figures\.mjs"/);
  assert.match(guard, /figures\.lines\.length > 0 \? 1 : 0/);
});
