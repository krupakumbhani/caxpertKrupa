document.addEventListener("DOMContentLoaded", function() {
    const marqueeContent = document.querySelector('.marquee-content');
    const marqueeWidth = marqueeContent.scrollWidth;
    const containerWidth = document.querySelector('.marquee-container').offsetWidth;
    
    const scrollSpeed = 10000; 

    function setScrollSpeed() {
        const speed = (marqueeWidth / scrollSpeed) * 100;
        marqueeContent.style.animationDuration = `${speed}s`;
    }

    setScrollSpeed();

    window.addEventListener('resize', () => {
        setScrollSpeed();
    });
});