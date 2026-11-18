/*
 * Freeze Bros – site scripts
 * Cart (saved in the browser), cart drawer, cart page, checkout and the
 * mobile menu. Plain JavaScript, no build step. Product data and settings
 * come from js/store-data.js.
 */
(function () {
  "use strict";

  var data = window.FreezeBrosData;
  if (!data) return;

  var settings = data.settings;
  var MAX_QTY = settings.maxQuantityPerItem;
  var STORAGE_KEY = "freezebros.cart.v1";
  var ORDERS_KEY = "freezebros.completed-orders";
  var docEl = document.documentElement;
  var root = docEl.getAttribute("data-root") || ""; // path back to the site root, e.g. "../"
  var page = docEl.getAttribute("data-page") || "";

  var productsBySlug = {};
  data.products.forEach(function (product) {
    productsBySlug[product.slug] = product;
  });

  /* ---------------- Helpers ---------------- */

  var moneyFormatter = new Intl.NumberFormat(settings.locale, {
    style: "currency",
    currency: settings.currency,
  });

  function formatPrice(cents) {
    return moneyFormatter.format(cents / 100);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function plural(count) {
    return count + " " + (count === 1 ? "item" : "items");
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      try {
        return window.crypto.randomUUID();
      } catch (error) {
        /* fall through */
      }
    }
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  var icons = {
    check:
      '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    checkLarge:
      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    plus: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    plusBold:
      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus:
      '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    truck:
      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    lock: '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>',
    lockSmall:
      '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>',
    spinner:
      '<svg class="icon spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
    bag: '<svg class="icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
    arrow:
      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  /* ---------------- Cart storage ---------------- */

  function clampQuantity(value) {
    var quantity = Math.floor(Number(value));
    if (!isFinite(quantity) || quantity < 1) return 1;
    return Math.min(MAX_QTY, quantity);
  }

  // Cleans up whatever is in storage: unknown products are dropped, duplicates
  // merged and quantities kept between 1 and the maximum.
  function normalizeCart(input) {
    if (!Array.isArray(input)) return [];
    var merged = {};
    var order = [];
    input.forEach(function (entry) {
      if (!entry || typeof entry !== "object") return;
      var slug = entry.slug;
      var quantity = Number(entry.quantity);
      if (typeof slug !== "string" || !productsBySlug[slug]) return;
      if (!isFinite(quantity) || quantity < 1) return;
      if (!merged[slug]) order.push(slug);
      merged[slug] = clampQuantity((merged[slug] || 0) + quantity);
    });
    return order.map(function (slug) {
      return { slug: slug, quantity: merged[slug] };
    });
  }

  function readCart() {
    try {
      return normalizeCart(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (error) {
      return [];
    }
  }

  var cart = readCart();

  function saveCart(next) {
    cart = next;
    try {
      if (cart.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Storage can be unavailable (e.g. strict privacy modes). The cart still
      // works for this visit, it just won't be saved.
    }
    render();
  }

  // Keep every open tab in sync.
  window.addEventListener("storage", function (event) {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cart = readCart();
    render();
  });

  function getLines() {
    var lines = [];
    cart.forEach(function (item) {
      var product = productsBySlug[item.slug];
      if (!product) return;
      lines.push({ product: product, quantity: item.quantity, total: product.price * item.quantity });
    });
    return lines;
  }

  function getCount() {
    return cart.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
  }

  function getSubtotal(lines) {
    return lines.reduce(function (sum, line) {
      return sum + line.total;
    }, 0);
  }

  function getShipping(subtotal) {
    if (subtotal <= 0) return 0;
    return subtotal >= settings.shipping.freeThreshold ? 0 : settings.shipping.flatRate;
  }

  /* ---------------- Cart actions ---------------- */

  var lastAddedSlug = null;

  function addItem(slug, quantity) {
    var product = productsBySlug[slug];
    if (!product || !product.inStock) return;
    var before = 0;
    var next = cart.map(function (item) {
      if (item.slug !== slug) return item;
      before = item.quantity;
      return { slug: slug, quantity: clampQuantity(item.quantity + quantity) };
    });
    if (!before) next.push({ slug: slug, quantity: clampQuantity(quantity) });
    var after = next.filter(function (item) {
      return item.slug === slug;
    })[0].quantity;

    lastAddedSlug = slug;
    saveCart(next);
    bumpCount();
    announce(
      after > before
        ? "Added " +
            (after - before) +
            " × " +
            product.name +
            " to your cart. Your cart has " +
            plural(getCount()) +
            "."
        : "You already have the maximum of " + MAX_QTY + " " + product.name + " in your cart.",
    );
    openDrawer(true);
  }

  function setQuantity(slug, quantity) {
    saveCart(
      cart.map(function (item) {
        return item.slug === slug ? { slug: slug, quantity: clampQuantity(quantity) } : item;
      }),
    );
  }

  function removeItem(slug) {
    var product = productsBySlug[slug];
    saveCart(
      cart.filter(function (item) {
        return item.slug !== slug;
      }),
    );
    if (product) announce("Removed " + product.name + " from your cart.");
  }

  function clearCart() {
    saveCart([]);
  }

  /* ---------------- Announcements (screen readers) ---------------- */

  function announce(message) {
    var regions = document.querySelectorAll("[data-live]");
    Array.prototype.forEach.call(regions, function (region) {
      region.textContent = message;
    });
  }

  /* ---------------- Rendering ---------------- */

  function lineHtml(line) {
    var product = line.product;
    var href = root + product.url;
    var key = product.slug;
    return (
      '<li class="cart-line">' +
      '<a class="cart-line__image" href="' +
      href +
      '" tabindex="-1" aria-hidden="true" style="--from:' +
      product.theme[0] +
      ";--to:" +
      product.theme[1] +
      '">' +
      '<img src="' +
      root +
      product.image +
      '" alt="" width="112" height="112" loading="lazy">' +
      "</a>" +
      '<div class="cart-line__info">' +
      '<div class="cart-line__top">' +
      "<div>" +
      '<a class="cart-line__name" href="' +
      href +
      '">' +
      escapeHtml(product.name) +
      "</a>" +
      '<p class="cart-line__meta">' +
      escapeHtml(product.size) +
      " · " +
      formatPrice(product.price) +
      " each</p>" +
      "</div>" +
      '<p class="cart-line__total tabular">' +
      formatPrice(line.total) +
      "</p>" +
      "</div>" +
      '<div class="cart-line__actions">' +
      '<div class="qty qty--small" role="group" aria-label="Quantity for ' +
      escapeHtml(product.name) +
      '">' +
      '<button type="button" class="qty__btn" data-cart-qty="' +
      key +
      '" data-delta="-1" data-focus-key="dec-' +
      key +
      '" aria-label="Decrease quantity" aria-disabled="' +
      (line.quantity <= 1) +
      '">' +
      icons.minus +
      "</button>" +
      '<output class="qty__value" aria-live="polite"><span class="sr-only">Quantity: </span>' +
      line.quantity +
      "</output>" +
      '<button type="button" class="qty__btn" data-cart-qty="' +
      key +
      '" data-delta="1" data-focus-key="inc-' +
      key +
      '" aria-label="Increase quantity" aria-disabled="' +
      (line.quantity >= MAX_QTY) +
      '">' +
      icons.plus +
      "</button>" +
      "</div>" +
      '<button type="button" class="remove-btn" data-remove="' +
      key +
      '">Remove<span class="sr-only"> ' +
      escapeHtml(product.name) +
      "</span></button>" +
      "</div>" +
      "</div>" +
      "</li>"
    );
  }

  function freeShippingHtml(subtotal) {
    var threshold = settings.shipping.freeThreshold;
    var remaining = Math.max(0, threshold - subtotal);
    var percent = Math.max(4, Math.min(100, Math.round((subtotal / threshold) * 100)));
    var unlocked = remaining === 0;
    return (
      '<div class="free-shipping' +
      (unlocked ? " is-unlocked" : "") +
      '">' +
      "<p>" +
      icons.truck +
      (unlocked
        ? "<span>Nice! Your order ships free.</span>"
        : '<span>Spend <span class="tabular">' + formatPrice(remaining) + "</span> more for free shipping</span>") +
      "</p>" +
      '<div class="free-shipping__track" aria-hidden="true"><div class="free-shipping__bar" style="width:' +
      percent +
      '%"></div></div>' +
      "</div>"
    );
  }

  function summaryHtml(subtotal) {
    var shipping = getShipping(subtotal);
    var demo = !settings.checkoutEndpoint;
    var busy = checkoutState.busy;
    return (
      '<dl class="totals">' +
      '<div><dt>Subtotal</dt><dd class="tabular">' +
      formatPrice(subtotal) +
      "</dd></div>" +
      '<div><dt>Shipping</dt><dd class="tabular">' +
      (shipping === 0 ? '<span class="free">Free</span>' : formatPrice(shipping)) +
      "</dd></div>" +
      '<div class="totals__grand"><dt>Total</dt><dd class="tabular">' +
      formatPrice(subtotal + shipping) +
      "</dd></div>" +
      "</dl>" +
      '<p class="tax-note">All prices are in ' +
      escapeHtml(settings.currency) +
      " and include GST.</p>" +
      '<button type="button" class="btn btn-primary btn-lg btn-block checkout-btn" data-checkout data-focus-key="checkout"' +
      (busy ? " disabled" : "") +
      ">" +
      (busy ? icons.spinner + "Taking you to checkout…" : icons.lock + "Checkout") +
      "</button>" +
      (checkoutState.error
        ? '<p class="checkout-error" role="alert">' + escapeHtml(checkoutState.error) + "</p>"
        : "") +
      '<p class="secure-note">' +
      icons.lockSmall +
      (demo ? "Demo store: no payment will be taken" : "Secure checkout powered by Stripe") +
      "</p>"
    );
  }

  // Re-render a container while keeping keyboard focus and scroll position.
  // If the focused control no longer exists (e.g. an item was removed), focus
  // moves to the element matching fallbackSelector instead.
  function renderInto(container, html, scrollSelector, fallbackSelector) {
    var active = document.activeElement;
    var focusKey = active && container.contains(active) ? active.getAttribute("data-focus-key") : null;
    var hadFocus = active && container.contains(active);
    var scroller = scrollSelector ? container.querySelector(scrollSelector) : null;
    var scrollTop = scroller ? scroller.scrollTop : 0;

    container.innerHTML = html;

    var newScroller = scrollSelector ? container.querySelector(scrollSelector) : null;
    if (newScroller) newScroller.scrollTop = scrollTop;
    if (hadFocus) {
      var target = focusKey ? container.querySelector('[data-focus-key="' + focusKey + '"]') : null;
      if (!target && fallbackSelector) target = document.querySelector(fallbackSelector);
      if (target) target.focus();
    }
  }

  function renderBadge() {
    var count = getCount();
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count]"), function (badge) {
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.hidden = count === 0;
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count-label]"), function (label) {
      label.textContent = count > 0 ? ", " + plural(count) : "";
    });
  }

  function bumpCount() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count]"), function (badge) {
      badge.classList.remove("is-bumped");
      void badge.offsetWidth; // restart the animation
      badge.classList.add("is-bumped");
    });
  }

  var drawer = document.querySelector("[data-cart-drawer]");
  var drawerContent = drawer ? drawer.querySelector("[data-drawer-content]") : null;
  var drawerCountPill = drawer ? drawer.querySelector("[data-cart-title-count]") : null;

  function renderDrawer() {
    if (!drawer || !drawerContent) return;
    var lines = getLines();
    var count = getCount();
    if (drawerCountPill) {
      drawerCountPill.textContent = String(count);
      drawerCountPill.hidden = count === 0;
    }

    if (!lines.length) {
      drawer.removeAttribute("aria-describedby");
      renderInto(
        drawerContent,
        '<div class="empty-state">' +
          '<span class="empty-state__icon">' +
          icons.bag +
          "</span>" +
          '<div><p class="empty-state__title">Your cart is empty</p><p class="empty-state__text">Let’s fix that. Our treats are waiting!</p></div>' +
          '<a class="btn btn-primary" href="' +
          root +
          'shop.html">Start shopping</a>' +
          "</div>",
        null,
        "#cart-drawer-title",
      );
      return;
    }

    var subtotal = getSubtotal(lines);
    var added =
      lastAddedSlug &&
      productsBySlug[lastAddedSlug] &&
      cart.some(function (item) {
        return item.slug === lastAddedSlug;
      })
        ? productsBySlug[lastAddedSlug]
        : null;

    if (added) drawer.setAttribute("aria-describedby", "cart-drawer-added");
    else drawer.removeAttribute("aria-describedby");

    renderInto(
      drawerContent,
      '<div class="drawer__body">' +
        (added
          ? '<p class="added-banner" id="cart-drawer-added"><span class="added-banner__tick">' +
            icons.check +
            "</span>Added " +
            escapeHtml(added.name) +
            " to your cart</p>"
          : "") +
        freeShippingHtml(subtotal) +
        '<ul class="cart-lines">' +
        lines.map(lineHtml).join("") +
        "</ul>" +
        "</div>" +
        '<div class="drawer__footer">' +
        summaryHtml(subtotal) +
        '<a class="drawer__link" href="' +
        root +
        'cart.html">View full cart</a>' +
        "</div>",
      ".drawer__body",
      "#cart-drawer-title",
    );
  }

  var cartPage = document.querySelector("[data-cart-page]");

  function renderCartPage() {
    if (!cartPage) return;
    var lines = getLines();
    var count = getCount();
    var heading = '<h1 id="cart-heading" tabindex="-1">Your cart</h1>';

    if (!lines.length) {
      renderInto(
        cartPage,
        heading +
          '<div class="card cart-empty">' +
          '<span class="empty-state__icon">' +
          icons.bag +
          "</span>" +
          "<h2>Your cart is empty</h2>" +
          "<p>Looks like you haven’t added anything yet. Find your new favourite crunchy treat.</p>" +
          '<a class="btn btn-primary" href="' +
          root +
          'shop.html">Start shopping ' +
          icons.arrow +
          "</a>" +
          "</div>",
        null,
        "#cart-heading",
      );
      return;
    }

    var subtotal = getSubtotal(lines);
    renderInto(
      cartPage,
      '<div class="cart-page__top">' +
        heading +
        '<p class="cart-page__count">' +
        plural(count) +
        "</p></div>" +
        '<div class="cart-layout">' +
        '<section class="card cart-items" aria-label="Items in your cart"><ul class="cart-lines cart-lines--large">' +
        lines.map(lineHtml).join("") +
        "</ul></section>" +
        '<aside class="card summary" aria-label="Order summary"><h2>Order summary</h2>' +
        freeShippingHtml(subtotal) +
        summaryHtml(subtotal) +
        "</aside>" +
        "</div>" +
        '<a class="back-link" href="' +
        root +
        'shop.html">' +
        icons.arrow +
        "Keep shopping</a>",
      null,
      "#cart-heading",
    );
  }

  function render() {
    renderBadge();
    renderDrawer();
    renderCartPage();
  }

  /* ---------------- Dialogs (cart drawer + mobile menu) ---------------- */

  // While a panel is open the page stops scrolling, which hides the scrollbar
  // on Windows. Padding the page by the same width stops it shifting.
  function rememberScrollbarWidth() {
    var width = Math.max(0, window.innerWidth - docEl.clientWidth);
    docEl.style.setProperty("--scrollbar-width", width + "px");
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    rememberScrollbarWidth();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  // Close a dialog when its dimmed backdrop is clicked (not when dragging out of it).
  function closeOnBackdropClick(dialog) {
    var downOnBackdrop = false;
    dialog.addEventListener("pointerdown", function (event) {
      downOnBackdrop = event.target === dialog;
    });
    dialog.addEventListener("click", function (event) {
      if (downOnBackdrop && event.target === dialog) closeDialog(dialog);
      downOnBackdrop = false;
    });
  }

  function openDrawer(fromAdd) {
    if (!drawer) return;
    if (!fromAdd) lastAddedSlug = null;
    renderDrawer();
    openDialog(drawer);
  }

  if (drawer) {
    closeOnBackdropClick(drawer);
    drawer.addEventListener("close", function () {
      lastAddedSlug = null;
    });
  }

  var menu = document.querySelector("[data-menu]");
  if (menu) {
    closeOnBackdropClick(menu);
    if (window.matchMedia) {
      var desktop = window.matchMedia("(min-width: 1024px)");
      var onChange = function (event) {
        if (event.matches) closeDialog(menu);
      };
      if (desktop.addEventListener) desktop.addEventListener("change", onChange);
      else if (desktop.addListener) desktop.addListener(onChange);
    }
  }

  /* ---------------- Checkout ---------------- */

  var checkoutState = { busy: false, error: "" };

  function setCheckoutState(next) {
    checkoutState = next;
    renderDrawer();
    renderCartPage();
  }

  function startCheckout() {
    if (checkoutState.busy || !cart.length) return;

    // Demo mode: no Stripe endpoint set yet, so skip payment.
    if (!settings.checkoutEndpoint) {
      setCheckoutState({ busy: true, error: "" });
      window.location.href = root + "checkout-success.html?demo=" + encodeURIComponent(makeId());
      return;
    }

    setCheckoutState({ busy: true, error: "" });
    fetch(settings.checkoutEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (body) {
            if (!response.ok || typeof body.url !== "string") {
              throw {
                userMessage:
                  typeof body.error === "string"
                    ? body.error
                    : "Something went wrong starting checkout. Please try again.",
              };
            }
            window.location.href = body.url; // Stripe's secure payment page
          });
      })
      .catch(function (error) {
        // Messages from our checkout code are shown as-is; anything else is a connection problem.
        var message =
          error && typeof error.userMessage === "string"
            ? error.userMessage
            : "We couldn’t reach checkout. Check your connection and try again.";
        setCheckoutState({ busy: false, error: message });
      });
  }

  // Coming back from Stripe with the back button can restore this page from
  // the browser's cache with the button still "loading". Reset it.
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      cart = readCart();
      checkoutState = { busy: false, error: "" };
      render();
    }
  });

  /* ---------------- Product page quantity picker ---------------- */

  function updateStepper(stepper, value) {
    var output = stepper.querySelector("[data-qty-value]");
    if (output) output.textContent = String(value);
    stepper.setAttribute("data-value", String(value));
    Array.prototype.forEach.call(stepper.querySelectorAll("[data-step]"), function (button) {
      var step = Number(button.getAttribute("data-step"));
      var atLimit = step < 0 ? value <= 1 : value >= MAX_QTY;
      button.setAttribute("aria-disabled", atLimit ? "true" : "false");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-stepper]"), function (stepper) {
    updateStepper(stepper, 1);
  });

  /* ---------------- Add to cart button feedback ---------------- */

  function flashAdded(button) {
    var label = button.querySelector("[data-label]");
    if (!label) return;
    if (!button.hasAttribute("data-original-label")) button.setAttribute("data-original-label", label.innerHTML);
    label.innerHTML = icons.checkLarge + "Added";
    clearTimeout(button._addedTimer);
    button._addedTimer = setTimeout(function () {
      label.innerHTML = button.getAttribute("data-original-label");
    }, 2000);
  }

  /* ---------------- Click handling ---------------- */

  document.addEventListener("click", function (event) {
    var target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    var addButton = target.closest("[data-add-to-cart]");
    if (addButton) {
      if (addButton.disabled) return;
      var quantity = 1;
      var purchase = addButton.closest("[data-purchase]");
      var stepper = purchase ? purchase.querySelector("[data-stepper]") : null;
      if (stepper) quantity = clampQuantity(stepper.getAttribute("data-value") || 1);
      flashAdded(addButton);
      addItem(addButton.getAttribute("data-add-to-cart"), quantity);
      return;
    }

    var stepButton = target.closest("[data-step]");
    if (stepButton) {
      var ownStepper = stepButton.closest("[data-stepper]");
      if (!ownStepper || stepButton.getAttribute("aria-disabled") === "true") return;
      var current = clampQuantity(ownStepper.getAttribute("data-value") || 1);
      updateStepper(ownStepper, clampQuantity(current + Number(stepButton.getAttribute("data-step"))));
      return;
    }

    var qtyButton = target.closest("[data-cart-qty]");
    if (qtyButton) {
      if (qtyButton.getAttribute("aria-disabled") === "true") return;
      var slug = qtyButton.getAttribute("data-cart-qty");
      var item = cart.filter(function (entry) {
        return entry.slug === slug;
      })[0];
      if (item) setQuantity(slug, item.quantity + Number(qtyButton.getAttribute("data-delta")));
      return;
    }

    var removeButton = target.closest("[data-remove]");
    if (removeButton) {
      removeItem(removeButton.getAttribute("data-remove")); // focus then moves to the heading
      return;
    }

    if (target.closest("[data-checkout]")) {
      startCheckout();
      return;
    }

    if (target.closest("[data-open-cart]")) {
      openDrawer(false);
      return;
    }

    if (target.closest("[data-close-drawer]")) {
      closeDialog(drawer);
      return;
    }

    if (target.closest("[data-open-menu]")) {
      openDialog(menu);
      return;
    }

    if (target.closest("[data-close-menu]")) {
      closeDialog(menu);
      return;
    }

    // Close a panel when one of its links is followed.
    var link = target.closest("a[href]");
    if (link) {
      var dialog = link.closest("dialog");
      if (dialog) closeDialog(dialog);
    }
  });

  /* ---------------- Keep shown prices and stock in step with store-data.js ---------------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-price-for]"), function (element) {
    var product = productsBySlug[element.getAttribute("data-price-for")];
    if (product) element.textContent = formatPrice(product.price);
  });

  data.products.forEach(function (product) {
    if (product.inStock) return;
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-add-to-cart="' + product.slug + '"]'),
      function (button) {
        button.disabled = true;
        var label = button.querySelector("[data-label]");
        if (label) label.textContent = "Sold out";
      },
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-stock-for="' + product.slug + '"]'),
      function (element) {
        element.textContent = "Sold out";
        element.classList.add("is-sold-out");
      },
    );
  });

  /* ---------------- Order confirmation page ---------------- */

  if (page === "checkout-success") {
    var params = new URLSearchParams(window.location.search);
    var sessionId = params.get("session_id");
    var demoId = params.get("demo");
    var status = "none";
    var orderId = null;

    if (sessionId && /^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      status = "paid";
      orderId = sessionId;
    } else if (demoId && !settings.checkoutEndpoint && /^[A-Za-z0-9-]{8,64}$/.test(demoId)) {
      status = "demo";
      orderId = "demo-" + demoId;
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-status]"), function (block) {
      block.hidden = block.getAttribute("data-status") !== status;
    });

    var reference = document.querySelector("[data-order-reference]");
    if (reference && status === "paid") reference.textContent = sessionId.slice(-8).toUpperCase();

    // Empty the cart once per order, so revisiting this page never wipes a new cart.
    if (orderId) {
      var completed = [];
      try {
        var saved = JSON.parse(window.localStorage.getItem(ORDERS_KEY) || "[]");
        if (Array.isArray(saved))
          completed = saved.filter(function (id) {
            return typeof id === "string";
          });
      } catch (error) {
        /* ignore unreadable storage */
      }
      if (completed.indexOf(orderId) === -1) {
        clearCart();
        try {
          window.localStorage.setItem(ORDERS_KEY, JSON.stringify(completed.concat(orderId).slice(-20)));
        } catch (error) {
          /* storage unavailable */
        }
      }
    }
  }

  /* ---------------- Footer year ---------------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (element) {
    element.textContent = String(new Date().getFullYear());
  });

  render();
})();
