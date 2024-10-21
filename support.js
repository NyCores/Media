// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const customDonationInput = document.getElementById("customDonation");
    const donationButtons = document.querySelectorAll(".donation-button");
    const donateNowButton = document.getElementById("donateNow");

    // Add click event listener to each donation button
    donationButtons.forEach(button => {
        button.addEventListener("click", function () {
            const amount = this.textContent.replace("$", "");
            setDonationValue(amount);
        });
    });

    // Validate and format custom donation input
    customDonationInput.addEventListener("input", function () {
        let inputValue = this.value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters

        // If value exceeds 1,000,000, limit it
        if (inputValue > 1000000) {
            inputValue = 1000000;
        }

        if (inputValue >= 1) {
            this.value = `$${inputValue}`;
        } else {
            this.value = ""; // Clear if the input is invalid
        }
    });

    // Add event listener to the Donate Now button
    donateNowButton.addEventListener("click", function () {
        const donationAmount = customDonationInput.value.replace("$", ""); // Strip the dollar sign for validation
        
        // Check if the amount is between 1 and 1,000,000
        if (donationAmount && donationAmount >= 1 && donationAmount <= 1000000) {
            alert(`Thank you for your donation of $${donationAmount}!`);
            customDonationInput.value = ""; // Reset the input after submission
        } else {
            alert("Please enter a valid donation amount between $1 and $1,000,000.");
        }
    });

    // Helper function to set the custom donation value from buttons
    function setDonationValue(amount) {
        customDonationInput.value = `$${amount}`;
    }
});
