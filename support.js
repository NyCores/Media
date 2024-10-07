document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("donation-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // For now, just a simple alert. Replace this with actual form submission logic.
        alert("Thank you for your donation!");
        
        // Reset the form
        form.reset();
    });
});
