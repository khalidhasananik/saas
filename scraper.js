const startBtn = document.getElementById('startBtn');
const urlInput = document.getElementById('fbUrlInput');
const errorMsg = document.getElementById('errorMessage');
const loader = document.getElementById('loaderSpinner');
const backdrop = document.getElementById('loaderBackdrop');

// UPDATED: Using your Cloudflare Worker Proxy
const PROXY_URL = 'https://utilbook.khalid-hasan1.workers.dev';

startBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();

    // 1. Basic Validation
    if (!url) {
        showError("Please enter a valid Facebook URL.");
        return;
    }

    // 2. Show Loader & Reset UI
    errorMsg.style.display = 'none';
    startBtn.disabled = true;
    loader.style.display = 'block';
    backdrop.style.display = 'block';

    try {
        // 3. Send Request to Worker (Proxy)
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // 4. Validate Response Data
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No posts found or invalid format');
        }

        // 5. Limit to 5 posts
        const slicedData = data.slice(0, 5);

        // 6. Save to LocalStorage
        localStorage.setItem('scrapedData', JSON.stringify(slicedData));

        // 7. Redirect to Overview
        window.location.href = 'overview.html';

    } catch (error) {
        console.error('Error:', error);
        showError("Something went wrong! The server might be busy or the URL is invalid.");

        // Hide Loader
        loader.style.display = 'none';
        backdrop.style.display = 'none';
        startBtn.disabled = false;
    }
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}