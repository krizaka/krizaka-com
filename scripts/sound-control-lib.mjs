/* A sound control is shown exactly when the video file has an audio track (founder, 2026-11-13, krizaka-internal#3243: « les
   carrousels n'ont pas tous le bouton son, et les vidéos, j'ai le feeling qu'elles n'ont pas de son »). A silent clip says
   nothing about sound; a file with sound has its control. Pure: what ffprobe saw and what the page drew in, one line per
   problem out (scripts/check-sound-control.mjs reads both on the running site, tests/sound-control.test.mjs proves the rule). */

/** The number of audio streams in the JSON of `ffprobe -show_streams -of json`. */
export function audioTracksOf(probe) {
  return (probe?.streams ?? []).filter((s) => s.codec_type === "audio").length;
}

/** The sound control of one video file: `file` (its address), `page` (where it is drawn), `audioTracks` (ffprobe), `control` (the
 *  page draws a sound control for it). Returns the problems. */
export function soundControlProblems(videos) {
  const problems = [];
  for (const v of videos) {
    if (v.control && v.audioTracks === 0) {
      problems.push(`${v.page}: a sound control sits on a silent file (${v.file})`);
    } else if (!v.control && v.audioTracks > 0) {
      problems.push(`${v.page}: the file has sound and no control to turn it on (${v.file})`);
    }
  }
  return problems;
}
