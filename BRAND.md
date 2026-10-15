# DARIA — visual identity

The system the deck is built on. Everything below is implemented as CSS custom
properties in `deck.css` and mirrored as constants in `build_pptx.py`, so the
browser deck and the PowerPoint stay in step.

---

## Name

**DARIA** — wordmark only, set in Playfair Display 600, letter-spacing `.01em`.
Always followed by the descriptor line:

```
AI CREATIVE STUDIO
```

Inter 500, 12px, uppercase, letter-spacing `.42em`, in terracotta. The wordmark
never appears without the descriptor on a title or closing slide.

Voice: **"we"** — a small studio, not an agency and not a person. Plain,
confident, no hype. Claims stay concrete and unquantified ("a fraction of a
traditional shoot's cost") because we have no figures to stand behind.

---

## Palette

Cream and clay carry roughly 90% of every slide. Accents are small and
deliberate — the restraint is what makes it read premium rather than loud.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FAF6F0` | The slide ground. Warm, not white. |
| `--sand` | `#F1E7DA` | Reference trays, brief panels, placeholder cards. |
| `--sand-deep` | `#E7D9C7` | The far end of placeholder gradients. |
| `--clay` | `#C9A98A` | Hairlines, footers, framing ticks, quiet numerals. |
| `--ink` | `#241C17` | Headlines and body. A warm near-black, never `#000`. |
| `--muted` | `#7A6A5C` | Captions, supporting copy, meta. |
| `--terracotta` | `#B9552F` | The single accent. Step numbers, labels, CTA, play mark. |
| `--pine` | `#1F4640` | Section dividers and the closing slide only. |
| `--gold` | `#C99A3E` | Eyebrows and the email on pine. Nothing else. |

**Rules of use**

- Terracotta appears at most twice per slide. If a third thing wants it, it
  isn't important enough.
- Pine is reserved for the two section dividers and the contact slide — three
  dark beats across 26 slides, so the deck breathes.
- Gold only ever sits on pine.
- Product imagery is never tinted, filtered or overlaid. The work speaks at
  full fidelity; the palette is the frame around it.

---

## Typography

| Use | Face | Spec |
|---|---|---|
| Headlines | Playfair Display 600 | 44px case titles, 60–112px statement slides, line-height 1.0–1.15, `-.01em` |
| Body | Inter 400 | 14–17px, line-height 1.45–1.55 |
| Lede | Inter 400 | 17px in `--ink`, one line where possible |
| Micro-labels | Inter 500 | 10–11px, uppercase, letter-spacing `.16–.18em` |
| Numerals (01–06) | Playfair Display 600 | 20–52px in terracotta |

Both faces are in the Google Slides font list, so the `.pptx` survives import.
Fallbacks: `Georgia, serif` and `Segoe UI, Arial`.

**Text discipline:** one headline plus at most ~25 words of body per work
slide. Case slides carry the brand name, a one-line brief, and the
`FINAL` / `REAL PRODUCT` labels. Nothing else.

---

## Layout

Fixed **1280 × 720** canvas (16:9). Margins 64px left/right, 44px top, 40px
bottom. 12-column grid, 24px gutters; media rows use a 16px gutter.

Case slides run on fixed vertical rhythm so every case feels like part of one
set:

```
44    top margin
126   head          (eyebrow · title · meta · one-line lede)
20    gap
451   body          ← --media-h; all media height is derived from this
16    gap
23    footer rail
40    bottom margin
```

Media widths are derived from that height, never from the image's own
dimensions: `width: calc(var(--media-h) * 9 / 16)` and so on. (Sizing a flex
item with `aspect-ratio` instead reserves a slot from the image's intrinsic
width, which silently breaks the row — see the comment in `deck.css`.)

Image cards: 2px radius, 1px hairline border, soft warm shadow
`0 18px 40px -24px rgba(60,40,25,.45)`.

Every slide carries a footer rail — hairline, `DARIA — AI CREATIVE STUDIO` or
`FINAL — AI GENERATED` on the left, slide number on the right.

---

## Recurring motifs

**The reference tray.** A sand-tinted panel labelled `REAL PRODUCT`, holding
the client's own catalogue shots beside the `FINAL — AI GENERATED` results.
This pairing is the deck's core proof device and appears on every case slide
that has references. It hugs its content rather than stretching, so a case with
two references doesn't leave a half-empty panel.

Where a case has no reference images (Cookies, Toothpaste), a **written brief
panel** takes its place — *Asked for / Given / Delivered* — so the rhythm holds
and the gap reads as a change of pace, not an omission.

**The video placeholder.** Films are never embedded. Each gets an aspect-locked
card in its true ratio, with corner framing ticks, a terracotta play mark, a
ratio badge top-left, a duration badge top-right, and the source path beneath.
Manucurist is the only 9:16 card in the deck, which gives that slide a
deliberately different shape from the five landscape films before it.

**The step rail.** On the workflow slides, all six steps run along the bottom
with the current two picked out in terracotta — so the buyer always knows where
they are in the process.
