/* "Our story" — where the names come from. Bilingual copy for /story and the home teaser.
   Tone: restrained, sincere; a nod to the myths and arcade games behind the names, never an
   affiliation with them. */

import type { L } from "@/lib/org-data";

export const STORY_INTRO: { eyebrow: L; title: L; lead: L } = {
  eyebrow: { en: "Our story", fr: "Notre histoire" },
  title: {
    en: "Every name here is a legend we chose to keep.",
    fr: "Chaque nom ici est une légende que nous avons choisi de garder.",
  },
  lead: {
    en: "We grew up between arcade cabinets and old myths. When we started building software that people would have to trust with their words, their work and their income, we named it after the stories that taught us what trust costs.",
    fr: "Nous avons grandi entre les bornes d'arcade et les vieux mythes. Quand nous avons commencé à construire des logiciels à qui l'on confierait ses mots, son travail et ses revenus, nous les avons nommés d'après les histoires qui nous ont appris ce que coûte la confiance.",
  },
};

export interface Chapter {
  id: "krizaka" | "orazaka" | "orochia";
  name: string;
  roots: L;
  title: L;
  body: L[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "krizaka",
    name: "Krizaka",
    roots: { en: "kris + zaka (坂)", fr: "kris + zaka (坂)" },
    title: { en: "The forge on the slope", fr: "La forge à mi-pente" },
    body: [
      {
        en: "A kris is a blade forged in layers — iron folded onto iron, again and again, until a pattern appears in the steel. Zaka is the slope you climb, one step after another.",
        fr: "Le kris est une lame forgée par couches — le fer replié sur le fer, encore et encore, jusqu'à ce qu'un motif apparaisse dans l'acier. Zaka, c'est la pente que l'on gravit, un pas après l'autre.",
      },
      {
        en: "Krizaka is the forge halfway up the hill. Nothing leaves it that hasn't been folded, tested and written down — and everything that leaves it is open, so anyone can check the pattern.",
        fr: "Krizaka, c'est la forge à mi-pente. Rien n'en sort sans avoir été replié, éprouvé et documenté — et tout ce qui en sort est ouvert, pour que chacun puisse vérifier le motif.",
      },
    ],
  },
  {
    id: "orazaka",
    name: "Orazaka",
    roots: { en: "ōrāre (to speak) + zaka", fr: "ōrāre (parler) + zaka" },
    title: { en: "The oracle that stays home", fr: "L'oracle qui ne quitte pas la maison" },
    body: [
      {
        en: "Ōrāre: to speak, to ask — the Latin root of oracle. In the old stories you climbed to the oracle with your question, and you trusted it with something private.",
        fr: "Ōrāre : parler, demander — la racine latine d'oracle. Dans les vieilles histoires, on montait jusqu'à l'oracle avec sa question, et on lui confiait quelque chose d'intime.",
      },
      {
        en: "Orazaka is an oracle on your own hill. It answers, it reasons, it creates — and it never carries your words down to someone else's valley. AI you can consult without giving anything away.",
        fr: "Orazaka est un oracle sur votre propre colline. Il répond, il raisonne, il crée — et il ne descend jamais vos mots dans la vallée d'un autre. Une IA que l'on consulte sans rien céder.",
      },
    ],
  },
  {
    id: "orochia",
    name: "Orochia",
    roots: { en: "Yamata no Orochi", fr: "Yamata no Orochi" },
    title: { en: "Eight heads, eight answers", fr: "Huit têtes, huit réponses" },
    body: [
      {
        en: "Yamata no Orochi is the eight-headed serpent of Japan's oldest chronicles. Players of a certain age met it elsewhere: the final boss of The King of Fighters '97, sealed by three clans and their sacred treasures.",
        fr: "Yamata no Orochi est le serpent à huit têtes des plus anciennes chroniques du Japon. Les joueurs d'une certaine génération l'ont croisé ailleurs : le boss final de The King of Fighters '97, scellé par trois clans et leurs trésors sacrés.",
      },
      {
        en: "In the myth, Susanoo doesn't win by force. He sets out eight vats, one for each head, and waits. The creator economy has eight heads of its own — Orochia sets out one answer for each, so that creators are paid, every cent, exactly once.",
        fr: "Dans le mythe, Susanoo ne gagne pas par la force. Il dispose huit cuves, une pour chaque tête, et il attend. L'économie des créateurs a ses huit têtes — Orochia pose une réponse devant chacune, pour que les créateurs soient payés, chaque cent, une seule fois.",
      },
    ],
  },
];

/** The eight heads of the creator economy, and the vat Orochia sets out for each. */
export const HEADS: { head: L; answer: L }[] = [
  { head: { en: "Leaked links", fr: "Les liens qui fuient" }, answer: { en: "Playback signed for five minutes", fr: "Une lecture signée pour cinq minutes" } },
  { head: { en: "Forged payments", fr: "Les paiements forgés" }, answer: { en: "Only the gateway can confirm", fr: "Seule la passerelle confirme" } },
  { head: { en: "Double credits", fr: "Les crédits en double" }, answer: { en: "Settled exactly once", fr: "Réglé une seule fois" } },
  { head: { en: "Unpaid creators", fr: "Les créateurs impayés" }, answer: { en: "Balances read from the ledger", fr: "Des soldes lus dans le grand livre" } },
  { head: { en: "Unverified content", fr: "Le contenu non vérifié" }, answer: { en: "2257 records before any upload", fr: "Registres 2257 avant tout envoi" } },
  { head: { en: "Abuse left unanswered", fr: "Les abus sans réponse" }, answer: { en: "Reports kept, takedowns explained", fr: "Signalements conservés, retraits motivés" } },
  { head: { en: "Deplatforming", fr: "Le déréférencement" }, answer: { en: "Your servers, several gateways", fr: "Vos serveurs, plusieurs passerelles" } },
  { head: { en: "Lock-in", fr: "L'enfermement" }, answer: { en: "Apache-2.0, every line", fr: "Apache-2.0, chaque ligne" } },
];

export interface Bird {
  id: "falcon" | "owl" | "pigeon" | "flamingo" | "duck" | "phoenix";
  name: L;
  role: L;
  line: L;
}

export const FLOCK: Bird[] = [
  {
    id: "falcon",
    name: { en: "Martin, the falcon", fr: "Martin, le faucon" },
    role: { en: "The sentinel", fr: "La sentinelle" },
    line: { en: "Watches the borders: Law 25, GDPR, 2257. Nothing crosses that shouldn't.", fr: "Veille sur les frontières : Loi 25, RGPD, 2257. Rien ne passe qui ne devrait pas." },
  },
  {
    id: "owl",
    name: { en: "The owl", fr: "Le hibou" },
    role: { en: "The listener", fr: "Celui qui écoute" },
    line: { en: "Hears every question and keeps it in the house.", fr: "Entend chaque question et la garde à la maison." },
  },
  {
    id: "pigeon",
    name: { en: "The carrier pigeon", fr: "Le pigeon voyageur" },
    role: { en: "The messenger", fr: "Le messager" },
    line: { en: "Carries signed messages, and delivers each one once.", fr: "Porte des messages signés, et livre chacun une seule fois." },
  },
  {
    id: "flamingo",
    name: { en: "The flamingo", fr: "Le flamant rose" },
    role: { en: "The creator", fr: "La créatrice" },
    line: { en: "Balances on one leg and still makes it look easy. We make sure she gets paid.", fr: "Tient en équilibre sur une patte, et rend ça facile. Nous veillons à ce qu'elle soit payée." },
  },
  {
    id: "duck",
    name: { en: "The duck", fr: "Le canard" },
    role: { en: "The builder", fr: "Le bâtisseur" },
    line: { en: "Calm on the surface, paddling hard underneath: the code, the tests, the docs.", fr: "Calme en surface, qui pagaie dur dessous : le code, les tests, la doc." },
  },
  {
    id: "phoenix",
    name: { en: "The phoenix", fr: "Le phénix" },
    role: { en: "The two flames", fr: "Les deux flammes" },
    line: {
      en: "Purple and gold — two rival flames from the arcade legend, flying together. Code reborn with every commit.",
      fr: "Violette et dorée — deux flammes rivales de la légende d'arcade, qui volent ensemble. Du code qui renaît à chaque commit.",
    },
  },
];

export const STORY_CLOSING: { title: L; body: L } = {
  title: { en: "Old stories, kept promises.", fr: "De vieilles histoires, des promesses tenues." },
  body: {
    en: "That is the whole idea. The legends gave us the names; the work is making sure the software deserves them.",
    fr: "C'est toute l'idée. Les légendes nous ont donné les noms ; le travail, c'est de faire en sorte que les logiciels les méritent.",
  },
};
