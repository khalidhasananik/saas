const grid = document.getElementById('resultsGrid');
const rawData = localStorage.getItem('priceData');
const data = rawData ? JSON.parse(rawData) : [];

if (!data || data.length === 0) {
    alert("No data found. Please search again.");
    window.location.href = 'price-scout.html';
}

data.forEach(item => {
    // 1. Star Rating Logic
    const rating = item.rating || 0;
    const rounded = Math.round(rating); // Round 4.6 -> 5, 4.2 -> 4

    // Generate 5 SVG Stars
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        // Simple SVG star. If i <= rounded, fill it black (or gold), else grey.
        const fill = i <= rounded ? '#000000' : '#D9D9D9';
        // Note: Using SVG directly to avoid missing 'image.png' issues
        starsHtml += `
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0L7.34708 4.1459H11.7063L8.17963 6.7082L9.52671 10.8541L6 8.2918L2.47329 10.8541L3.82037 6.7082L0.293661 4.1459H4.65292L6 0Z" fill="${fill}"/>
            </svg>
        `;
    }

    // 2. Clean Price (User wants exact display, so keep string)
    // But ensure it fits design.

    // 3. Create Card HTML
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="pc-img-container">
            <img src="${item.imageUrl}" alt="Product" class="pc-img">
        </div>
        <div class="pc-domain">${item.source || 'Unknown Source'}</div>
        <div class="pc-title" title="${item.title}">${item.title}</div>

        <div class="pc-rating">
            <div class="stars">${starsHtml}</div>
            <span class="rating-text">${rating}</span>
        </div>

        <div class="pc-divider"></div>

        <div class="pc-footer">
            <div class="pc-price">${item.price}</div>
            <a href="${item.link}" target="_blank" class="pc-btn">
                View Deal <img src="icons/right.png" alt=">">
            </a>
        </div>
    `;

    grid.appendChild(card);
});