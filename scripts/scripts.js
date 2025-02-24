// ========================================
// Menú móvil
const initMobileMenu = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMain = document.querySelector(".nav-main");
    const navClose = document.querySelector(".nav-close");

    if (!menuToggle || !navMain) return;

    const closeMenu = () => {
        navMain.classList.remove("active");
        document.body.style.overflow = "";
    };

    menuToggle.addEventListener("click", () => {
        navMain.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    navClose?.addEventListener("click", closeMenu);

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-main") && !e.target.closest(".menu-toggle")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });
};

// Selecciona el CTA flotante
const floatingCta = document.getElementById("floatingCta");

// Función para mostrar el CTA después de hacer scroll
function showFloatingCta() {
    const scrollPosition = window.scrollY || window.pageYOffset;

    // Mostrar el CTA después de 200px de scroll
    if (scrollPosition > 200) {
        floatingCta.classList.add("visible");
    } else {
        floatingCta.classList.remove("visible");
    }
}

// Escuchar el evento de scroll
window.addEventListener("scroll", showFloatingCta);

// Mostrar el CTA en dispositivos móviles (opcional)
function isMobileDevice() {
    return window.innerWidth <= 768; // Ajusta el breakpoint si es necesario
}

if (isMobileDevice()) {
    floatingCta.classList.add("visible"); // Mostrar siempre en móviles
}

// Slider de testimonios
const initTestimonialSlider = () => {
    const slider = document.querySelector(".testimonio-slider");
    const cards = document.querySelectorAll(".testimonio-card");
    const dotsContainer = document.querySelector(".slider-dots");
    let currentIndex = 0;
    let autoplayInterval;

    if (!slider || cards.length === 0) return;

    const createDots = () => {
        dotsContainer.innerHTML = "";
        cards.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", `Ir al testimonio ${i + 1}`);
            dot.addEventListener("click", () => scrollToTestimonial(i));
            dotsContainer.appendChild(dot);
        });
    };

    const updateDots = (index) => {
        document.querySelectorAll(".slider-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    };

    const scrollToTestimonial = (index) => {
        currentIndex = index;
        const cardWidth = cards[0].offsetWidth + 40;
        slider.scrollTo({ left: cardWidth * index, behavior: "smooth" });
        updateDots(index);
    };

    const handleArrowClick = (direction) => {
        currentIndex =
            direction === "prev"
                ? Math.max(0, currentIndex - 1)
                : Math.min(cards.length - 1, currentIndex + 1);
        scrollToTestimonial(currentIndex);
    };

    const startAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            scrollToTestimonial(currentIndex);
        }, 8000);
    };

    document
        .querySelector(".prev-btn")
        ?.addEventListener("click", () => handleArrowClick("prev"));
    document
        .querySelector(".next-btn")
        ?.addEventListener("click", () => handleArrowClick("next"));
    slider.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
    slider.addEventListener("mouseleave", startAutoplay);
    window.addEventListener("resize", () => scrollToTestimonial(currentIndex));

    createDots();
    startAutoplay();
    updateDots(0);
};

// Animación de estadísticas
const animateStats = () => {
    const stats = document.querySelectorAll(".stat-num");
    if (stats.length === 0) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    if (stat.classList.contains("animated")) return;

                    stat.classList.add("animated");
                    const target = +stat.dataset.count;
                    const duration = 2000;
                    let start = null;

                    const animateCount = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        stat.textContent = Math.floor(percentage * target);
                        if (percentage < 1) {
                            window.requestAnimationFrame(animateCount);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    window.requestAnimationFrame(animateCount);
                    observer.unobserve(stat);
                }
            });
        },
        { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
    );

    stats.forEach((stat) => observer.observe(stat));
};

// Script para manejar submenús en móviles
document.querySelectorAll(".nav-dropbtn").forEach((button) => {
    button.addEventListener("click", () => {
        const dropdownContent = button.nextElementSibling;
        dropdownContent.style.display =
            dropdownContent.style.display === "block" ? "none" : "block";
    });
});

// Cerrar submenús al hacer clic fuera
document.addEventListener("click", (event) => {
    if (!event.target.matches(".nav-dropbtn")) {
        document.querySelectorAll(".nav-dropdown-content").forEach((content) => {
            content.style.display = "none";
        });
    }
});

// Smooth Scroll para enlaces
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
};

// Funcion para cambiar el idioma del sitio
function cambiarIdioma(idioma, nombreIdioma, claseBandera) {
    // Actualiza el label del botón con el idioma seleccionado
    document.getElementById('selected-language').textContent = nombreIdioma;

    // Actualiza la bandera del botón
    const selectedFlag = document.getElementById('selected-flag');
    selectedFlag.className = 'flag-icon ' + claseBandera;

    // Redirige a la versión del sitio en el idioma seleccionado
    switch (idioma) {
        case 'es':
            window.location.href = 'index.html';
            break;
        case 'en':
            window.location.href = 'idiomas/en/index.html';
            break;
        case 'fr':
            window.location.href = 'index.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Inicialización general
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initTestimonialSlider();
    animateStats();
    initSmoothScroll();
});
