# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Build site (outputs to _site/)
bundle exec jekyll build
```

The site auto-deploys to GitHub Pages on push to `master` via `.github/workflows/jekyll-gh-pages.yml`.

## Architecture

This is a **Jekyll static site** — Adam Lechowicz's personal academic website. No Node.js or npm; pure Ruby/Jekyll stack.

### Content Configuration

Most site content is driven by **YAML data files** rather than front matter:

- `_data/settings.yml` — Primary content: about section (full HTML), project list, social links, nav menu, Google Analytics ID, Disqus config
- `_data/layout.yml` — Color palette variables consumed by SASS
- `_config.yml` — Jekyll config: markdown processor (kramdown), plugins, SASS source path

### Layouts & Includes

- `_layouts/` — 9 templates; `front.html` is the homepage layout, `post.html` for blog posts, `default.html` is the base
- `_includes/` — Reusable components (header, footer, analytics, image helper)

### Content Pages

- `index.html` — Homepage; renders `site.data.settings.about` via Markdown
- `publications.md` — Full publications list (manually maintained, not generated from BibTeX despite jekyll-scholar being installed)
- `news.md` — Recent news and upcoming talks
- `blog.md` + `_posts/` — Blog posts in standard Jekyll format
- `projects/` — Individual project pages (markdown)

### Styling

SASS source lives in `assets/css/` and is organized into tools (variables/mixins), base (reset/typography), and sections. The `_data/layout.yml` colors are referenced in SASS via Jekyll's data access.
