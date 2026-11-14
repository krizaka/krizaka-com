import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT_PRODUCTS } from "../lib/contact-kinds.ts";
import { PRODUCT_ORDER } from "../lib/home-sections.ts";

/* The contact form listed Verikora, Folioviv, Sovkora, Kridoc while the home, the footer, the docs and the changelog say
   Sovkora, Verikora, Folioviv (krizaka-internal#2814): one order everywhere, the products (Kridoc one of them since
   krizaka-internal#3559), then the blocks. */
test("the contact form's products come in the home's order, then the building blocks", () => {
  assert.deepEqual([...CONTACT_PRODUCTS], [...PRODUCT_ORDER, "blocks"]);
});
