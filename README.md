# tools

A collection of single-file HTML tools, one folder per tool.

`index.html` at the repo root is a self-updating catalog page: it queries
the GitHub API for the contents of `/tools` at load time and lists every
folder and the HTML file(s) inside it. Add a new folder under `tools/`
with an `.html` file in it and it will appear on the catalog automatically
the next time someone loads the page — no code changes needed.

## Structure

```
index.html                          <- catalog page (auto-lists folders below)
tools/
  pair-lab/
    index.html
  halftone-duotone-tool/
    index.html
```

## Adding a new tool

1. Create a new folder under `tools/`, e.g. `tools/my-new-tool/`.
2. Put the tool's HTML file inside it, ideally named `index.html`.
3. Commit and push.

That's it — the catalog page picks it up on next load.

## Hosting with GitHub Pages

Enable Pages in the repo settings (root of `main` branch). Once enabled,
`index.html` at the repo root becomes your catalog, and each tool is
reachable at `https://<username>.github.io/<repo>/tools/<folder>/`.

Note: the catalog page fetches `https://api.github.com`, which only works
when the page is actually served over http(s) (e.g. via GitHub Pages or
a local server) — opening `index.html` directly from disk will show a
fallback message with a link to browse the tools on GitHub instead.
