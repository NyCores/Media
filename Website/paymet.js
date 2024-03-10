document.getElementById("subscription-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Here you would typically send the form data to a server for processing
    // For this example, let's just show an alert to indicate successful subscription
    alert("Subscription successful! You now have access to premium content.");

    // Optionally, you can redirect the user to a thank you page or back to the content they were trying to access
    window.location.href = ".html"; // Redirect to home page
});
