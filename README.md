# DARIA — AI Creative Studio · pitch deck

26 slides, ~15 minutes, English. Built for brand marketing managers and
agencies looking for an AI production partner.

| File | What it is |
|---|---|
| `Daria - AI Creative Studio.pptx` | **The editable deck.** PowerPoint / Google Slides. |
| `index.html` | The browser version. |
| `deck.css` | All styling and the print rules. |
| `deck.js` | Keyboard navigation (the deck works without it). |
| `BRAND.md` | The visual identity: palette, type, layout system, motifs. |
| `build_pptx.py` | Rebuilds the PowerPoint from the same constants as the CSS. |
| `site/` | **The website** — home, portfolio, contact. This folder is what gets deployed. |
| `tools/build_site.py` | Regenerates the portfolio slides and PDF from the PowerPoint, plus the web stills and films. |

---

## Editing the deck

Open `Daria - AI Creative Studio.pptx`.

Every element is a real object, so you can click and change anything:
text boxes you can retype, images you can swap or recrop, rectangles and lines
you can recolour. Nothing is flattened into a background picture.

### In PowerPoint

Open the file. It is sized 13.33 × 7.5 in (16:9 widescreen), so it matches any
normal PowerPoint deck.

### In Google Slides

1. Upload the `.pptx` to Google Drive.
2. Right-click it → **Open with** → **Google Slides**.
3. File → **Save as Google Slides** if you want a native copy.

Playfair Display and Inter are both in the Google Slides font menu, so the type
comes through correctly. If a heading looks wrong after import, select it and
re-pick **Playfair Display** from the font list.

---

## Adding the videos

Six slides carry a designed placeholder card instead of the film. Drop the real
video on top of the card, then delete the card underneath.

| Slide | Case | File | Ratio |
|---|---|---|---|
| 12 | Clarins | `Projects/Clarins/Final/Product Ad.mp4` | 16:9 · 0:15 |
| 13 | Dreamies | `Projects/Dreamies/Final/Dreamies - Product Ad.mp4` | 16:9 · 0:15 |
| 14 | Havaianas | `Projects/Havaianas/Final/Havaianas - Brand Ad.mp4` | 16:9 · 0:12 |
| 15 | Escudo | `Projects/Escudo/Final/Escudo - Brand Ad.mp4` | 16:9 · 0:23 |
| 16 | Blue Banana | `Projects/Blue Banana/Final/Blue Banana - Brand Ad.mp4` | 16:9 · 0:19 |
| 17 | Manucurist | `Projects/Manucurist/Final/Manucurist - Product Ad.mp4` | **9:16** · 0:08 |

### Exact placement

Set the video to these values and it will land precisely where the placeholder
sits. Use **Format → Size & Position** in PowerPoint, or **Format options →
Size & rotation** in Google Slides.

| | Position X | Position Y | Width | Height |
|---|---|---|---|---|
| Slides 12–16 (16:9) | 0.67 in / 1.69 cm | 1.98 in / 5.03 cm | 8.35 in / 21.21 cm | 4.70 in / 11.93 cm |
| Slide 17 (9:16) | 0.67 in / 1.69 cm | 1.98 in / 5.03 cm | 2.64 in / 6.71 cm | 4.70 in / 11.93 cm |

### PowerPoint

**Insert → Video → This Device**, pick the `.mp4`, then set the size and
position from the table. Under **Playback**, set *Start: Automatically* and
tick *Play Full Screen* if you want the film to take over during the pitch.

The six films total about 280 MB, so a deck with all of them embedded will be
large. If you need to email it, use **File → Compress Media** or link the
videos instead of embedding.

### Google Slides

Google Slides cannot play a local file — the video has to live on Drive or
YouTube first.

1. Upload the six `.mp4` files to Google Drive.
2. On the slide, **Insert → Video → Google Drive**, pick the file.
3. Set the size and position from the table.
4. Click the video → **Format options → Video playback** → *Autoplay when
   presenting*.

---

## Presenting from the browser

Open `index.html`, or serve the folder: `python -m http.server 8777` then
`http://localhost:8777`.

| Key | Action |
|---|---|
| `→` `←` `PgDn` `PgUp` `Space` | Next / previous slide |
| `P` | Presentation mode (one slide, filling the window) |
| `F` | Fullscreen |
| `Home` `End` | First / last slide |
| `Esc` | Leave presentation mode |

The browser deck needs the internet once to fetch Playfair Display and Inter,
and falls back to Georgia and Segoe UI offline.

**PDF export:** `Ctrl+P` → *Save as PDF*, *Margins: None*, *Background
graphics: on*. Each slide prints as its own 1280 × 720 page.

---

## The website

`site/` is a plain static site: three pages, one stylesheet, one script, no
build step for the pages themselves.

| Page | What it carries |
|---|---|
| `index.html` | The pitch, written for the web: the showreel, stills, product in and campaign out (rotating through the projects), services, process, ways to work together, questions. |
| `portfolio.html` | The deck itself, slide for slide, with every film playable where it sits on its slide. |
| `contact.html` | Email and Instagram buttons, a short brief form, what happens after. |
| `downloads/DARIA-AI-Creative-Studio-Portfolio.pdf` | The deck as a PDF, exported by PowerPoint. |

**The PowerPoint is the source of truth.** The portfolio page and the PDF are
exported from `DARIA AI Presentation 2026.pptx`, so they show the deck as it
looks in PowerPoint. The product cut-outs on the home page are taken from the
deck too, with the crops and transparent backgrounds made there. To build from
a different file, change `PPTX` at the top of `tools/build_site.py`. The browser deck in the project root (`index.html`,
`deck.css`) is an older draft and no longer matches it.

Preview locally with `python -m http.server 8778 --directory site`, then open
`http://localhost:8778`.

### After editing the deck

Save and close the PowerPoint, then run:

```bash
python tools/build_site.py deck
```

That opens the deck in PowerPoint (read-only, no window), exports each slide
and the PDF, finds where each film sits on its slide, and rewrites the slide
list inside `site/portfolio.html`. Nothing on that page needs hand editing.

The full set of steps:

```bash
pip install Pillow imageio-ffmpeg PyMuPDF python-pptx
python tools/build_site.py            # everything
python tools/build_site.py deck       # slides + PDF, from the PowerPoint
python tools/build_site.py images     # stills and product cut-outs on the home page
python tools/build_site.py video      # films, re-encoded for the web
python tools/build_site.py frames     # the stills taken from the films
```

`deck` needs PowerPoint on the machine. The films in the deck are matched to
the files in `Projects/` by size, so replacing a film means replacing it in
both places.

The home page is written by hand. If a project is added to or dropped from
the deck, update the stills row and the "You send / We deliver" panels in
`site/index.html` to match.

### Email and Instagram

The email address is never written into the pages. `site/assets/js/site.js`
puts it together only when a visitor presses **Email us**, so a harvester
reading the HTML finds nothing. To change the
address, edit `address()` in that file.

The build also keeps it off the portfolio page and out of the showreel:

- `deck` finds any slide text that looks like an email or phone number, paints
  it out of the exported slide images, and where the deck shows the address
  large (the closing slide) puts a **Start a project** button linking to the
  contact page instead.
- `video` covers the phone and email line on the showreel's end card
  (`FILM_MASKS` in `tools/build_site.py`). If the end card changes, adjust the
  box and start time there.

The PDF is the one place it remains, as text, because it is the deck exactly as
exported. Remove it from the PowerPoint and re-run `deck` if you want it gone
there too.

Every Instagram link takes its address from `INSTAGRAM` at the top of
`site/assets/js/site.js` (https://www.instagram.com/daria.studio.ai/). The links in the HTML carry the same address, so they work without JavaScript; change both if the handle changes.

### Deploying to Vercel

The project is on GitHub at
[rodrigoavf/DariaStudioAI](https://github.com/rodrigoavf/DariaStudioAI).
Vercel deploys it from there.

1. In Vercel, **Add New → Project**, and import `DariaStudioAI`.
2. Leave every setting at its default and press **Deploy**. `vercel.json` at
   the root already tells Vercel to serve the `site` folder, with no build
   step.

After that, each push to `main` publishes the site again.

`python tools/build_site.py icons` redraws the favicon and app icons.

`vercel.json` also gives clean URLs (`/portfolio`, `/contact`), long caching
for media, and makes the PDF download instead of opening in a tab.

**What is not in Git.** The PowerPoints and `Projects/` stay on this computer.
They are far over GitHub's 100 MB file limit, and the site only needs what
`tools/build_site.py` makes from them, which is committed in `site/`. The old
browser draft of the deck (`index.html`, `deck.css`, `deck.js`,
`build_pptx.py` in the root) is left out too, because it has the email and
phone in plain text and the repository is public. `.gitignore` lists all of
these.

To publish a change: edit, run the build step if the deck or media changed,
then commit and push.

```bash
git add -A
```

```bash
git commit -m "Describe the change"
```

```bash
git push
```

Once the site has a domain, change `og:image` in the three pages from
`/assets/og.jpg` to the full address (`https://your-domain/assets/og.jpg`) so
link previews show the image everywhere.

### The contact form

**Send brief** posts the form to `api/contact.js`, a Vercel serverless
function that emails the brief to the studio through
[Resend](https://resend.com). Pressing Reply on that email answers the person
who wrote. A hidden field turns away most bots, and the function only accepts
posts from the site itself.

It needs a one-time setup, because the address and the key cannot live in this
public repository:

1. Sign up at [resend.com](https://resend.com) **with the email that should
   receive briefs**. Until you verify a domain of your own, Resend can only
   deliver to the address the account was opened with.
2. In Resend, open **API Keys** and create a key with *Sending access*.
3. In Vercel, open the project, then **Settings → Environment Variables**, and
   add, for Production and Preview:
   - `RESEND_API_KEY`: the key from step 2
   - `CONTACT_TO`: the email that receives briefs
4. Redeploy: **Deployments**, the latest one, **⋯ → Redeploy**.

Send a test brief from the live contact page afterwards. If it fails, the
reason shows under **Logs** in the Vercel project.

Once the studio has its own domain, verify it in Resend and add
`CONTACT_FROM` (for example `DARIA <studio@your-domain>`) so briefs come from
your domain and can go to any inbox.

The form cannot send from a local preview (`python -m http.server` has no
functions), so it shows its error message there. That is expected.

---

## Rebuilding the PowerPoint

Only needed if you change `build_pptx.py` — edits made inside PowerPoint or
Google Slides will be overwritten by a rebuild, so work on a copy once you
start editing.

```bash
pip install python-pptx Pillow
python build_pptx.py
```

The script re-implements each layout in PowerPoint shapes using the same
constants as the CSS. It is visually matched, not a pixel-for-pixel conversion
of the HTML. Source images are centre-cropped and downscaled first, which keeps
the file near 2.7 MB instead of roughly 150 MB.

---

## Notes

Copy changes in the browser version live in `index.html` — each slide is a
commented `<div class="slide-frame">` block. Design changes go through the
tokens at the top of `deck.css`; `BRAND.md` says what each one governs. If you
want the two versions to stay identical, make the same edit in `build_pptx.py`.

Content in `Projects/*/Models/` is deliberately unused throughout the deck.
