// Wait for the full DOM to load before selecting elements
window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");
    const phrases = ["Search for Raincoats", "Search for Dog Food", "Search for Cat Food", "Search for Shampoos"];
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;

    function typePlaceholder() {
        const currentText = phrases[currentPhrase];
        input.setAttribute("placeholder", currentText.substring(0, currentChar));

        if (!isDeleting && currentChar < currentText.length) {
            currentChar++;
        } else if (isDeleting && currentChar > 0) {
            currentChar--;
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) currentPhrase = (currentPhrase + 1) % phrases.length;
            setTimeout(typePlaceholder, 800);
            return;
        }

        setTimeout(typePlaceholder, isDeleting ? 60 : 100);
    }

    typePlaceholder();

    // Also add working event listeners here
    document.getElementById('search-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            alert(`Searching for: ${this.value}`);
        }
    });

    // document.getElementById('login-btn').addEventListener('click', () => {
    //     alert("Redirecting to Login Page...");
    // });

    // document.getElementById('cart-icon').addEventListener('click', () => {
    //     alert("Opening your shopping cart...");
    // });
});

// image slider
const images = [
    "https://headsupfortails.com/cdn/shop/files/Dog_toys_web_b1e6ec51-862b-4c11-a651-6ef170358ed9.webp?v=1747399634",
    "https://headsupfortails.com/cdn/shop/files/Hearty_web_33ced1d9-edda-45a6-a742-da4fe837fa0b.webp?v=1747399674",
    "https://headsupfortails.com/cdn/shop/files/mewosi_web.webp?v=1746773835",
    "https://headsupfortails.com/cdn/shop/files/DD_web_243716b3-807e-4246-81a6-69644f25bcb0.webp?v=1747819584"
];

const track = document.querySelector('.slider-track');
const currentImg = document.querySelector('.slide.current');
const nextImg = document.querySelector('.slide.next');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

let index = 0;
let isAnimating = false;

// Initial image
currentImg.src = images[index];

function slideToNext() {
    if (isAnimating) return;
    isAnimating = true;

    const nextIndex = (index + 1) % images.length;
    nextImg.src = images[nextIndex];

    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = 'translateX(-50%)';

    track.addEventListener('transitionend', () => {
        index = nextIndex;
        currentImg.src = images[index];
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        isAnimating = false;
    }, { once: true });
}

function slideToPrev() {
    if (isAnimating) return;
    isAnimating = true;

    const prevIndex = (index - 1 + images.length) % images.length;
    nextImg.src = images[prevIndex];

    // Move next image to the left side
    track.insertBefore(nextImg, currentImg);
    track.style.transition = 'none';
    track.style.transform = 'translateX(-50%)';

    // Force reflow
    void track.offsetWidth;

    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = 'translateX(0)';

    track.addEventListener('transitionend', () => {
        index = prevIndex;
        currentImg.src = images[index];

        // Move nextImg back to original position
        track.appendChild(nextImg);
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        isAnimating = false;
    }, { once: true });
}

rightBtn.addEventListener('click', (e) => {
    e.preventDefault();
    slideToNext();
});

leftBtn.addEventListener('click', (e) => {
    e.preventDefault();
    slideToPrev();
});


let lastScrollTop = 0;
const header = document.querySelector(".dropdown-header");

window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scrolling down
        header.classList.add("hide");
    } else {
        // Scrolling up
        header.classList.remove("hide");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});





function calculateBulk() {
    const qty = parseInt(document.getElementById("bulkQty").value) || 1;
    let unitPrice = 499;
    const originalPrice = 499;

    if (qty >= 10) unitPrice = 399;
    else if (qty >= 5) unitPrice = 449;

    const total = qty * unitPrice;
    const savings = (qty * originalPrice) - total;

    let message = `₹${total} (₹${unitPrice}/item)`;
    if (savings > 0) {
        message += ` — You saved ₹${savings}! 🎉`;
    }

    document.getElementById("bulkResult").textContent = message;
}
