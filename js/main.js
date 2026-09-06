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
       PARALLAX
    ====================================================== */

    const parallaxSections =
        document.querySelectorAll(
            ".parallax-section"
        );


    function updateParallax() {

        if (window.innerWidth <= 800) {
            return;
        }

        const scrollPosition =
            window.scrollY;


        parallaxSections.forEach(section => {

            const rect =
                section.getBoundingClientRect();

            const sectionTop =
                rect.top + scrollPosition;

            const distance =
                scrollPosition - sectionTop;

            const movement =
                distance * 0.15;

            section.style.backgroundPosition =
                `center calc(50% + ${movement}px)`;

        });

    }


    window.addEventListener(
        "scroll",
        updateParallax,
        {
            passive: true
        }
    );


    updateParallax();

});