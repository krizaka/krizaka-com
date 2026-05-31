import type { Metadata } from "next";
import EditionsClient from "./EditionsClient";

export const metadata: Metadata = {
  title: "Éditions — Orasaka Community & Cloud",
  description:
    "Orasaka Community (open source, auto-hébergé, gratuit) et Orasaka Cloud (white-label, Packages en un clic — liste d'attente). Dans tous les cas, vos données restent sur votre infrastructure.",
};

export default function EditionsPage() {
  return <EditionsClient />;
}
