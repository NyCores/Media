// Existing code
document.getElementById("subscribe-btn").addEventListener("click", function() {
    window.location.href = "subscribe.html";
});

// New additions
function isSubscribed() {
    return localStorage.getItem('subscribed') === 'true';
}

function checkSubscription() {
    if (!isSubscribed()) {
        window.location.href = 'paywall.html';
    }
}

if (window.location.pathname.includes('post.html')) {
    checkSubscription();
}

// Simulate subscription process after redirection
if (window.location.pathname.includes('subscribe.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const completeSubscriptionBtn = document.createElement('button');
        completeSubscriptionBtn.textContent = 'Complete Subscription';
        completeSubscriptionBtn.addEventListener('click', function() {
            localStorage.setItem('subscribed', 'true');
            alert('Subscription successful!');
            window.location.href = 'post.html';
        });
        document.body.appendChild(completeSubscriptionBtn);
    });
}
