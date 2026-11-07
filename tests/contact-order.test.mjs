import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT_PRODUCTS } from "../lib/contact-kinds.ts";
import { PRODUCT_ORDER } from "../lib/home-sections.ts";
import { IN_DESIGN_IDS } from "../lib/products-in-design.ts";

/* The contact form listed Verikora, Folioviv, Sovkora, Kridoc while the home, the footer, the docs and the changelog say
   Sovkora, Verikora, Folioviv (krizaka-internal#2814): one order everywhere, the products, then those in design, then the blocks. */
test("the contact form's products come in the home's order, then the products in design, then the building blocks", () => {
  assert.deepEqual([...CONTACT_PRODUCTS], [...PRODUCT_ORDER, ...IN_DESIGN_IDS, "blocks"]);
});
