/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");

    menu.classList.toggle("active");
}


function closeMenu() {
    const menu = document.getElementById("mobileMenu");

    menu.classList.remove("active");
}


/* =========================
   SMOOTH SCROLL
========================= */

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================
   START PLANNING
========================= */

function startPlanning() {
    window.location.href = "planner.html";
}


/* =========================
   SCROLL REVEAL
========================= */

const cards = document.querySelectorAll(
    ".agent-card, .step, .destination-card"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },
    {
        threshold: 0.12
    }
);


cards.forEach((card) => {

    card.style.opacity = "0";

    card.style.transform = "translateY(25px)";

    card.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(card);

});


/* =========================
   DASHBOARD LINK NAVIGATION
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const dashboardLinks = document.querySelectorAll('a[href="react-app/"], a[href="react-app"]');

    dashboardLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            // When already running under the Vite dev server (which hosts both index.html and React):
            // Dynamically navigate to the React dashboard root ('/') on the current origin and port.
            if (window.location.pathname.endsWith("index.html") && window.location.port && window.location.port.startsWith("517")) {
                e.preventDefault();
                window.location.href = window.location.origin + "/";
            }
        });
    });
});