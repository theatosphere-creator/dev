# Aether Electronics — Shopify Online Store 2.0 Theme

A premium, modern, conversion-focused Shopify theme for DTC electronics and audio brands (earbuds, headphones, speakers, smart watches, accessories). Built from scratch with original code — no copied assets, branding, or layouts.

> **Theme name:** Aether Electronics
> **Platform:** Shopify Online Store 2.0 (JSON templates + section groups)
> **Dependencies:** None (vanilla HTML, CSS, JavaScript + Shopify Liquid)

---

## Highlights

- **Online Store 2.0** architecture — JSON templates, section groups (header/footer), app blocks ready.
- **Fully customizable** in the Shopify Theme Editor — every homepage section supports drag & drop, blocks, color, typography and spacing controls.
- **Mobile-first**, responsive, accessible (skip links, ARIA labels, keyboard support).
- **Performance-minded** — lazy loading, responsive `srcset` images, deferred JS, no jQuery or heavy libraries, system/Shopify-hosted fonts.
- **SEO built-in** — JSON-LD schema (Organization, WebSite, Product, Article, FAQ), Open Graph, Twitter Cards, breadcrumbs, semantic markup.
- **Conversion features** — cart drawer, quick add, wishlist, sticky add-to-cart, dynamic/express checkout, trust badges, upsells.

---

## What's included

### Pages & templates
- **Home** with 15 modular sections
- **Collection** with filters (price, color, rating, availability, vendor), sorting, infinite scroll, quick add, wishlist, hover effects
- **Product** (PDP) with gallery + zoom + video, variant/color swatches, sticky mobile ATC, features, specs, comparison, warranty, shipping, FAQ, reviews, related & recently viewed
- **Cart** page + slide-out **cart drawer** with quantity updates, coupon hint, shipping note, upsell, trust badges
- **About** (story, mission, values, timeline, team, achievements)
- **Contact** (form, Google Map, FAQ, support)
- **Blog** listing + **Article** (categories, author, social sharing, related articles, comments)
- **Customer accounts** — login, register, forgot/reset/activate password, dashboard, order history, address management
- **Search**, **404**, **List collections**, **Gift card**, **Password** page

### Homepage sections
1. Announcement bar · 2. Sticky header (logo, search, mega menu, account, wishlist, cart drawer) · 3. Hero banner (image/video) · 4. Featured categories · 5. Best sellers slider · 6. New arrivals carousel · 7. Promotional banner grid · 8. Shop by lifestyle · 9. Product comparison · 10. Video showcase · 11. Trending products · 12. Customer reviews carousel · 13. Instagram feed · 14. Newsletter · 15. Footer

---

## Design system

| Token | Value |
|-------|-------|
| Primary | `#000000` |
| Secondary | `#111111` |
| Accent | `#FF4D00` |
| Background | `#FFFFFF` |
| Text | `#1A1A1A` |

Typography: bold geometric sans for headings, clean modern sans for body — fully swappable via the Theme Editor (`Typography` settings). All colors, spacing, radii and widths are editable under **Theme settings**.

---

## Folder structure

```
theme/
├── assets/        base.css, global.js
├── config/        settings_schema.json, settings_data.json
├── layout/        theme.liquid, password.liquid
├── locales/       en.default.json
├── sections/      all sections + header-group.json / footer-group.json
├── snippets/      card-product, icon, price, rating, facets, meta-tags, schema, cart drawer, etc.
└── templates/     index/product/collection/cart/blog/article/page(.about/.contact)/
                   search/list-collections/404/password/gift_card + customers/
```

---

## Installation

A packaged, upload-ready archive is provided:

**`Aether-Electronics-Shopify-Theme.zip`**

See [INSTALLATION.md](INSTALLATION.md) for full step-by-step instructions. Quick version:

1. Shopify Admin → **Online Store → Themes**.
2. **Add theme → Upload zip file** → select `Aether-Electronics-Shopify-Theme.zip`.
3. **Customize** to set your logo, menus, collections and content.
4. **Publish** when ready.

> Tip: the ZIP contains the theme folders at its root, exactly as Shopify expects.

---

## Post-install setup checklist

1. **Navigation** → create a `main-menu` (with nested links for the mega menu) and a `footer` menu.
2. **Collections** → create `Earbuds`, `Headphones`, `Speakers`, `Smart Watches`, `Accessories`, plus `Best sellers`, `New arrivals`, `Trending`. Assign them in the relevant homepage sections.
3. **Filters** → install/enable **Shopify Search & Discovery** to configure collection filters (price, color, availability, vendor, rating metafield).
4. **Reviews** → install a review app (Judge.me, Loox, or Shopify Product Reviews). The PDP and cards read the `reviews.rating` / `reviews.rating_count` metafields automatically.
5. **Social links** → add your URLs under **Theme settings → Social media**.
6. **SEO** → set a default social sharing image and Twitter handle under **Theme settings → SEO & Social sharing**.

---

## Performance notes (Core Web Vitals)

- Hero/above-the-fold images use `fetchpriority="high"`; everything else lazy loads.
- Images are served via Shopify CDN with responsive `srcset`/`sizes`.
- A single deferred JS file, no render-blocking scripts, no external dependencies.
- CSS is delivered as one stylesheet using design tokens (CSS custom properties).
- Fonts use `font_face` with `font-display: swap`.

For best Lighthouse results, compress source images before upload and keep installed apps minimal.

---

## License & content

All code is original and written for this theme. Replace demo placeholder copy/images with your own brand assets. Do not use any third-party trademarks.
