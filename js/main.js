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
       MENÚ MOBILE
    ====================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    if (menuToggle && mainNav) {


        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mainNav.classList.toggle("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );

                document.body.style.overflow =
                    isOpen ? "hidden" : "";

            }
        );


        /* Cerrar al tocar un enlace */

        const navLinks =
            mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.style.overflow = "";

                }
            );

        });


        /* Cerrar con ESC */

        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    mainNav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.style.overflow = "";

                }

            }
        );


        /* Reset al volver a escritorio */

        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 800) {

                    mainNav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.style.overflow = "";

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
       GALERÍA PRODUCTO DESTACADO
    ====================================================== */

    const mainImage =
        document.getElementById("featuredMainImage");

    const thumbs =
        document.querySelectorAll(".featured-thumb");

    if (mainImage && thumbs.length) {

        thumbs.forEach(thumb => {

            thumb.addEventListener(
                "click",
                () => {

                    const full =
                        thumb.getAttribute("data-full");

                    if (!full) {
                        return;
                    }

                    mainImage.src = full;

                    thumbs.forEach(other => {

                        other.classList.remove("is-active");

                    });

                    thumb.classList.add("is-active");

                }
            );

        });

    }


    /* =====================================================
       CARRUSEL DE BENEFICIOS (DESTACADO)
    ====================================================== */

    const benefitsPanels =
        document.querySelectorAll(".benefits-panel");

    const benefitsDots =
        document.querySelectorAll(".benefits-dot");

    const benefitsImage =
        document.getElementById("benefitsImage");

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

            const activePanel = panelsArray[currentIndex];
            const image = activePanel.getAttribute("data-image");

            panelsArray.forEach((panel, i) => {

                const isTarget = i === currentIndex;

                panel.classList.toggle("is-active", isTarget);
                panel.hidden = !isTarget;

            });

            benefitsDots.forEach((dot, i) => {

                const isTarget = i === currentIndex;

                dot.classList.toggle("is-active", isTarget);
                dot.setAttribute("aria-selected", isTarget);

            });

            if (benefitsImage && image) {

                benefitsImage.classList.add("is-fading");

                window.setTimeout(() => {

                    benefitsImage.src = image;
                    benefitsImage.classList.remove("is-fading");

                }, 200);

            }

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

    }


    /* =====================================================
       ENLACES DIRECTOS A WHATSAPP
    ====================================================== */

    function buildWhatsAppUrl(message) {

        const base = `https://wa.me/${WHATSAPP_NUMBER}`;

        return message
            ? `${base}?text=${encodeURIComponent(message)}`
            : base;

    }

    document
        .querySelectorAll(".whatsapp-link")
        .forEach(link => {

            link.setAttribute(
                "href",
                buildWhatsAppUrl(
                    "¡Hola Bio Prana Vital! Quiero más información."
                )
            );

            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");

        });


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

    let cart = loadCart();

    const cartToggle = document.getElementById("cartToggle");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartClose = document.getElementById("cartClose");
    const cartItemsEl = document.getElementById("cartItems");
    const cartCountEl = document.getElementById("cartCount");
    const cartCheckoutBtn = document.getElementById("cartCheckout");
    const cartClearBtn = document.getElementById("cartClear");


    function openCart() {

        cartDrawer.classList.add("is-open");
        cartOverlay.classList.add("is-open");

        cartDrawer.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

    }

    function closeCart() {

        cartDrawer.classList.remove("is-open");
        cartOverlay.classList.remove("is-open");

        cartDrawer.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

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

                    const originalText = addBtn.textContent;

                    addBtn.textContent = "Agregado ✓";
                    addBtn.classList.add("is-added");

                    window.setTimeout(() => {

                        addBtn.textContent = originalText;
                        addBtn.classList.remove("is-added");

                    }, 1200);

                    showToast(name);

                });

            }

        });


    renderCart();

});
