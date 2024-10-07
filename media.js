document.addEventListener('DOMContentLoaded', function () {
    // Initialize global mute button
    initializeGlobalMuteButton();

    // Set up event listeners
    setupEventListeners();

    // Initialize video behavior and handle playback
    initializeVideoBehavior();
    handleVideoPlayback();
    window.addEventListener('scroll', debounce(handleVideoPlayback, 200));
    window.addEventListener('resize', debounce(handleVideoPlayback, 200));
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            pauseAllVideos();
        }
    });

    // Initialize avatar modal
    setupAvatarModal();

    // Fetch and insert footer content
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});

// Initialize global mute button
function initializeGlobalMuteButton() {
    const globalMuteButton = document.createElement('button');
    globalMuteButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Use icons for better UI
    globalMuteButton.style.position = 'fixed';
    globalMuteButton.style.top = '10px';
    globalMuteButton.style.right = '60px';
    globalMuteButton.style.zIndex = '1000';
    globalMuteButton.style.transform = 'translateX(50%)';
    document.body.appendChild(globalMuteButton);

    let isGlobalMuted = false;
    globalMuteButton.addEventListener('click', () => {
        isGlobalMuted = !isGlobalMuted;
        toggleMute(isGlobalMuted);
        globalMuteButton.innerHTML = isGlobalMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });
}

// Set up event listeners for file input and toggle button
function setupEventListeners() {
    document.getElementById('toggleButton').addEventListener('click', function () {
        switchAnimation();
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function (event) {
        const files = event.target.files;
        for (let file of files) {
            createCard(file);
        }
    });

    // Hamburger menu toggle
    $('.hamburger').on('click', function () {
        const menu = $('.menuBg');
        const nav = $('.mobileNav');
        toggleMenu(menu, nav, '.hamburger');
    });

    // Settings menu toggle
    $('.settings').on('click', function () {
        const menu = $('.settingsBg');
        const nav = $('.settingsNav');
        toggleMenu(menu, nav, '.settings');
    });

    document.querySelector('.mute-button').addEventListener('click', () => toggleMute());

    // Avatar modal event listeners
    const avatar = document.querySelector('.avatar');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close');

    avatar.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Function to toggle the menu with animation
function toggleMenu(menu, nav, buttonClass) {
    const isVisible = menu.hasClass('showMenu');
    const isOpen = $(buttonClass).hasClass('open');

    // Close other menus immediately without animation
    $('.menuBg, .settingsBg').not(menu).each(function() {
        if ($(this).hasClass('showMenu')) {
            $(this).removeClass('showMenu').addClass('hideMenu');
            $(this).siblings('.mobileNav, .settingsNav').removeClass('fadeIn');
        }
    });

    $('.hamburger, .settings').not(buttonClass).each(function() {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).attr('aria-expanded', false);
        }
    });

    if (isVisible) {
        menu.removeClass('showMenu').addClass('hideMenu');
        nav.removeClass('fadeIn');
        $(buttonClass).removeClass('open');
        menu.attr('aria-hidden', true);
        $(buttonClass).attr('aria-expanded', false);
    } else {
        menu.removeClass('hideMenu').addClass('showMenu');
        nav.addClass('fadeIn');
        $(buttonClass).addClass('open');
        menu.attr('aria-hidden', false);
        $(buttonClass).attr('aria-expanded', true);
    }
}

// Function to switch animations
function switchAnimation() {
    const currentAnimation = document.querySelector('.animation-container iframe:not([style*="display: none"])');
    const nextAnimation = currentAnimation.nextElementSibling || document.querySelector('.animation-container iframe');
    currentAnimation.style.display = 'none';
    nextAnimation.style.display = 'block';
}

// Function to create a new card
function createCard(file) {
    const template = document.getElementById('cardTemplate');
    const card = template.content.cloneNode(true);
    const container = document.querySelector('.card-container');

    card.querySelector('.card').dataset.postId = generatePostId(); // Assign a unique ID

    const reader = new FileReader();
    reader.onload = function (e) {
        const imagePreview = card.querySelector('.main-image[src=""]');
        const videoPreview = card.querySelector('video');

        if (file.type.startsWith('image/')) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        } else if (file.type.startsWith('video/')) {
            videoPreview.src = e.target.result;
            videoPreview.style.display = 'block';
            videoPreview.autoplay = true;
            videoPreview.loop = true;
            videoPreview.controls = false;

            videoPreview.addEventListener('click', () => {
                if (videoPreview.paused) {
                    pauseAllVideos();
                    videoPreview.play();
                    videoPreview.nextElementSibling.style.display = 'none';
                } else {
                    videoPreview.pause();
                }
            });

            videoPreview.addEventListener('pause', () => {
                const imagePreview = videoPreview.nextElementSibling;
                if (!isElementInViewport(videoPreview) && imagePreview) {
                    imagePreview.src = captureVideoFrame(videoPreview);
                    imagePreview.style.display = 'block';
                }
            });
        }

        container.appendChild(card);
        initializeCard(container.lastElementChild);
        setupOptionsMenu(container.lastElementChild);
    };
    reader.readAsDataURL(file);
}

// Function to initialize card actions
function initializeCard(card) {
    const postTime = new Date();

    function updateTimePosted() {
        const now = new Date();
        const diff = now - postTime;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let timeString;
        if (days > 0) {
            timeString = `${days}d`;
        } else if (hours > 0) {
            timeString = `${hours}h`;
        } else {
            timeString = `${minutes}m`;
        }

        card.querySelector('.time-posted').textContent = timeString;
    }

    function showHideComments(initialLoad = true) {
        const comments = card.querySelectorAll('.comments-section p');
        const viewCommentsBtn = card.querySelector('.view-comments');
        const maxVisible = 3;
        const maxLines = 15;
        const showMore = viewCommentsBtn.textContent.includes('View more');

        if (initialLoad || !showMore) {
            comments.forEach((comment, index) => {
                comment.style.display = index < maxVisible ? 'block' : 'none';
            });
            viewCommentsBtn.textContent = `View more comments ${ comments.length}`;
        } else {
            comments.forEach((comment, index) => {
                comment.style.display = index < maxLines ? 'block' : 'none';
            });
            viewCommentsBtn.textContent = 'Hide comments';
        }
    }

    card.querySelector('.like-post').addEventListener('click', function() {
        const likesElement = card.querySelector('.likes');
        likesElement.innerHTML = likeFeatures.likePost();
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });

    card.querySelector('.add-comment').addEventListener('click', function() {
        const comment = prompt('Enter your comment:');
        const result = commentFeatures.addComment(comment);
        if (result) {
            const commentElement = document.createElement('p');
            commentElement.textContent = result.text;
            card.querySelector('.comments-section').appendChild(commentElement);
            showHideComments(); // Update comments view after adding a comment
        }
    });

    card.querySelector('.view-comments').addEventListener('click', function () {
        showHideComments(false);
    });

    updateTimePosted();
    setInterval(updateTimePosted, 60000);
    showHideComments();
}

// Utility function to debounce actions (like scroll/resize events)
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to capture a video frame
function captureVideoFrame(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
}

// Function to check if an element is in the viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to pause all videos on the page
function pauseAllVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (!video.paused) {
            video.pause();
            if (video.nextElementSibling) {
                video.nextElementSibling.style.display = 'block';
            }
        }
    });
}

// Function to handle video playback based on viewport focus
function handleVideoPlayback() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const imagePreview = video.nextElementSibling;
        if (isElementInViewport(video)) {
            if (video.paused) {
                pauseAllVideos();
                video.play();
                if (imagePreview) {
                    imagePreview.style.display = 'none';
                }
            }
        } else {
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
                if (imagePreview) {
                    imagePreview.src = captureVideoFrame(video);
                    imagePreview.style.display = 'block';
                }
            }
        }
    });
}

// Function to toggle mute for all videos
function toggleMute(forceMute) {
    const videos = document.querySelectorAll('video');
    const isMuted = forceMute !== undefined ? forceMute : !videos[0].muted;
    videos.forEach(video => video.muted = isMuted);
    document.querySelector('.mute-button').textContent = isMuted ? 'Unmute All' : 'Mute All';
}

// Set up avatar modal functionality
function setupAvatarModal() {
    const modal = document.getElementById("photo-modal");
    if (!modal) return; // Ensure modal exists

    document.querySelectorAll('.avatar').forEach(avatar => {
        avatar.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Mock like and comment features
const likeFeatures = {
    likeCount: 1,
    likePost: function() {
        this.likeCount++;
        return this.likeCount + ' <i class="fas fa-heart"></i>';
    }
};

const commentFeatures = {
    commentCount: 0,
    addComment: function(comment) {
        if (comment) {
            this.commentCount++;
            return {
                text: comment,
                count: this.commentCount
            };
        }
        return null;
    }
};

// Function to handle options menu toggle
function setupOptionsMenu(card) {
    const optionsButton = card.querySelector('.options-button');
    const optionsMenu = card.querySelector('.options-menu');
    const shareButton = card.querySelector('.share-button');
    const deleteButton = card.querySelector('.delete-button');
    const editButton = card.querySelector('.edit-button');

    optionsButton.addEventListener('click', function (e) {
        optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
    });

    document.addEventListener('click', function (e) {
        if (!optionsMenu.contains(e.target) && !optionsButton.contains(e.target)) {
            optionsMenu.style.display = 'none';
        }
    });

    shareButton.addEventListener('click', function () {
        const postLink = window.location.href + '#' + card.dataset.postId;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post!',
                text: 'I found this interesting post for you.',
                url: postLink
            }).then(() => {
                console.log('Post shared successfully');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            showShareOptions(postLink);
        }
    });

    deleteButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this post?')) {
            card.remove();
        }
    });

    editButton.addEventListener('click', function () {
        const hashtagElement = card.querySelector('.hashtag');
        const currentHashtag = hashtagElement.textContent;

        const textarea = document.createElement('textarea');
        textarea.value = currentHashtag;
        textarea.style.width = '549px';
        textarea.style.height = '40px';
        textarea.style.fontSize = '16px';
        textarea.style.padding = '8px';
        textarea.style.borderRadius = '4px';
        textarea.style.marginTop = '10px';

        hashtagElement.innerHTML = '';
        hashtagElement.appendChild(textarea);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.marginTop = '10px';
        saveButton.style.backgroundColor = 'goldenrod';
        saveButton.style.color = 'white';
        saveButton.style.padding = '8px 12px';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';

        hashtagElement.appendChild(saveButton);

        saveButton.addEventListener('click', function () {
            const newHashtag = textarea.value.trim();
            if (newHashtag) {
                hashtagElement.innerHTML = newHashtag;
            } else {
                alert('Hashtag cannot be empty.');
            }
        });
    });
}

function showShareOptions(postLink) {
    const shareModal = document.createElement('div');
    shareModal.classList.add('share-modal');

    shareModal.innerHTML = `
        <div class="modal-content">
            <h3>Share this post</h3>
            <button class="copy-link-button">Copy Link</button>
            <button class="twitter-share-button">Share on Twitter</button>
            <button class="facebook-share-button">Share on Facebook</button>
            <button class="instagram-share-button">Share on Instagram</button>
            <button class="close-share-modal">×</button>
        </div>
    `;

    document.body.appendChild(shareModal);

    shareModal.querySelector('.copy-link-button').addEventListener('click', function () {
        navigator.clipboard.writeText(postLink).then(() => {
            alert('Link copied to clipboard!');
            shareModal.remove();
        });
    });

    shareModal.querySelector('.twitter-share-button').addEventListener('click', function () {
        const twitterUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20post!&url=${encodeURIComponent(postLink)}`;
        window.open(twitterUrl, '_blank');
    });

    shareModal.querySelector('.facebook-share-button').addEventListener('click', function () {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`;
        window.open(facebookUrl, '_blank');
    });

    shareModal.querySelector('.close-share-modal').addEventListener('click', function () {
        shareModal.remove();
    });
}

// Generate a unique ID for each card
function generatePostId() {
    return 'post-' + Math.random().toString(36).substr(2, 9);
}

function initializeCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
        initializeCard(card);
        setupOptionsMenu(card);
    });
}

// Ensure that flag functionality is initialized
function setupFlaggingFunctionality(card) {
    const flagButton = card.querySelector('.flag-button');
    flagButton.addEventListener('click', function () {
        card.classList.add('flagged');
        alert('This post has been flagged for review.');
    });
}

// Use `initializeCards()` to make sure existing cards on the page get initialized correctly
initializeCards();

// Post Categories/Tags Implementation
function setupPostCategories() {
    document.getElementById('categoryFilter').addEventListener('change', function () {
        const selectedCategory = this.value.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const cardCategory = card.dataset.category.toLowerCase();
            if (cardCategory === selectedCategory || selectedCategory === 'all') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    document.getElementById('tagSearch').addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const cardTags = card.dataset.tags.toLowerCase();
            if (cardTags.includes(searchQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Real-Time Notifications Implementation
function setupRealTimeNotifications() {
    const socket = new WebSocket('wss://your-websocket-server-url');

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.type === 'new-comment') {
            displayNotification(`New comment: "${data.comment}"`);
        } else if (data.type === 'new-like') {
            displayNotification(`Your post got a new like!`);
        }
    };

    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Automatically remove the notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Advanced Search with Filters Implementation
function setupAdvancedSearch() {
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const filterDate = document.getElementById('filterDate');

    function filterPosts() {
        const query = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory.value.toLowerCase();
        const selectedDate = filterDate.value;

        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const cardCategory = card.dataset.category.toLowerCase();
            const postDate = new Date(card.dataset.date).toISOString().split('T')[0];

            const matchesQuery = title.includes(query);
            const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
            const matchesDate = selectedDate === '' || postDate === selectedDate;

            if (matchesQuery && matchesCategory && matchesDate) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterPosts);
    filterCategory.addEventListener('change', filterPosts);
    filterDate.addEventListener('change', filterPosts);
}

// Customizable User Profile Implementation
function setupUserProfile() {
    const avatarUpload = document.getElementById('avatarUpload');
    const usernameInput = document.getElementById('username');
    const bioInput = document.getElementById('bio');
    const saveProfileButton = document.getElementById('saveProfile');

    saveProfileButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const bio = bioInput.value.trim();

        if (username && bio) {
            localStorage.setItem('username', username);
            localStorage.setItem('bio', bio);

            // If avatar is uploaded, store it in localStorage
            if (avatarUpload.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    localStorage.setItem('avatar', e.target.result);
                };
                reader.readAsDataURL(avatarUpload.files[0]);
            }

            alert('Profile saved successfully!');
            loadUserProfile(); // Load and display updated profile
        } else {
            alert('Please fill in both username and bio.');
        }
    });

    function loadUserProfile() {
        const storedUsername = localStorage.getItem('username');
        const storedBio = localStorage.getItem('bio');
        const storedAvatar = localStorage.getItem('avatar');

        if (storedUsername) document.getElementById('profileUsername').textContent = storedUsername;
        if (storedBio) document.getElementById('profileBio').textContent = storedBio;
        if (storedAvatar) document.getElementById('profileAvatar').src = storedAvatar;
    }

    loadUserProfile(); // Load profile data on page load
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function () {
    setupPostCategories();
    setupRealTimeNotifications();
    setupAdvancedSearch();
    setupUserProfile();
});

// Profile Settings Implementation
document.addEventListener('DOMContentLoaded', function () {
    const profileLink = document.querySelector('.profile-link');
    const profileSettings = document.getElementById('profileSettings');

    profileLink.addEventListener('click', function (e) {
        e.preventDefault();
        profileSettings.style.display = profileSettings.style.display === 'none' ? 'block' : 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const profileLink = document.querySelector('.profile-link');
    const profileSettings = document.getElementById('profileSettings');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileUsername = document.getElementById('profileUsername');
    const profileBio = document.getElementById('profileBio');
    const avatarUpload = document.getElementById('avatarUpload');
    const usernameInput = document.getElementById('username');
    const bioInput = document.getElementById('bio');
    const saveProfileButton = document.getElementById('saveProfile');

    // Show the profile settings section when the profile link is clicked
    profileLink.addEventListener('click', function (e) {
        e.preventDefault();
        profileSettings.style.display = profileSettings.style.display === 'none' ? 'block' : 'none';
    });

    // Save profile changes and update the avatar and username
    saveProfileButton.addEventListener('click', () => {
        const newUsername = usernameInput.value.trim();
        const newBio = bioInput.value.trim();

        if (newUsername) {
            profileUsername.textContent = newUsername;
            localStorage.setItem('username', newUsername);
        }

        if (newBio) {
            profileBio.textContent = newBio;
            localStorage.setItem('bio', newBio);
        }

        if (avatarUpload.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileAvatar.src = e.target.result;
                localStorage.setItem('avatar', e.target.result);
            };
            reader.readAsDataURL(avatarUpload.files[0]);
        }

        alert('Profile updated successfully!');
        profileSettings.style.display = 'none'; // Hide the profile settings after saving
    });

    // Load stored profile details on page load
    function loadProfile() {
        const storedUsername = localStorage.getItem('username');
        const storedBio = localStorage.getItem('bio');
        const storedAvatar = localStorage.getItem('avatar');

        if (storedUsername) profileUsername.textContent = storedUsername;
        if (storedBio) profileBio.textContent = storedBio;
        if (storedAvatar) profileAvatar.src = storedAvatar;

        // Show the user info section when #profile is clicked
        const hash = window.location.hash;
        if (hash === '#profile') {
            document.querySelector('.user-info').style.display = 'block';
        }
    }

    loadProfile();
});
    