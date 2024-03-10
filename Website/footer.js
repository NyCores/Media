document.addEventListener("DOMContentLoaded", function () {
    var footerPlaceholder = document.getElementById("footer-placeholder");

    // Function to import footer.html into the main page
    function includeFooter() {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }

    // Call the function to include the footer
    includeFooter();
});

// <--> // Handle click event for footer subscription link to redirect to subscription page
// document.getElementById("footer-link").addEventListener("click", function () {
//    window.location.href = "paywall.html"; // Redirect to subscription page
//});
