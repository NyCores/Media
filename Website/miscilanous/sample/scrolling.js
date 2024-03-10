document.addEventListener('DOMContentLoaded', function() {
    var lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop) {
            // Scrolling down
            document.body.classList.add('hide-scroll');
        } else {
            // Scrolling up
            document.body.classList.remove('hide-scroll');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
});
