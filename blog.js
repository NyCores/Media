document.addEventListener('DOMContentLoaded', function() {
    const plane = document.querySelector('.plane');

    // Initial animation
    gsap.to(plane, {
        duration: 1,
        x: 0,
        y: 0,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });

    // Register scroll event
    window.addEventListener('scroll', function() {
      // Get the scroll position
        const scrollPosition = window.scrollY;

      // Animate the plane's rotation based on the scroll
        gsap.to(plane, { duration: 0.5, rotation: scrollPosition });
    });
});
