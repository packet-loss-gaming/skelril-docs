# Skelril Wiki

The public documentation for Skelril (the Grindstone server rebuilt on Luanti): the **player guide** and the **roadmap**.
Published at **https://wiki.skelril.net** by GitHub Actions to GitHub Pages. It is a [VitePress](https://vitepress.dev/) site written in TypeScript.

## Layout

- `docs/`: player guide chapters (CommonMark `.md`; `NN-name.md` or `NNx-name.md`; the prefix orders the sidebar and is not part of the URL). Front matter `icon:` picks the chapter's
  pixel icon. Callouts: `::: tip Title` / `::: info ...` / `::: warning ...`, closed by `:::`.
  A directory is a sidebar section; its `index.md` is the section page (`<CategoryIndex />` lists its chapters). Inline code starting with `/` renders
  as a command chip.
- `roadmap/roadmap.toml`: the roadmap page's data (`/roadmap`). Validated at build time (statuses, icons, legend).
- `index.md`, `roadmap.md`: the home and roadmap pages (`.vitepress/theme/Home.vue`, `Roadmap.vue`, data from `roadmap.data.ts`).
- The pixel-art theme (CSS, fonts, icons, components, and the chapter scanner and markdown plugins the config uses) is
  `vitepress-theme-skelril`, in its own repository, [skelril-docs-theme](https://github.com/packet-loss-gaming/skelril-docs-theme),
  shared with the game repository's admin guide. `package.json` pins a tag; to upgrade, change the tag and run `npm install`.
  See that repository's README for trying unreleased theme changes here.

## Build

```sh
./build.sh          # npm ci + vue-tsc + vitepress build -> build/ (uses nix-shell for Node when npm is missing)
npx vitepress dev   # live preview
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` and publishes `build/`. Pull requests only build.
One-time setup: repository Settings -> Pages -> Source "GitHub Actions", custom domain `wiki.skelril.net`, enforce HTTPS; DNS
`CNAME wiki -> <owner>.github.io`.

## Licence

GPLv3 (see `LICENSE.txt`), like the game. The theme's fonts are under the SIL Open Font Licence.
