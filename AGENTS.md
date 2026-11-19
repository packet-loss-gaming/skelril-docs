# Skelril wiki (public)

VitePress site (TypeScript) for https://wiki.skelril.net: the player guide (`docs/`) and the roadmap (`roadmap/roadmap.toml`). See README.md.

- Public content only: no admin-only commands, privileges, settings or server operation.
- Document features with the game repository's `skills/document-feature/SKILL.md`; its docs check verifies this repo's
  `docs/*-cheat-sheet.md` lists every player command, so run it after editing the cheat sheet.
- Never add a login button or anything that needs authentication. The "Edit this page" link (`editLink` in `.vitepress/config.mts`) points at GitHub.
- The theme is the `vitepress-theme-skelril` package from the separate skelril-docs-theme repository, pinned by tag in
  `package.json`; change it there, tag a release, then bump the tag here and in the game repository's admin guide.
- Deployment is GitHub Actions -> GitHub Pages on push to `main`; `./build.sh` reproduces the CI build locally.
