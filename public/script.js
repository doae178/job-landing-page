// --------------------
// script.js
// --------------------

const form = document.getElementById("applicationForm");
const loader = document.querySelector(".loader");
const btnText = document.querySelector(".btn-text");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");

// --------------------
// Form submission
// --------------------
form.addEventListener("submit", async function (e) {
    e.preventDefault(); // On empêche la soumission par défaut temporairement

    // Vérifier si le reCAPTCHA est rempli
    const recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) {
        showToast("Please complete the reCAPTCHA!", false);
        return;
    }

    // Créer FormData pour envoyer les fichiers et champs
    const formData = new FormData(form);

    // Afficher loader et désactiver le texte du bouton
    loader.style.display = "inline-block";
    btnText.style.opacity = "0.6";

    try {
        // Envoyer le formulaire au backend
        const response = await fetch("/apply", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        showToast("Application submitted successfully!", true);
        form.reset();           // Réinitialiser le formulaire
        grecaptcha.reset();     // Reset reCAPTCHA
    } catch (err) {
        showToast(err.message, false);
    } finally {
        loader.style.display = "none";
        btnText.style.opacity = "1";
    }
});

// --------------------
// Fonction toast
// --------------------
function showToast(message, success = true) {
    toast.innerText = message;
    toast.style.background = success ? "#22c55e" : "#ef4444"; // vert ou rouge
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
// --------------------
// Voir plus / Voir moins
// --------------------
const showBtn = document.getElementById("showMoreBtn");
const fullDetails = document.querySelector(".job-details-full");

showBtn.addEventListener("click", () => {
    if (fullDetails.style.display === "none") {
        fullDetails.style.display = "block";
        showBtn.textContent = "See less";
    } else {
        fullDetails.style.display = "none";
        showBtn.textContent = "See More";
    }
});

// --------------------
// Toggle light/dark mode
// --------------------
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});
