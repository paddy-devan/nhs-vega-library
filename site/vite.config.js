import { defineConfig } from "vite";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : "/";

export default defineConfig({
  root: "site",
  base,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
