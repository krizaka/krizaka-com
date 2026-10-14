// The module boundaries of krizaka.com. The shared rules of every Krizaka app come from @krizaka/config
// (krizaka-no-direct-tanstack: @tanstack/* only through a @krizaka facade — ADR-001 of krizaka-ui); the site adds its own.
// (The rules of the former local file targeted an src/features layout this repository does not have: dropped.)
// `npm run lint` runs it on app/ and lib/.

/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  extends: "@krizaka/config/dependency-cruiser",
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "A cycle couples modules for good and breaks Fast Refresh: extract the shared part.",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    tsConfig: { fileName: "tsconfig.json" },
    exclude: { path: "(^|/)(node_modules|\\.next|products)/" },
  },
};
