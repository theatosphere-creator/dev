/* =========================================================
   Aether Electronics — Global JavaScript
   Vanilla JS custom elements. No external dependencies.
   ========================================================= */
(function () {
  'use strict';

  const money = (cents) => {
    const value = (cents / 100).toFixed(2);
    return (window.Shopify && Shopify.currency ? '' : '') + '$' + value;
  };

  /* ---------- Toast ---------- */
  function toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('is-visible'), 3000);
  }
  window.aetherToast = toast;

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Generic open/close toggles ---------- */
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const target = document.getElementById(opener.getAttribute('data-open'));
      if (target) {
        target.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const target = closer.closest('.is-open') || document.getElementById(closer.getAttribute('data-close'));
      if (target) {
        target.classList.remove('is-open');
        document.body.style.overflow = '';
      }
      // also close linked overlay
      document.querySelectorAll('.drawer-overlay.is-open').forEach((o) => o.classList.remove('is-open'));
    }
    if (e.target.classList.contains('drawer-overlay') || e.target.classList.contains('search-modal')) {
      e.target.classList.remove('is-open');
      document.querySelectorAll('.is-open[data-drawer]').forEach((d) => d.classList.remove('is-open'));
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.is-open').forEach((el) => el.classList.remove('is-open'));
      document.body.style.overflow = '';
    }
  });

  /* ---------- Cart drawer opener ---------- */
  function openCartDrawer() {
    const drawer = document.querySelector('cart-drawer');
    const overlay = document.getElementById('CartDrawerOverlay');
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  window.openCartDrawer = openCartDrawer;

  /* ---------- Cart API helpers ---------- */
  async function fetchCart() {
    const res = await fetch(window.routes.cart_url + '.js');
    return res.json();
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  async function refreshCartDrawer() {
    try {
      const res = await fetch(window.routes.cart_url + '?section_id=cart-drawer');
      const text = await res.text();
      const html = new DOMParser().parseFromString(text, 'text/html');
      const newInner = html.querySelector('[data-cart-drawer-inner]');
      const current = document.querySelector('[data-cart-drawer-inner]');
      if (newInner && current) current.innerHTML = newInner.innerHTML;
      const cart = await fetchCart();
      updateCartCount(cart.item_count);
    } catch (e) { console.error(e); }
  }
  window.refreshCartDrawer = refreshCartDrawer;

  /* ---------- Add to cart ---------- */
  async function addToCart(formData, button) {
    if (button) { button.classList.add('is-loading'); button.disabled = true; }
    try {
      const res = await fetch(window.routes.cart_add_url, {
        method: 'POST',
        headers: { Accept: 'application/javascript' },
        body: formData
      });
      const data = await res.json();
      if (data.status) {
        toast(data.description || data.message || window.cartStrings.error);
      } else {
        await refreshCartDrawer();
        openCartDrawer();
      }
    } catch (e) {
      toast(window.cartStrings.error);
    } finally {
      if (button) { button.classList.remove('is-loading'); button.disabled = false; }
    }
  }
  window.aetherAddToCart = addToCart;

  // Product form submit
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-product-form], form[data-quick-add-form]');
    if (!form) return;
    e.preventDefault();
    addToCart(new FormData(form), form.querySelector('[type="submit"]'));
  });

  /* ---------- Cart line item updates (drawer + page) ---------- */
  async function changeCartLine(line, quantity) {
    const res = await fetch(window.routes.cart_change_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    });
    return res.json();
  }

  document.addEventListener('click', async (e) => {
    const qBtn = e.target.closest('[data-quantity-change]');
    if (qBtn) {
      const wrap = qBtn.closest('.quantity');
      const input = wrap.querySelector('.quantity__input');
      const dir = qBtn.getAttribute('data-quantity-change');
      let val = parseInt(input.value, 10) || 1;
      val = dir === 'increase' ? val + 1 : Math.max((input.min ? parseInt(input.min, 10) : 0), val - 1);
      input.value = val;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const remove = e.target.closest('[data-cart-remove]');
    if (remove) {
      e.preventDefault();
      const line = remove.getAttribute('data-cart-remove');
      await changeCartLine(line, 0);
      await refreshCartDrawer();
      if (document.body.classList.contains('template-cart')) window.location.reload();
    }
  });

  document.addEventListener('change', async (e) => {
    const input = e.target.closest('[data-cart-quantity]');
    if (!input) return;
    const line = input.getAttribute('data-cart-quantity');
    const qty = parseInt(input.value, 10);
    await changeCartLine(line, isNaN(qty) ? 0 : qty);
    await refreshCartDrawer();
    if (document.body.classList.contains('template-cart')) window.location.reload();
  });

  /* ---------- Wishlist (localStorage) ---------- */
  const WISHLIST_KEY = 'aether_wishlist';
  const getWishlist = () => JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  const setWishlist = (arr) => localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr));
  function refreshWishlistUI() {
    const list = getWishlist();
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const id = btn.getAttribute('data-wishlist-toggle');
      btn.classList.toggle('is-active', list.includes(id));
    });
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      el.textContent = list.length;
      el.hidden = list.length === 0;
    });
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist-toggle]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute('data-wishlist-toggle');
    let list = getWishlist();
    if (list.includes(id)) { list = list.filter((x) => x !== id); toast('Removed from wishlist'); }
    else { list.push(id); toast('Added to wishlist'); }
    setWishlist(list);
    refreshWishlistUI();
  });
  refreshWishlistUI();

  /* ---------- Recently viewed (product pages) ---------- */
  const RV_KEY = 'aether_recently_viewed';
  const rvHandle = document.body.getAttribute('data-product-handle');
  if (rvHandle) {
    let rv = JSON.parse(localStorage.getItem(RV_KEY) || '[]');
    rv = [rvHandle, ...rv.filter((h) => h !== rvHandle)].slice(0, 8);
    localStorage.setItem(RV_KEY, JSON.stringify(rv));
  }

  /* ---------- Slider controls ---------- */
  class SliderControls extends HTMLElement {
    connectedCallback() {
      this.slider = this.querySelector('[data-slider]');
      this.prev = this.querySelector('[data-slider-prev]');
      this.next = this.querySelector('[data-slider-next]');
      if (!this.slider) return;
      const scrollAmount = () => this.slider.querySelector(':scope > *') ?
        this.slider.querySelector(':scope > *').offsetWidth + 20 : 300;
      if (this.prev) this.prev.addEventListener('click', () => this.slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
      if (this.next) this.next.addEventListener('click', () => this.slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
      this.slider.addEventListener('scroll', () => this.updateButtons(), { passive: true });
      this.updateButtons();
    }
    updateButtons() {
      if (!this.prev || !this.next) return;
      const max = this.slider.scrollWidth - this.slider.clientWidth - 2;
      this.prev.disabled = this.slider.scrollLeft <= 2;
      this.next.disabled = this.slider.scrollLeft >= max;
    }
  }
  customElements.define('slider-controls', SliderControls);

  /* ---------- Product media gallery ---------- */
  class ProductGallery extends HTMLElement {
    connectedCallback() {
      this.thumbs = this.querySelectorAll('[data-media-thumb]');
      this.items = this.querySelectorAll('[data-media-item]');
      this.main = this.querySelector('[data-media-main]');
      this.thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => this.select(thumb.getAttribute('data-media-thumb')));
      });
      if (this.main) {
        this.main.addEventListener('click', (e) => this.zoom(e));
      }
    }
    select(id) {
      this.items.forEach((it) => it.classList.toggle('is-active', it.getAttribute('data-media-item') === id));
      this.thumbs.forEach((t) => t.classList.toggle('is-active', t.getAttribute('data-media-thumb') === id));
    }
    selectByVariantImage(mediaId) {
      if (mediaId) this.select(String(mediaId));
    }
    zoom(e) {
      const img = this.querySelector('.is-active img');
      if (!img) return;
      const active = this.main.classList.toggle('is-zoomed');
      if (active) {
        img.style.transform = 'scale(2)';
        img.style.transition = 'transform 0.2s ease';
        this.main.style.overflow = 'hidden';
        const move = (ev) => {
          const rect = this.main.getBoundingClientRect();
          const x = ((ev.clientX - rect.left) / rect.width) * 100;
          const y = ((ev.clientY - rect.top) / rect.height) * 100;
          img.style.transformOrigin = `${x}% ${y}%`;
        };
        this.main.addEventListener('mousemove', move);
        this.main._move = move;
      } else {
        img.style.transform = '';
        if (this.main._move) this.main.removeEventListener('mousemove', this.main._move);
      }
    }
  }
  customElements.define('product-gallery', ProductGallery);

  /* ---------- Variant selector ---------- */
  class VariantSelector extends HTMLElement {
    connectedCallback() {
      this.variants = JSON.parse(this.querySelector('[data-variants-json]').textContent);
      this.form = this.closest('form') || document.querySelector('form[data-product-form]');
      this.addEventListener('change', () => this.onChange());
    }
    getSelectedOptions() {
      return Array.from(this.querySelectorAll('input:checked, select')).map((el) => el.value);
    }
    onChange() {
      const selected = this.getSelectedOptions();
      const variant = this.variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
      const root = document.getElementById('ProductInfo') || document;
      if (!variant) {
        this.toggleUnavailable(true);
        return;
      }
      this.toggleUnavailable(false);
      // update hidden id field
      const idInput = this.form ? this.form.querySelector('input[name="id"]') : null;
      if (idInput) idInput.value = variant.id;
      // update url
      if (history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('variant', variant.id);
        history.replaceState({}, '', url);
      }
      // price
      const priceEl = root.querySelector('[data-product-price]');
      if (priceEl) priceEl.innerHTML = this.renderPrice(variant);
      // availability
      const submit = root.querySelector('[data-add-to-cart]');
      if (submit) {
        if (variant.available) { submit.disabled = false; submit.querySelector('span').textContent = 'Add to cart'; }
        else { submit.disabled = true; submit.querySelector('span').textContent = 'Sold out'; }
      }
      // sticky atc
      const stickyPrice = document.querySelector('[data-sticky-price]');
      if (stickyPrice) stickyPrice.innerHTML = this.renderPrice(variant);
      // gallery image
      if (variant.featured_media) {
        const gallery = document.querySelector('product-gallery');
        if (gallery) gallery.selectByVariantImage(variant.featured_media.id);
      }
      this.dispatchEvent(new CustomEvent('variant:change', { detail: { variant }, bubbles: true }));
    }
    renderPrice(variant) {
      if (variant.compare_at_price > variant.price) {
        return `<ins>${money(variant.price)}</ins> <del>${money(variant.compare_at_price)}</del> <span class="badge badge--sale">Sale</span>`;
      }
      return money(variant.price);
    }
    toggleUnavailable(state) {
      const submit = (document.getElementById('ProductInfo') || document).querySelector('[data-add-to-cart]');
      if (submit) {
        submit.disabled = state;
        if (state) submit.querySelector('span').textContent = 'Unavailable';
      }
    }
  }
  customElements.define('variant-selector', VariantSelector);

  /* ---------- Sticky add to cart (mobile PDP) ---------- */
  const stickyAtc = document.querySelector('.sticky-atc');
  if (stickyAtc) {
    const formAnchor = document.querySelector('[data-product-form]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        stickyAtc.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    if (formAnchor) io.observe(formAnchor);
  }

  /* ---------- Predictive search ---------- */
  class PredictiveSearch extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-predictive-results]');
      if (!this.input) return;
      let timer;
      this.input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.search(), 300);
      });
    }
    async search() {
      const q = this.input.value.trim();
      if (q.length < 2) { this.results.innerHTML = ''; return; }
      try {
        const url = `${window.routes.predictive_search_url}?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6&section_id=predictive-search`;
        const res = await fetch(url);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const content = doc.querySelector('[data-predictive-results]');
        this.results.innerHTML = content ? content.innerHTML : '';
      } catch (e) { /* noop */ }
    }
  }
  customElements.define('predictive-search', PredictiveSearch);

  /* ---------- Collection facets (auto submit) ---------- */
  const facetForm = document.querySelector('[data-facet-form]');
  if (facetForm) {
    facetForm.addEventListener('change', () => {
      if (facetForm.querySelector('[data-auto-submit]')) facetForm.submit();
    });
  }

  /* ---------- Infinite scroll for collections ---------- */
  const infinite = document.querySelector('[data-infinite-scroll]');
  if (infinite) {
    const sentinel = infinite.querySelector('[data-infinite-sentinel]');
    let loading = false;
    if (sentinel) {
      const io = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !loading) {
          const nextUrl = sentinel.getAttribute('data-next-url');
          if (!nextUrl) { io.disconnect(); return; }
          loading = true;
          try {
            const res = await fetch(nextUrl);
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const newItems = doc.querySelector('[data-product-grid]');
            const grid = infinite.querySelector('[data-product-grid]');
            if (newItems && grid) grid.insertAdjacentHTML('beforeend', newItems.innerHTML);
            const newSentinel = doc.querySelector('[data-infinite-sentinel]');
            if (newSentinel && newSentinel.getAttribute('data-next-url')) {
              sentinel.setAttribute('data-next-url', newSentinel.getAttribute('data-next-url'));
            } else {
              sentinel.removeAttribute('data-next-url');
              io.disconnect();
            }
          } catch (e) { /* noop */ }
          loading = false;
        }
      }, { rootMargin: '400px' });
      io.observe(sentinel);
    }
  }

  /* ---------- Scroll reveal animations ---------- */
  if (document.documentElement.classList.contains('js')) {
    const triggers = document.querySelectorAll('.scroll-trigger');
    if (triggers.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      triggers.forEach((t) => io.observe(t));
    }
  }

  /* ---------- Video showcase play ---------- */
  document.addEventListener('click', (e) => {
    const play = e.target.closest('[data-video-play]');
    if (!play) return;
    const wrap = play.closest('.video-showcase');
    const video = wrap.querySelector('video');
    if (video) { video.play(); play.style.display = 'none'; }
    const iframeSrc = play.getAttribute('data-video-src');
    if (iframeSrc) {
      const iframe = document.createElement('iframe');
      iframe.src = iframeSrc + (iframeSrc.includes('?') ? '&' : '?') + 'autoplay=1';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    }
  });

})();
