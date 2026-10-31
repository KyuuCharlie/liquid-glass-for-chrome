# Liquid Glass for Chrome

A lightweight browser extension that applies a restrained Liquid Glass / optical-material treatment to modern websites.

## 0.4.0 — Performance + YouTube

- Removed the full-document `MutationObserver`.
- A single injected stylesheet is updated only when extension settings change.
- Expensive `backdrop-filter` is restricted to explicit floating overlays instead of generic cards/layout containers.
- YouTube's guide/sidebar/masthead are explicitly protected from blur, clipping, transforms and pseudo-element overlays.
- Optical cues use gradients, inset highlights and shadows rather than continuous DOM effects.

### Install

Open `chrome://extensions` or `edge://extensions`, enable Developer mode, choose **Load unpacked**, and select this repository folder.

### Controls

The popup provides Subtle, Optical and Prismatic presets plus blur, transparency, saturation, edge light, refraction, caustics and bloom controls.

### Optical model

CSS cannot provide true arbitrary-page refraction or per-pixel chromatic aberration. The optical effect is intentionally simulated with compositing layers and backdrop filtering.

## Halloween easter egg 🎃

On any enabled page, type `spooky` (outside text fields) to reveal a small ghostly toast. Press Escape or wait a few seconds to dismiss it. It does not collect input or change page content.
