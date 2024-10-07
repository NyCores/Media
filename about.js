// Get the modal
var modal = document.getElementById("photo-modal");

// Get the image and insert it inside the modal
var img = document.querySelector(".icon-photo");
var modalImg = document.querySelector(".modal-photo");

// When the user clicks on the image, open the modal 
img.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal content, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Adjust modal position
function centerModal() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.style.top = "50%";
    modalContent.style.transform = "translateY(-50%)";
}

centerModal();
