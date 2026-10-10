/* =====================================================
   CONFIGURACIÓN
====================================================== */

const WHATSAPP_NUMBER = "5492804829591";

const CART_STORAGE_KEY = "bpv-cart";


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       AÑO DEL FOOTER
    ====================================================== */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =====================================================
       HEADER AL HACER SCROLL
    ====================================================== */

    const header = document.getElementById("siteHeader");

    function updateHeader() {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    /* =====================================================
       BLOQUEO DE SCROLL (menú y carrito comparten el mismo)
    ====================================================== */

    function syncScrollLock() {

        const menuOpen =
            document.querySelector(".main-nav.open");

        const cartOpen =
            document.querySelector(".cart-drawer.is-open");

        const modalOpen =
            document.querySelector(".product-modal[open]");

        document.body.style.overflow =
            menuOpen || cartOpen || modalOpen ? "hidden" : "";

    }


    /* =====================================================
       MENÚ MOBILE
    ====================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    if (menuToggle && mainNav) {

        function setMenu(open) {

            mainNav.classList.toggle("open", open);

            header.classList.toggle("menu-open", open);

            menuToggle.setAttribute("aria-expanded", open);

            menuToggle.setAttribute(
                "aria-label",
                open ? "Cerrar menú" : "Abrir menú"
            );

            syncScrollLock();

        }


        menuToggle.addEventListener(
            "click",
            () => {

                setMenu(!mainNav.classList.contains("open"));

            }
        );


        /* Cerrar al tocar un enlace */

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => setMenu(false));

        });


        /* Cerrar con ESC */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    mainNav.classList.contains("open")
                ) {

                    setMenu(false);

                    menuToggle.focus();

                }

            }
        );


        /* Reset al volver a escritorio */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 800 &&
                    mainNav.classList.contains("open")
                ) {

                    setMenu(false);

                }

            }
        );

    }


    /* =====================================================
       ANIMACIONES DE ENTRADA
    ====================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       CARRUSEL DE BENEFICIOS (DESTACADO)
    ====================================================== */

    const benefitsPanels =
        document.querySelectorAll(".benefits-panel");

    const benefitsDots =
        document.querySelectorAll(".benefits-dot");

    const benefitsPrev =
        document.getElementById("benefitsPrev");

    const benefitsNext =
        document.getElementById("benefitsNext");

    if (benefitsPanels.length) {

        const panelsArray = Array.from(benefitsPanels);

        let currentIndex = panelsArray.findIndex(
            panel => panel.classList.contains("is-active")
        );

        if (currentIndex < 0) {
            currentIndex = 0;
        }

        function goToSlide(index) {

            const total = panelsArray.length;

            currentIndex = (index + total) % total;

            panelsArray.forEach((panel, i) => {

                const isTarget = i === currentIndex;

                panel.classList.toggle("is-active", isTarget);
                panel.inert = !isTarget;

            });

            benefitsDots.forEach((dot, i) => {

                const isTarget = i === currentIndex;

                dot.classList.toggle("is-active", isTarget);
                dot.setAttribute("aria-selected", isTarget);

            });

        }

        if (benefitsPrev) {

            benefitsPrev.addEventListener("click", () => {

                goToSlide(currentIndex - 1);

            });

        }

        if (benefitsNext) {

            benefitsNext.addEventListener("click", () => {

                goToSlide(currentIndex + 1);

            });

        }

        benefitsDots.forEach((dot, i) => {

            dot.addEventListener("click", () => {

                goToSlide(i);

            });

        });


        /* Cada slide trae su imagen con carga diferida: al terminar
           de cargar la página se piden todas, así el cambio de slide
           no muestra una imagen a medio bajar */

        window.addEventListener("load", () => {

            panelsArray.forEach(panel => {

                const img = panel.querySelector("img");

                if (img) {
                    img.loading = "eager";
                }

            });

        });

    }


    /* =====================================================
       WHATSAPP (los enlaces fijos ya vienen en el HTML;
       esto arma el mensaje del pedido del carrito)
    ====================================================== */

    function buildWhatsAppUrl(message) {

        const base = `https://wa.me/${WHATSAPP_NUMBER}`;

        return message
            ? `${base}?text=${encodeURIComponent(message)}`
            : base;

    }


    /* =====================================================
       TOASTS (aviso al agregar al carrito)
    ====================================================== */

    const toastStack = document.getElementById("toastStack");

    function showToast(name) {

        if (!toastStack) {
            return;
        }

        const toast = document.createElement("div");

        toast.className = "toast";

        toast.innerHTML = `
            <span class="toast-check">✓</span>
            <span>Agregado: <strong>${name}</strong></span>
            <button type="button" class="toast-view">Ver carrito</button>
        `;

        toastStack.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("is-visible");
        });

        toast
            .querySelector(".toast-view")
            .addEventListener("click", () => {

                openCart();
                dismiss();

            });

        const timer = window.setTimeout(dismiss, 3200);

        function dismiss() {

            window.clearTimeout(timer);

            toast.classList.remove("is-visible");

            window.setTimeout(() => toast.remove(), 300);

        }

    }


    /* =====================================================
       CARRITO DE COMPRAS
    ====================================================== */

    function loadCart() {

        try {

            const raw = localStorage.getItem(CART_STORAGE_KEY);

            return raw ? JSON.parse(raw) : {};

        } catch (error) {

            return {};

        }

    }

    function saveCart(cart) {

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            /* almacenamiento no disponible, seguimos igual */

        }

    }

    /* Catálogo actual, tomado de las tarjetas de producto.
       El carrito guardado solo conserva productos que siguen
       existiendo y toma nombre e imagen de acá, no del guardado. */

    const catalog = {};

    document
        .querySelectorAll("[data-product-id]")
        .forEach(productEl => {

            catalog[productEl.getAttribute("data-product-id")] = {
                name: productEl.getAttribute("data-product-name"),
                image: productEl.getAttribute("data-product-image")
            };

        });

    /* Las variantes (ej. terminaciones del humidificador) también
       son productos válidos del carrito */

    document
        .querySelectorAll("[data-variant-id]")
        .forEach(chip => {

            catalog[chip.getAttribute("data-variant-id")] = {
                name: chip.getAttribute("data-variant-name"),
                image: chip.getAttribute("data-variant-image")
            };

        });

    function sanitizeCart(saved) {

        const clean = {};

        Object.keys(saved || {}).forEach(id => {

            const qty = parseInt(saved[id] && saved[id].qty, 10);

            if (catalog[id] && qty > 0) {

                clean[id] = { ...catalog[id], qty };

            }

        });

        return clean;

    }

    let cart = sanitizeCart(loadCart());

    const cartToggle = document.getElementById("cartToggle");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartClose = document.getElementById("cartClose");
    const cartItemsEl = document.getElementById("cartItems");
    const cartCountEl = document.getElementById("cartCount");
    const cartCheckoutBtn = document.getElementById("cartCheckout");
    const cartClearBtn = document.getElementById("cartClear");


    let cartReturnFocus = null;

    function openCart() {

        cartReturnFocus = document.activeElement;

        cartDrawer.inert = false;

        cartDrawer.classList.add("is-open");
        cartOverlay.classList.add("is-open");

        cartToggle.setAttribute("aria-expanded", "true");

        syncScrollLock();

        cartClose.focus();

    }

    function closeCart() {

        if (!cartDrawer.classList.contains("is-open")) {
            return;
        }

        cartDrawer.classList.remove("is-open");
        cartOverlay.classList.remove("is-open");

        cartDrawer.inert = true;

        cartToggle.setAttribute("aria-expanded", "false");

        syncScrollLock();

        /* Si el foco venía de un toast que ya no existe, vuelve al ícono */

        const target =
            cartReturnFocus && document.body.contains(cartReturnFocus)
                ? cartReturnFocus
                : cartToggle;

        target.focus();

    }

    function cartTotalQty() {

        return Object.values(cart)
            .reduce((sum, item) => sum + item.qty, 0);

    }

    function renderCart() {

        const ids = Object.keys(cart);

        cartCountEl.textContent = cartTotalQty();

        if (!ids.length) {

            cartItemsEl.innerHTML =
                '<p class="cart-empty">Tu carrito está vacío.</p>';

            cartCheckoutBtn.disabled = true;

            saveCart(cart);

            return;

        }

        cartItemsEl.innerHTML = ids.map(id => {

            const item = cart[id];

            return `
                <div class="cart-item" data-id="${id}">
                    <img src="${item.image}" alt="">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <div class="qty-stepper" data-id="${id}">
                            <button type="button" class="qty-btn" data-action="decrease" aria-label="Restar cantidad">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button type="button" class="qty-btn" data-action="increase" aria-label="Sumar cantidad">+</button>
                        </div>
                    </div>
                    <button type="button" class="cart-item-remove" data-id="${id}" aria-label="Quitar del carrito">×</button>
                </div>
            `;

        }).join("");

        cartCheckoutBtn.disabled = false;

        saveCart(cart);

    }

    function addToCart(id, name, image, qty) {

        if (!cart[id]) {

            cart[id] = { name, image, qty: 0 };

        }

        cart[id].qty += qty;

        renderCart();

    }

    function setItemQty(id, qty) {

        if (!cart[id]) {
            return;
        }

        if (qty <= 0) {

            delete cart[id];

        } else {

            cart[id].qty = qty;

        }

        renderCart();

    }

    function removeItem(id) {

        delete cart[id];

        renderCart();

    }

    function clearCart() {

        cart = {};

        renderCart();

    }

    function buildOrderMessage() {

        const ids = Object.keys(cart);

        const lines = ids.map(id => {

            const item = cart[id];

            return `• ${item.name} x${item.qty}`;

        });

        return [
            "¡Hola Bio Prana Vital! 👋",
            "Quiero hacer este pedido:",
            "",
            ...lines,
            "",
            "¿Me ayudan a coordinar precio, forma de pago y envío?"
        ].join("\n");

    }


    if (cartToggle && cartDrawer) {

        cartToggle.addEventListener("click", openCart);
        cartClose.addEventListener("click", closeCart);
        cartOverlay.addEventListener("click", closeCart);

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeCart();
            }

            /* Mientras está abierto, Tab no sale del carrito */

            if (
                event.key === "Tab" &&
                cartDrawer.classList.contains("is-open")
            ) {

                const focusables = Array.from(
                    cartDrawer.querySelectorAll("button:not([disabled])")
                );

                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (event.shiftKey && document.activeElement === first) {

                    event.preventDefault();
                    last.focus();

                } else if (!event.shiftKey && document.activeElement === last) {

                    event.preventDefault();
                    first.focus();

                }

            }

        });

        cartClearBtn.addEventListener("click", clearCart);

        cartCheckoutBtn.addEventListener("click", () => {

            if (!Object.keys(cart).length) {
                return;
            }

            window.open(
                buildWhatsAppUrl(buildOrderMessage()),
                "_blank",
                "noopener"
            );

        });

        /* Cantidad +/- dentro del carrito y quitar ítems */

        cartItemsEl.addEventListener("click", event => {

            const qtyBtn = event.target.closest(".qty-btn");
            const removeBtn = event.target.closest(".cart-item-remove");

            if (qtyBtn) {

                const stepper = qtyBtn.closest(".qty-stepper");
                const id = stepper.getAttribute("data-id");
                const action = qtyBtn.getAttribute("data-action");
                const current = cart[id] ? cart[id].qty : 0;

                setItemQty(
                    id,
                    action === "increase" ? current + 1 : current - 1
                );

                return;

            }

            if (removeBtn) {

                removeItem(removeBtn.getAttribute("data-id"));

            }

        });

    }


    /* =====================================================
       SELECTORES DE CANTIDAD Y "AGREGAR AL CARRITO"
       (tarjetas de producto y sección destacada)
    ====================================================== */

    document
        .querySelectorAll("[data-product-id]")
        .forEach(productEl => {

            const stepper = productEl.querySelector(".qty-stepper");
            const qtyValueEl = stepper
                ? stepper.querySelector(".qty-value")
                : null;

            if (stepper && qtyValueEl) {

                stepper.addEventListener("click", event => {

                    const btn = event.target.closest(".qty-btn");

                    if (!btn) {
                        return;
                    }

                    let qty = parseInt(qtyValueEl.textContent, 10) || 1;

                    if (btn.getAttribute("data-action") === "increase") {

                        qty += 1;

                    } else {

                        qty = Math.max(1, qty - 1);

                    }

                    qtyValueEl.textContent = qty;

                });

            }

            const addBtn = productEl.querySelector('[data-action="add-to-cart"]');

            if (addBtn) {

                /* Texto original fijo: si se toca dos veces seguidas
                   no queda trabado en "Agregado ✓" */

                const originalText = addBtn.textContent.trim();

                let addedTimer = null;

                addBtn.addEventListener("click", () => {

                    const id = productEl.getAttribute("data-product-id");
                    const name = productEl.getAttribute("data-product-name");
                    const image = productEl.getAttribute("data-product-image");
                    const qty = qtyValueEl
                        ? parseInt(qtyValueEl.textContent, 10) || 1
                        : 1;

                    addToCart(id, name, image, qty);

                    if (qtyValueEl) {
                        qtyValueEl.textContent = "1";
                    }

                    addBtn.textContent = "Agregado ✓";
                    addBtn.classList.add("is-added");

                    window.clearTimeout(addedTimer);

                    addedTimer = window.setTimeout(() => {

                        addBtn.textContent = originalText;
                        addBtn.classList.remove("is-added");

                    }, 1200);

                    showToast(name);

                });

            }

        });



    /* =====================================================
       FILTROS DEL CATÁLOGO
    ====================================================== */

    const filterChips =
        document.querySelectorAll(".filter-chip");

    const productCards =
        document.querySelectorAll(".product-card");

    filterChips.forEach(chip => {

        chip.addEventListener("click", () => {

            const filter = chip.getAttribute("data-filter");

            filterChips.forEach(other => {

                const isTarget = other === chip;

                other.classList.toggle("is-active", isTarget);
                other.setAttribute("aria-pressed", isTarget);

            });

            productCards.forEach(card => {

                card.hidden =
                    filter !== "todos" &&
                    card.getAttribute("data-category") !== filter;

                /* Las tarjetas que aparecen se muestran sin esperar
                   la animación de entrada */

                card.classList.add("visible");

            });

        });

    });


    /* =====================================================
       VARIANTES (TERMINACIONES)
    ====================================================== */

    document
        .querySelectorAll(".product-variants")
        .forEach(group => {

            const card = group.closest(".product-card");
            const img = card.querySelector(".product-image img");
            const chips = group.querySelectorAll(".variant-chip");

            chips.forEach(chip => {

                chip.addEventListener("click", () => {

                    chips.forEach(other => {

                        const isTarget = other === chip;

                        other.classList.toggle("is-active", isTarget);
                        other.setAttribute("aria-pressed", isTarget);

                    });

                    card.setAttribute("data-product-id", chip.getAttribute("data-variant-id"));
                    card.setAttribute("data-product-name", chip.getAttribute("data-variant-name"));
                    card.setAttribute("data-product-image", chip.getAttribute("data-variant-image"));
                    card.setAttribute("data-detail-images", chip.getAttribute("data-variant-full"));

                    img.src = chip.getAttribute("data-variant-image");

                });

            });

        });


    /* =====================================================
       DETALLE DE PRODUCTO (VENTANA)
    ====================================================== */

    const productModal = document.getElementById("productModal");
    const productModalMedia = document.getElementById("productModalMedia");
    const productModalBody = document.getElementById("productModalBody");
    const productModalClose = document.getElementById("productModalClose");
    const productModalAdd = document.getElementById("productModalAdd");

    let modalCard = null;

    function openProductDetail(card) {

        modalCard = card;

        const images = card.getAttribute("data-detail-images").split("|");
        const alts = (card.getAttribute("data-detail-alts") || "").split("|");

        productModalMedia.innerHTML = "";

        images.forEach((src, i) => {

            const img = document.createElement("img");

            img.src = src;
            img.alt = alts[i] || "";

            productModalMedia.appendChild(img);

        });

        productModalBody.innerHTML =
            card.querySelector(".product-detail").innerHTML;

        const title = productModalBody.querySelector("h2");

        if (title) {
            title.id = "productModalTitle";
        }

        productModal.showModal();

        productModal.scrollTop = 0;

        syncScrollLock();

    }

    if (productModal && typeof productModal.showModal === "function") {

        document
            .querySelectorAll('[data-action="details"]')
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    openProductDetail(btn.closest(".product-card"));

                });

            });

        productModalClose.addEventListener("click", () => productModal.close());

        /* Clic afuera de la ventana: cierra */

        productModal.addEventListener("click", event => {

            if (event.target === productModal) {
                productModal.close();
            }

        });

        productModal.addEventListener("close", syncScrollLock);

        productModalAdd.addEventListener("click", () => {

            if (!modalCard) {
                return;
            }

            productModal.close();

            modalCard
                .querySelector('[data-action="add-to-cart"]')
                .click();

        });

    }


    renderCart();

});
