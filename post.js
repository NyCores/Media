document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("image-upload");
    const postBtn = document.getElementById("post-btn");
    const postsContainer = document.getElementById("posts-container");

    // Function to create a new post
    function createPost(imageUrl) {
        const postDiv = document.createElement("div");
        postDiv.className = "post";

        const image = document.createElement("img");
        image.src = imageUrl;

        const likeBtn = document.createElement("button");
        likeBtn.innerText = "Like";

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Add a comment";

        const commentBtn = document.createElement("button");
        commentBtn.innerText = "Comment";

        postDiv.appendChild(image);
        postDiv.appendChild(likeBtn);
        postDiv.appendChild(commentInput);
        postDiv.appendChild(commentBtn);

        postsContainer.appendChild(postDiv);
    }

    // Event listener for posting a new image
    postBtn.addEventListener("click", function () {
        const file = imageUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                createPost(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listener for liking a post (delegated to the posts container)
    postsContainer.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON" && event.target.innerText === "Like") {
            const post = event.target.parentElement;
            const likeBtn = event.target;
            likeBtn.innerText = "Liked";
            likeBtn.disabled = true;
        }
    });

    // Event listener for commenting on a post (delegated to the posts container)
    postsContainer.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON" && event.target.innerText === "Comment") {
            const post = event.target.parentElement;
            const commentInput = post.querySelector("input[type='text']");
            const comment = commentInput.value;
            if (comment.trim() !== "") {
                alert("Comment: " + comment);
                commentInput.value = "";
            }
        }
    });
});
