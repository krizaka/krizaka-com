/* What the home may show of moving media (krizaka-internal#3243): nothing at load. The founder's feedback of 2026-11-13: « le
   but de krizaka.com c'est le site de la compagnie » — no carousel, no <video>, no sound or pause control before the visitor
   asks for a film (which lives on its watch page). Pure: the browser's snapshot in, one line per problem out
   (scripts/check-showcase-player.mjs reads the snapshot, tests/home-media.test.mjs proves the rule). */

/** What the page holds once loaded and scrolled to its end. */
export function emptySnapshot() {
  return { videos: 0, carousels: 0, soundControls: 0, pauseControls: 0, mediaRequests: [] };
}

/** The problems of one home page: anything that moves, plays or asks for a video before the visitor asks. */
export function homeMediaProblems(snapshot, label) {
  const problems = [];
  const found = [
    [snapshot.videos > 0, `${snapshot.videos} <video> mounted at load (the home mounts none)`],
    [snapshot.carousels > 0, `${snapshot.carousels} carousel on the home (it has none)`],
    [snapshot.soundControls > 0, "a sound control on a page with no video"],
    [snapshot.pauseControls > 0, "a pause control, though nothing moves"],
  ];
  for (const [present, what] of found) {
    if (present) {
      problems.push(`${label}: ${what}`);
    }
  }
  for (const url of snapshot.mediaRequests) {
    problems.push(`${label}: a video file was requested at load (${url})`);
  }
  return problems;
}
