// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});


// Close mobile menu when a link is clicked

const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});


// =========================
// APPOINTMENT FORM
// =========================

const appointmentForm = document.getElementById("appointmentForm");
const formMessage = document.getElementById("formMessage");

appointmentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;

    if (!name || !phone || !service || !date) {

        formMessage.textContent =
            "Molimo popunite sva obavezna polja.";
        formMessage.style.color = "#d9534f";

        return;
    }

    formMessage.textContent =
        `Hvala vam, ${name}! Vaš zahtjev za termin je spremljen.`;
    formMessage.style.color = "#2e7d32";
    appointmentForm.reset();

});


// =========================
// DATE VALIDATION
// =========================

const dateInput = document.getElementById("date");

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const todayFormatted = `${year}-${month}-${day}`;

dateInput.setAttribute("min", todayFormatted);