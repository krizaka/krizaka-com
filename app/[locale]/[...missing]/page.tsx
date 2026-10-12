import { notFound } from "next/navigation";

/* Any address that matches no page: the locale's not-found page (the Error template), with the site's chrome. */
export default function Missing() {
  notFound();
}
