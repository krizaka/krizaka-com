import test from "node:test";
import assert from "node:assert/strict";
import { jsonLd } from "../lib/json-ld.ts";

test("a closing script tag in a value cannot leave the JSON-LD block", () => {
  const value = { name: "</script><img src=x onerror=alert(1)>", note: "a & b" };
  const out = jsonLd(value);
  assert.ok(!out.includes("<") && !out.includes(">") && !out.includes("&"));
  assert.deepEqual(JSON.parse(out), value);
});

test("the two JavaScript line separators are escaped and the value round-trips", () => {
  const value = { a: "x" + String.fromCharCode(0x2028) + "y" + String.fromCharCode(0x2029) + "z" };
  const out = jsonLd(value);
  assert.ok(!out.includes(String.fromCharCode(0x2028)) && !out.includes(String.fromCharCode(0x2029)));
  assert.deepEqual(JSON.parse(out), value);
});
