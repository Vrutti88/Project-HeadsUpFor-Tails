document.addEventListener('DOMContentLoaded', () => {
    // ----- Carousel -----
    const carousel = document.getElementById('carousel');
    const leftButton = document.getElementById('leftBtn');
    const rightButton = document.getElementById('rightBtn');
    const indicators = document.getElementById('indicators');
    const totalDots = 5;

    function getScrollStep() {
        return (carousel.scrollWidth - carousel.clientWidth) / 4;
    }

    function updateArrowVisibility() {
        const scrollLeft = carousel.scrollLeft;
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        leftButton?.classList.toggle('hidden', scrollLeft <= 10);
        rightButton?.classList.toggle('hidden', scrollLeft >= maxScrollLeft - 10);
    }

    leftButton?.addEventListener('click', () => {
        carousel.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    rightButton?.addEventListener('click', () => {
        carousel.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    carousel?.addEventListener('scroll', () => {
        updateArrowVisibility();
        updateActiveIndicator();
    });

    window.addEventListener('resize', updateArrowVisibility);
    updateArrowVisibility();

    function createIndicators() {
        indicators.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const btn = document.createElement('button');
            if (i === 0) btn.classList.add('active');
            btn.addEventListener('click', () => {
                const stepSize = (carousel.scrollWidth - carousel.clientWidth) / (totalDots - 1);
                carousel.scrollTo({ left: i * stepSize, behavior: 'smooth' });
            });
            indicators.appendChild(btn);
        }
    }

    function updateActiveIndicator() {
        const stepSize = (carousel.scrollWidth - carousel.clientWidth) / (totalDots - 1);
        const index = Math.round(carousel.scrollLeft / stepSize);
        Array.from(indicators.children).forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }

    createIndicators();
});


