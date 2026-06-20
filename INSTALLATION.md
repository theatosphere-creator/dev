# Installation Guide — Aether Electronics

This guide walks you through installing and configuring the **Aether Electronics** Shopify theme.

---

## 1. Requirements

- An active Shopify store (any plan).
- Admin access to **Online Store → Themes**.
- The packaged file: **`Aether-Electronics-Shopify-Theme.zip`**.

---

## 2. Upload the theme (ZIP method — recommended)

1. Log in to your **Shopify Admin**.
2. Go to **Online Store → Themes**.
3. In the **Theme library** area, click **Add theme → Upload zip file**.
4. Select **`Aether-Electronics-Shopify-Theme.zip`** and click **Upload file**.
5. Wait for Shopify to process it. "Aether Electronics" appears in your theme library.
6. Click **Customize** to open the Theme Editor, or **⋯ → Preview** to preview first.
7. When you're happy, click **⋯ → Publish**.

> The ZIP is structured with `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, and `templates/` at the root — the exact format Shopify requires.

---

## 3. Alternative: install with Shopify CLI (for developers)

```bash
# Install the Shopify CLI if you don't have it
npm install -g @shopify/cli @shopify/theme

# From inside the unzipped theme folder
shopify theme push --store your-store.myshopify.com
# or to develop locally with hot reload:
shopify theme dev --store your-store.myshopify.com
```

---

## 4. First-time configuration

### a) Navigation menus
- **Online Store → Navigation**.
- Edit or create **Main menu** (handle `main-menu`). Add top-level items; add **nested** child links to power the **mega menu**.
- Create a **Footer menu** (handle `footer`) for the footer columns.

### b) Collections
Create these collections and add products:
- Category collections: `Earbuds`, `Headphones`, `Speakers`, `Smart Watches`, `Accessories`.
- Merchandising collections: `Best sellers`, `New arrivals`, `Trending`.

Then in the **Theme Editor**, open each homepage section (Featured categories, Best sellers, New arrivals, Trending) and pick the matching collection.

### c) Collection filters
1. Install the free **Shopify Search & Discovery** app.
2. Configure **Filters** (Price, Color, Availability, Vendor, and a Rating metafield if desired).
3. Filters automatically render in the collection sidebar.

### d) Product reviews (optional but recommended)
- Install **Judge.me**, **Loox**, or **Shopify Product Reviews**.
- Ratings on product cards and PDPs read the `reviews.rating` and `reviews.rating_count` metafields.
- The PDP "Product reviews" section also exposes an app embed slot.

### e) Theme settings
Open **Theme Editor → Theme settings**:
- **Colors** — brand palette (defaults match the Aether system).
- **Typography** — heading & body fonts and scale.
- **Layout** — page width, section spacing, grid gap, corner radii.
- **Product cards** — image ratio, vendor, rating, quick add, hover image.
- **Cart** — drawer vs page, note, coupon hint, shipping note, dynamic checkout, trust badges.
- **Social media** — your profile URLs.
- **SEO & Social sharing** — default OG image, Twitter handle, breadcrumbs.
- **Performance** — lazy loading and scroll animations toggles.

### f) Pages
Create these pages and assign templates from the page editor's **Theme template** dropdown:
- **About** → template `page.about`
- **Contact** → template `page.contact`
- Other info pages (Shipping, Returns, Warranty) → default `page`.

### g) Blog
- **Online Store → Blog posts** → create a blog (e.g. `News`) and posts. The theme styles listing and article pages automatically.

---

## 5. Customizing homepage sections

In the **Theme Editor** (Home template):
- **Add section** to insert any of the 15 sections.
- Drag to **reorder**.
- Click a section to edit its **blocks**, colors, text, spacing and images.
- Use **Add block** within sections (categories, promos, reviews, comparison columns, etc.).

Header and footer are **section groups** — edit them from the **Header** and **Footer** areas of the editor.

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| Upload rejected | Ensure you're uploading the provided ZIP (folders at root), not a nested folder. |
| Empty product sliders | Assign a collection with products in the section settings. |
| No filters on collections | Enable filters via Shopify Search & Discovery. |
| Mega menu not showing | Add nested child links to the main menu items. |
| Ratings not showing | Install a review app that writes `reviews.*` metafields. |

---

## 7. Support

This is a self-contained theme with no external runtime dependencies. For Liquid/section reference, see Shopify's [theme docs](https://shopify.dev/docs/themes).
