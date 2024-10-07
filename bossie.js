let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const indicators = document.getElementsByClassName("indicator");
const videoContainer = document.getElementById("video-container");
const backgroundVideo = document.getElementById("background-video");
const seeVideoButton = document.getElementsByClassName("see-video-button")[0];
const navLinks = document.getElementsByClassName("nav-link");
const exploreButton = document.querySelector(".explore-button");

function showSlides(n) {
  if (n !== undefined) {
    slideIndex = n;
  } else {
    slideIndex++;
    if (slideIndex >= slides.length) {
      slideIndex = 0;
    }
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  for (let i = 0; i < indicators.length; i++) {
    indicators[i].className = indicators[i].className.replace(" active", "");
  }
  slides[slideIndex].classList.add("active");
  indicators[slideIndex].className += " active";
}

function currentSlide(n) {
  showSlides(n);
}

function autoSlide() {
  showSlides();
  setTimeout(autoSlide, 3000); // Change image every 3 seconds
}

function playVideo() {
  if (backgroundVideo.style.display === "block") {
    backgroundVideo.pause();
    backgroundVideo.style.display = "none";
    videoContainer.style.display = "none";
    seeVideoButton.classList.remove("pause");
    seeVideoButton.classList.add("play");
    document.getElementsByClassName("slideshow")[0].style.display = "block";
    autoSlide();
    for (let i = 0; i < indicators.length; i++) {
      indicators[i].style.display = "block";
    }
  } else {
    backgroundVideo.style.display = "block";
    backgroundVideo.controls = false;
    backgroundVideo.play();
    videoContainer.style.display = "block";
    document.getElementsByClassName("slideshow")[0].style.display = "none";
    seeVideoButton.classList.remove("play");
    seeVideoButton.classList.add("pause");
    for (let i = 0; i < indicators.length; i++) {
      indicators[i].style.display = "none";
    }
    backgroundVideo.onended = function () {
      backgroundVideo.style.display = "none";
      videoContainer.style.display = "none";
      seeVideoButton.classList.remove("pause");
      seeVideoButton.classList.add("play");
      document.getElementsByClassName("slideshow")[0].style.display = "block";
      autoSlide();
      for (let i = 0; i < indicators.length; i++) {
        indicators[i].style.display = "block";
      }
    };
  }
}

function handleNavClick(event) {
  const target = event.target;
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove("clicked");
  }
  target.classList.add("clicked");
}

function expandVideo(event) {
  const video = event.target;
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) { /* Firefox */
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) { /* IE/Edge */
    video.msRequestFullscreen();
  }
}

function expandIconImage(event) {
  const iconImage = event.target;
  // Implement the logic to expand icon image with content
}

document.addEventListener("DOMContentLoaded", function() {
  autoSlide();
  for (let i = 0; i < indicators.length; i++) {
    indicators[i].addEventListener("click", function() {
      currentSlide(i);
    });
  }
  seeVideoButton.addEventListener("click", playVideo);
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", handleNavClick);
  }
  backgroundVideo.addEventListener("dblclick", expandVideo);
  // Add event listener for icon images
  // document.querySelectorAll(".icon-image-class").forEach(icon => {
  //   icon.addEventListener("click", expandIconImage);
  // });
  exploreButton.addEventListener("click", function() {
    window.location.href = "subscribe.html";
  });
});
