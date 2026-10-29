// Layout-free reading of the site's sources (krizaka/.github#427): tests ask the TypeScript AST or the CSS tree, never a
// regex over the text, so Prettier (or any editor) can lay the code out as it likes without breaking a test.
import { readFileSync } from "node:fs";
import ts from "typescript";
import postcss from "postcss";

export const read = (file) => readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
const squash = (s) => s.replace(/\s+/g, " ").trim();

const cache = new Map();
export function parse(file) {
  if (!cache.has(file)) {
    const kind = file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    cache.set(file, ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, kind));
  }
  return cache.get(file);
}

function walk(node, visit) {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}
function collect(file, pick) {
  const out = [];
  walk(parse(file), (n) => {
    const v = pick(n);
    if (v !== undefined) out.push(v);
  });
  return out;
}
// an expression's source without its layout: tokens joined by one space, no trailing comma noise
export const text = (node) => squash(node.getText()).replace(/,\s*([)\]}])/g, "$1");

/** Every import: { from, names, default?, namespace?, sideEffect }. */
export const importsOf = (file) =>
  parse(file)
    .statements.filter(ts.isImportDeclaration)
    .map((d) => {
      const c = d.importClause;
      return {
        from: d.moduleSpecifier.text,
        sideEffect: !c,
        default: c?.name?.text,
        names:
          c?.namedBindings && ts.isNamedImports(c.namedBindings)
            ? c.namedBindings.elements.map((e) => e.name.text)
            : [],
      };
    });
export const importsFrom = (file, from) => importsOf(file).some((i) => i.from === from);

/** Names exported by the module (functions, consts, classes, types). */
export const exportedNames = (file) =>
  parse(file).statements.flatMap((s) => {
    const mods = ts.canHaveModifiers(s) ? (ts.getModifiers(s) ?? []) : [];
    if (!mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return [];
    if (ts.isVariableStatement(s)) return s.declarationList.declarations.map((d) => d.name.getText());
    return s.name ? [s.name.text] : [];
  });

/** Every JSX element: { tag, attrs: { name: string | "{expr}" | true }, children } . */
export const jsx = (file) =>
  collect(file, (n) => {
    if (!ts.isJsxOpeningElement(n) && !ts.isJsxSelfClosingElement(n)) return undefined;
    const attrs = {};
    for (const a of n.attributes.properties) {
      if (ts.isJsxSpreadAttribute(a)) {
        attrs[`...${text(a.expression)}`] = true;
        continue;
      }
      const i = a.initializer;
      attrs[a.name.getText()] = !i
        ? true
        : ts.isStringLiteral(i)
          ? i.text
          : i.expression
            ? `{${text(i.expression)}}`
            : text(i);
    }
    return { tag: n.tagName.getText(), attrs };
  });
/** The elements named `tag` whose attributes include every entry of `want` (a RegExp tests the value). */
export function jsxAll(file, tag, want = {}) {
  return jsx(file).filter(
    (e) =>
      e.tag === tag &&
      Object.entries(want).every(([k, v]) => (v instanceof RegExp ? v.test(String(e.attrs[k])) : e.attrs[k] === v)),
  );
}
export const hasJsx = (file, tag, want) => jsxAll(file, tag, want).length > 0;

/** Every string literal and no-substitution template of the file (comments and layout excluded). */
export const strings = (file) =>
  collect(file, (n) => (ts.isStringLiteralLike(n) || ts.isJsxText(n) ? (n.text ?? n.getText()) : undefined));
/** Identifier names used anywhere in the file. */
export const identifiers = (file) => new Set(collect(file, (n) => (ts.isIdentifier(n) ? n.text : undefined)));
/** Callee names of every call, e.g. `dynamic`, `window.clearInterval`. */
export const calls = (file) => collect(file, (n) => (ts.isCallExpression(n) ? n.expression.getText() : undefined));
/** Source of every JSX attribute expression and call argument, layout-free (for « contains this expression »). */
export const expressions = (file) => collect(file, (n) => (ts.isExpression(n) ? text(n) : undefined));
/** Does the file contain, in code (not comments), this layout-free expression? */
export const hasExpression = (file, expr) => expressions(file).includes(squash(expr));
// ---- code as tokens: layout, comments, trailing commas and quote style do not exist here --------------------------
function leaves(node, sf, out) {
  const kids = node.getChildren(sf);
  if (!kids.length) {
    if (ts.isJsxText(node)) out.push(...node.getText(sf).split(/\s+/).filter(Boolean));
    else if (node.kind !== ts.SyntaxKind.EndOfFileToken && node.getText(sf)) out.push(node.getText(sf));
    return out;
  }
  for (const k of kids) if (!ts.isJSDoc(k)) leaves(k, sf, out);
  return out;
}
const dropTrailing = (toks) => toks.filter((t, i) => !(t === "," && [")", "]", "}", ">"].includes(toks[i + 1])));
const tokenCache = new Map();
export function tokensOf(src, key) {
  if (key && tokenCache.has(key)) return tokenCache.get(key);
  const sf = ts.createSourceFile("x.tsx", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const t = dropTrailing(leaves(sf, sf, []));
  if (key) tokenCache.set(key, t);
  return t;
}
/** Does the code of `file` (comments and layout ignored) contain this snippet, token for token? */
export function hasCode(file, snippet) {
  const hay = tokensOf(read(file), file);
  const needle = tokensOf(snippet);
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let k = 0; k < needle.length; k++) if (hay[i + k] !== needle[k]) continue outer;
    return true;
  }
  return false;
}
/** How many times the snippet occurs. */
export function countCode(file, snippet) {
  const hay = tokensOf(read(file), file);
  const needle = tokensOf(snippet);
  let n = 0;
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let k = 0; k < needle.length; k++) if (hay[i + k] !== needle[k]) continue outer;
    n++;
  }
  return n;
}

/** The object literals of `const name = [ {…}, … ]` (or an object) as { key: string value | source text }. */
export function records(file, name) {
  const out = [];
  walk(parse(file), (n) => {
    if (!ts.isVariableDeclaration(n) || n.name.getText() !== name || !n.initializer) return;
    let init = n.initializer;
    while (ts.isAsExpression(init) || ts.isSatisfiesExpression(init) || ts.isParenthesizedExpression(init))
      init = init.expression;
    if (!ts.isArrayLiteralExpression(init)) return;
    for (const el of init.elements) {
      if (!ts.isObjectLiteralExpression(el)) continue;
      const rec = {};
      for (const p of el.properties) {
        if (ts.isPropertyAssignment(p))
          rec[p.name.getText().replace(/^["']|["']$/g, "")] = ts.isStringLiteralLike(p.initializer)
            ? p.initializer.text
            : text(p.initializer);
        else if (ts.isShorthandPropertyAssignment(p)) rec[p.name.text] = p.name.text;
      }
      out.push(rec);
    }
  });
  return out;
}
/** The value of `const name = "…"`. */
export const constString = (file, name) => {
  const found = collect(file, (n) =>
    ts.isVariableDeclaration(n) && n.name.getText() === name && n.initializer && ts.isStringLiteralLike(n.initializer)
      ? n.initializer.text
      : undefined,
  );
  return found[0];
};
/** `export const A = `${B}/x`` constants of a module as { A: template text }. */
export const templates = (file) =>
  Object.fromEntries(
    collect(file, (n) =>
      ts.isVariableDeclaration(n) && n.initializer && ts.isTemplateExpression(n.initializer)
        ? [n.name.getText(), text(n.initializer)]
        : undefined,
    ),
  );

/** The products of lib/products.ts, read from the AST. */
export const PRODUCT_RECORDS = () => records("lib/products.ts", "PRODUCTS");

// ---- CSS -------------------------------------------------------------------------------------------------------
const cssCache = new Map();
export const cssRoot = (file) => {
  if (!cssCache.has(file)) cssCache.set(file, postcss.parse(read(file)));
  return cssCache.get(file);
};
const norm = (s) => squash(s).replace(/\s*,\s*/g, ", ");
/**
 * The declarations of every rule whose selector list contains `selector` (layout-free), optionally inside an at-rule
 * whose params contain `within`. Returns { prop: value }, merged in source order; {} when none.
 */
export function cssDecls(file, selector, { within } = {}) {
  const out = {};
  cssRoot(file).walkRules((rule) => {
    const parents = [];
    for (let p = rule.parent; p && p.type !== "root"; p = p.parent) parents.push(norm(`@${p.name} ${p.params}`));
    if (within ? !parents.some((p) => p.includes(norm(within))) : parents.length) return;
    if (!rule.selectors.map(norm).includes(norm(selector))) return;
    rule.walkDecls((d) => {
      if (d.parent === rule) out[d.prop] = norm(d.value) + (d.important ? " !important" : "");
    });
  });
  return out;
}
export const cssHas = (file, selector, opts) => Object.keys(cssDecls(file, selector, opts)).length > 0;
export const cssSelectors = (file) => {
  const out = [];
  cssRoot(file).walkRules((r) => out.push(...r.selectors.map(norm)));
  return out;
};
export const cssText = (file) => cssRoot(file).toString();
export const cssAtRules = (file, name) => {
  const out = [];
  cssRoot(file).walkAtRules(name, (a) => out.push(norm(a.params)));
  return out;
};

/** `const name = { key: value, … }` as a nested map: string literals as strings, objects as maps, the rest as layout-free text. */
export function objectMap(file, name) {
  const conv = (node) => {
    while (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node))
      node = node.expression;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (!ts.isObjectLiteralExpression(node)) return text(node);
    const out = {};
    for (const p of node.properties)
      if (ts.isPropertyAssignment(p)) out[p.name.getText().replace(/^["']|["']$/g, "")] = conv(p.initializer);
    return out;
  };
  const found = collect(file, (n) =>
    ts.isVariableDeclaration(n) && n.name.getText() === name && n.initializer ? conv(n.initializer) : undefined,
  );
  return found[0];
}

/** For every JSX element named `tag`, the tag names of its enclosing JSX elements (innermost first). */
export function jsxAncestors(file, tag) {
  const out = [];
  const visit = (n, stack) => {
    let next = stack;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
      const name = (ts.isJsxElement(n) ? n.openingElement.tagName : n.tagName).getText();
      if (name === tag) out.push(stack);
      next = [name, ...stack];
    }
    ts.forEachChild(n, (c) => visit(c, next));
  };
  visit(parse(file), []);
  return out;
}
