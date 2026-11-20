# Skelril Wiki

The public documentation for Skelril (the Grindstone server rebuilt on Luanti): the **player guide**, the **news** and the **roadmap**.
Published at **https://wiki.skelril.net** by GitHub Actions to GitHub Pages. It is a [VitePress](https://vitepress.dev/) site written in TypeScript.

## Layout

- `docs/`: player guide chapters (CommonMark `.md`; `NN-name.md` or `NNx-name.md`; the prefix orders the sidebar and is not part of the URL). Front matter `icon:` picks the chapter's
  pixel icon. Callouts: `::: tip Title` / `::: info ...` / `::: warning ...`, closed by `:::`.
  A directory is a sidebar section; its `index.md` is the section page (`<CategoryIndex />` lists its chapters). Inline code starting with `/` renders
  as a command chip.
- `news/*.md`: news posts (`/news/<name>`). Frontmatter: `type`, `title`, `date` (unquoted, such as `2026-11-19`) and
  `summary` (one line for the list and the feed). Two types:
  - `type: feature`: one feature that arrived, with `guide` (its player guide page, such as `/guide/areas/gold-rush`)
    and a few short paragraphs for players. The header links to the guide page by its title.
  - `type: fixes`: bug fixes, with no `guide`. The body can cover several topics, one `##` heading each; they show in
    the page outline.
  `NewsHeader.vue` adds the title, the date and the guide link or "Bug fixes" label above the body. The newest 30 posts,
  in full, are also the RSS feed `/news/rss.xml`, with the type as each item's category. Validated at build time.
  `news/[year]/[month].md` builds one archive page per month with posts (`/news/2026/11`); `/news/` shows the latest 10 posts and links to the archive.
- `roadmap/roadmap.toml`: the roadmap page's data (`/roadmap`): one teaser per upcoming feature. Validated at build
  time (horizons, icons). When a feature ships, delete its teaser and add its feature post in the same commit.
- `tips/tips.toml`: the home page's "Did you know?" tips, each linking to a guide page. Every cheat sheet command is a
  tip too, except those in `skip`. The build checks the links and writes them all to `/tips.json`, which the home page
  loads after it opens and shows one at random.
- `index.md`, `news/index.md`, `roadmap.md`: the home, news and roadmap pages (`.vitepress/theme/Home.vue`, `News.vue`,
  `Roadmap.vue`; data from `news.data.ts` and `roadmap.data.ts`; `news.node.ts` checks the posts and writes the feed).
- The pixel-art theme (CSS, fonts, icons, components, and the chapter scanner and markdown plugins the config uses) is
  `vitepress-theme-skelril`, in its own repository, [skelril-docs-theme](https://github.com/packet-loss-gaming/skelril-docs-theme),
  shared with the game repository's admin guide. `package.json` pins a tag; to upgrade, change the tag and run `npm install`.
  See that repository's README for trying unreleased theme changes here.

## Build

```sh
./build.sh          # npm ci + vue-tsc + vitepress build -> build/ (uses nix-shell for Node when npm is missing)
./run-dev.sh        # live preview (vitepress dev; installs dependencies when needed, uses nix-shell like build.sh)
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` and publishes `build/`. Pull requests only build.
One-time setup: repository Settings -> Pages -> Source "GitHub Actions", custom domain `wiki.skelril.net`, enforce HTTPS; DNS
`CNAME wiki -> <owner>.github.io`.

## Licence

GPLv3 (see `LICENSE.txt`), like the game. The theme's fonts are under the SIL Open Font Licence.
