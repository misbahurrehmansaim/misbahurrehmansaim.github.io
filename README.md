# Misbah Ur Rehman Saim - portfolio

Static site (plain HTML, CSS and ES modules). No build step, no server, no dependencies.
Live address once deployed: https://misbahurrehmansaim.github.io/

## Deploy to GitHub Pages

1. On GitHub, create a **public** repository named exactly `misbahurrehmansaim.github.io`
   (a user site must use `<username>.github.io`).
2. Upload everything in this folder to the **root** of the repository's `main` branch
   (including the hidden `.nojekyll` file). With Git:
   ```
   git init
   git add .
   git commit -m "Add portfolio"
   git branch -M main
   git remote add origin https://github.com/misbahurrehmansaim/misbahurrehmansaim.github.io.git
   git push -u origin main
   ```
3. In the repository go to **Settings > Pages**. Under **Build and deployment**, set
   **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, then Save.
4. Wait a minute or two, then open https://misbahurrehmansaim.github.io/.

Asset paths in `index.html` are relative, so the site works at the root of a user site.
`404.html` uses root-absolute paths because GitHub Pages serves it from any URL.

## After it is live

- Add the site in Google Search Console and submit `https://misbahurrehmansaim.github.io/sitemap.xml`.
- Paste the URL into LinkedIn's Post Inspector to refresh the social preview (`assets/og-image.png`).
- Add the site to your LinkedIn profile "Website" field and your Upwork profile.

## Things to review before publishing

- **Case study text.** The Problem and Research lines are written from the scope of work listed
  on your previous portfolio. Tighten them with specifics you are happy to share.
- **Executive RACT.** The earlier portfolio listed "Car Rental Business" and "Executive RAC & Tours"
  as separate projects; they are combined here into one case study, matching your CV. Confirm that is right.
- **Figures.** Only 150% organic traffic, 3x booking inquiries and 40% conversion-rate improvement are shown
  (plus top-3 rankings, from your CV). The earlier portfolio also showed 200% local visibility and
  10% business performance; they are intentionally left out because they were not in your verified list.
- **EnDevSols.** The current-role description is deliberately short. Add detail if you want.
- **"This portfolio was built with AI-assisted development."** (AI section). Remove it if you prefer.

## Adding proof images (optional, recommended)

1. Export a screenshot (for example a Google Search Console performance report) to `assets/img/`
   as `.webp` (or `.avif`/`.jpg`), around 1200 px wide.
2. In `index.html`, find the commented-out `<figure class="shot">` under the Baby Store Canada case study,
   uncomment it and fix the file name and alt text. Copy it to the Executive RACT case if you have a second image.
3. Do not include screenshots that show a client's revenue or customer data without their permission.

## Adding a portrait

Save a photo as `assets/img/misbah.webp`, then add an `<img>` (with `width`, `height`, `alt`, `loading="lazy"`)
inside the About section where you want it.

## Adding testimonials (only real ones)

The page has a "What working with me looks like" section instead of invented quotes. When you have genuine
feedback (a LinkedIn recommendation, a client message you have permission to quote), add a section after it
with the person's name, role and the exact words, and link to the source where possible.

## Performance notes

- No frameworks and no third-party requests. Fonts (Space Grotesk, Inter) are self-hosted, latin subset, about 70 KB.
- Section scripts in `js/modules/` load only when their section is within 600 px of the viewport.
- Below-the-fold sections use `content-visibility: auto`.
- The 3D hero effect is plain CSS. It switches off automatically on touch devices, screens under 768 px,
  Data Saver, 4 or fewer CPU cores / 4 GB or less memory, and `prefers-reduced-motion`.
- Floating animation pauses when the hero is off-screen.

## Structure

```
index.html            all content, metadata and JSON-LD
404.html              not-found page
css/main.css          all styles
js/main.js            navigation, capability detection, hero tilt
js/modules/           approach, process, skills, counters, contact (lazy loaded)
assets/               fonts, favicon, social image
robots.txt, sitemap.xml, site.webmanifest, .nojekyll
```

## Notes on the workflow order

The hero strip and the interactive visual use the same eight stages: Research, Audit, Problems,
Competitors, Opportunities, Strategy, Implementation, Results.
