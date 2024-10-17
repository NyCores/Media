document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".header");
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    const maroonLine = document.createElement('div');
    maroonLine.className = 'maroon-line';
    document.body.appendChild(maroonLine);

    // Add or remove the transparent class based on the current page
    if (currentPage === "collab.html") {
        header.classList.remove("transparent");
    } else {
        header.classList.add("transparent");
    }

    // Set unique padding for each page
    navLinks.forEach(link => {
        if (link.classList.contains('home')) {
            link.style.setProperty('--bubble-padding', '0px 21px');
        } else if (link.classList.contains('about')) {
            link.style.setProperty('--bubble-padding', '0px 22px');
        } else if (link.classList.contains('support')) {
            link.style.setProperty('--bubble-padding', '0px 27px');
        } else if (link.classList.contains('collar')) {
            link.style.setProperty('--bubble-padding', '0px 22px');
        } else if (link.classList.contains('media')) {
            link.style.setProperty('--bubble-padding', '0px 21px');
        } else {
            link.style.setProperty('--bubble-padding', '0px 21px'); // Default value
        }
    });

    // Create and manage bubbles
    const bubbleCount = 5; // Adjust number of bubbles
    const bubbles = [];

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        document.body.appendChild(bubble);
        bubbles.push(bubble);
    }

    document.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;

        bubbles.forEach((bubble, index) => {
            const delay = index * 100; // Stagger the bubbles
            setTimeout(() => {
                bubble.style.left = `${x}px`;
                bubble.style.top = `${y}px`;
                bubble.classList.remove('popped');
            }, delay);
        });

        // Update maroon line position
        const maroonLine = document.querySelector('.maroon-line');
        if (maroonLine) {
            navLinks.forEach(link => {
                const rect = link.getBoundingClientRect();
                if (x > rect.left && x < rect.right) {
                    maroonLine.style.width = `${rect.width}px`;
                    maroonLine.style.left = `${rect.left}px`;
                    maroonLine.style.top = `${rect.bottom + window.scrollY}px`;
                    maroonLine.style.transform = 'scaleX(1)';
                } else {
                    maroonLine.style.transform = 'scaleX(0)';
                }
            });
        }
    });

    document.addEventListener('click', () => {
        bubbles.forEach((bubble, index) => {
            const delay = index * 100; // Stagger the popping
            setTimeout(() => {
                bubble.classList.add('popped');
            }, delay);
        });

        // Reset bubbles after animation
        setTimeout(() => {
            bubbles.forEach(bubble => {
                bubble.classList.remove('popped');
            });
        }, 400); // Match the duration of the pop animation
    });

    // Ensure maroon line for the active page is visible initially
    navLinks.forEach(link => {
        if (link.classList.contains('active-page')) {
            const rect = link.getBoundingClientRect();
            maroonLine.style.width = `${rect.width}px`;
            maroonLine.style.left = `${rect.left}px`;
            maroonLine.style.top = `${rect.bottom + window.scrollY}px`;
            maroonLine.style.transform = 'scaleX(1)';
        }
    });
});
