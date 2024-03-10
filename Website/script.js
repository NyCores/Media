document.addEventListener("DOMContentLoaded", function () {
    var introVideo = document.getElementById("intro-video");
    var introVideoContainer = document.getElementById("intro-video-container");
    var mainContent = document.getElementById("main-content");
    var closeVideoBtn = document.getElementById("close-video-btn");
    var endIntroBtn = document.getElementById("end-intro-btn");
    var introBtn = document.getElementById("intro-btn");
    var muteButton = document.getElementById("mute-btn");
    var unmuteButton = document.getElementById("unmute-btn");

    introVideo.addEventListener("ended", function () {
        introVideoContainer.style.display = "none";
        mainContent.style.display = "block";
    });

    closeVideoBtn.addEventListener("click", function () {
        introVideo.pause();
        introVideoContainer.style.display = "none";
        mainContent.style.display = "block";
        muteButton.style.display = "none";
        unmuteButton.style.display = "none";
        endIntroBtn.style.display = "inline-block";
        introBtn.style.display = "inline-block";
        document.body.style.alignItems = "auto"; // Change align-items property of the body to auto
        document.querySelector('nav').style.display = "block"; // Show the navigation bar when the video is skipped
    });

    endIntroBtn.addEventListener("click", function () {
        history.back();
    });

    introBtn.addEventListener("click", function () {
        location.reload();
    });

    muteButton.addEventListener("click", function () {
        introVideo.muted = true;
        muteButton.style.display = "none";
        unmuteButton.style.display = "inline-block";
    });

    unmuteButton.addEventListener("click", function () {
        introVideo.muted = false;
        unmuteButton.style.display = "none";
        muteButton.style.display = "inline-block";
    });

    // Handle click event for header to redirect to subscription page
    var headerLink = document.getElementById("header-link");
    headerLink.addEventListener("click", function () {
        window.location.href = "paywall.html";
    });

    // Handle click event for footer subscription link to redirect to subscription page
    var footerLink = document.getElementById("footer-link");
    footerLink.addEventListener("click", function () {
        window.location.href = "paywall.html";
    });
});

// JavaScript Function to toggle subscribe area visibility
function toggleSubscribeArea() {
    var subscribeArea = document.getElementById("subscribe-area");
    if (subscribeArea.style.display === "none") {
        subscribeArea.style.display = "block";
    } else {
        subscribeArea.style.display = "none";
    }
}